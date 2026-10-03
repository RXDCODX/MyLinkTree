import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "index.html");

const SSR_ENTRY = `
import { renderToString } from "react-dom/server";
import { MainContainer } from "./src/components/container.tsx";

export const render = () => renderToString(<MainContainer />);
`;

/**
 * Пре-рендер: собираем приложение в SSR-режиме и подставляем готовую разметку
 * в dist/index.html. Благодаря этому ссылки, аватарка и заголовок физически
 * присутствуют в исходном HTML — их видят поисковики и соцсети, которые не
 * выполняют JavaScript, и страница не «пустая» до гидрации.
 */
const run = async () => {
  if (!fs.existsSync(OUT)) {
    throw new Error("dist/index.html не найден — сначала выполните vite build");
  }

  fs.writeFileSync(path.join(ROOT, "__prerender_entry.tsx"), SSR_ENTRY, "utf8");

  try {
    const result = await build({
      configFile: false,
      logLevel: "error",
      appType: "custom",
      esbuild: { jsx: "automatic", jsxImportSource: "react" },
      build: {
        ssr: true,
        write: false,
        minify: false,
        assetsInlineLimit: () => true,
        rollupOptions: {
          input: path.join(ROOT, "__prerender_entry.tsx"),
          output: { entryFileNames: "__prerender.mjs", format: "es" },
        },
      },
    });

    const output = Array.isArray(result) ? result[0].output : result.output;
    const chunk = output.find((item) => item.type === "chunk");
    if (!chunk) throw new Error("SSR-сборка не дала чанк");

    const tempModule = path.join(DIST, "__prerender.mjs");
    fs.writeFileSync(tempModule, chunk.code, "utf8");

    const { render } = await import(pathToFileURL(tempModule).href);
    const markup = render();

    const html = fs.readFileSync(OUT, "utf8");
    const marker = '<div id="root"></div>';
    if (!html.includes(marker)) {
      throw new Error("В dist/index.html нет пустого <div id=\"root\">");
    }

    fs.writeFileSync(OUT, html.replace(marker, `<div id="root">${markup}</div>`), "utf8");
    fs.rmSync(tempModule, { force: true });

    console.log(
      `[prerender] в HTML добавлено ${markup.length.toLocaleString("ru")} символов разметки`,
    );
  } finally {
    fs.rmSync(path.join(ROOT, "__prerender_entry.tsx"), { force: true });
  }
};

await run();