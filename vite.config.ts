import react from "@vitejs/plugin-react";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const CONFIG_FILE = "links.json";
const CONFIG_PATH = fileURLToPath(new URL(`./${CONFIG_FILE}`, import.meta.url));

interface SeoGroup {
  links: { label: string; url: string }[];
}

interface SeoConfig {
  site: {
    url: string;
    lang: string;
    locale: string;
    author: string;
    themeColor: string;
    description: string;
    keywords: string[];
    twitterSite: string;
    ogImage: string;
  };
  profile: {
    title: string;
    avatarUrl: string;
  };
  twitch: {
    displayName: string;
  };
  groups: SeoGroup[];
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const attribute = (value: string): string =>
  escapeHtml(value).replace(/\n/g, " ");

/** Относительный путь превращаем в абсолютный — соцсети требуют полный URL. */
const absoluteUrl = (origin: string, value: string): string =>
  /^https?:\/\//i.test(value)
    ? value
    : `${origin}/${value.replace(/^\/+/, "")}`;

const readSeoConfig = (): SeoConfig =>
  JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as SeoConfig;

const buildHeadTags = (config: SeoConfig): string => {
  const { site } = config;
  const origin = site.url.replace(/\/+$/, "");
  const title = config.profile.title;
  const description = site.description;
  const name = config.twitch.displayName || site.author;
  const image = absoluteUrl(origin, site.ogImage || config.profile.avatarUrl);

  const tags: string[] = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${attribute(description)}" />`,
    `    <meta name="author" content="${attribute(site.author)}" />`,
    `    <meta name="robots" content="index, follow, max-image-preview:large" />`,
    `    <meta name="theme-color" content="${attribute(site.themeColor)}" />`,
    `    <meta name="color-scheme" content="dark" />`,
    `    <meta name="format-detection" content="telephone=no" />`,
  ];

  if (site.keywords.length > 0) {
    tags.push(
      `    <meta name="keywords" content="${attribute(site.keywords.join(", "))}" />`,
    );
  }

  tags.push(
    `    <meta property="og:type" content="profile" />`,
    `    <meta property="og:site_name" content="${attribute(title)}" />`,
    `    <meta property="og:locale" content="${attribute(site.locale)}" />`,
    `    <meta property="og:url" content="${attribute(`${origin}/`)}" />`,
    `    <meta property="og:title" content="${attribute(title)}" />`,
    `    <meta property="og:description" content="${attribute(description)}" />`,
    `    <meta property="og:image" content="${attribute(image)}" />`,
    `    <meta property="og:image:alt" content="${attribute(name)}" />`,
    `    <meta property="og:image:width" content="300" />`,
    `    <meta property="og:image:height" content="300" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${attribute(title)}" />`,
    `    <meta name="twitter:description" content="${attribute(description)}" />`,
    `    <meta name="twitter:image" content="${attribute(image)}" />`,
    `    <meta name="twitter:image:alt" content="${attribute(name)}" />`,
  );

  if (site.twitterSite) {
    tags.push(
      `    <meta name="twitter:site" content="${attribute(site.twitterSite)}" />`,
    );
  }

  tags.push(
    `    <link rel="canonical" href="${attribute(`${origin}/`)}" />`,
    `    <link rel="alternate" hreflang="${attribute(site.lang)}" href="${attribute(`${origin}/`)}" />`,
  );

  const host = origin.replace(/^https?:\/\//, "");
  const sameAs = config.groups
    .flatMap((group) => group.links.map((link) => link.url))
    .filter((url) => /^https?:\/\//i.test(url))
    .filter((url) => !url.includes(host));

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: title,
    description,
    url: `${origin}/`,
    inLanguage: site.lang,
    mainEntity: {
      "@type": "Person",
      name,
      url: `${origin}/`,
      image,
      description,
      sameAs,
    },
  });

  tags.push(
    `    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>`,
  );

  return tags.join("\n");
};

/**
 * Отдаёт links.json из корня репозитория в dev-режиме, копирует его в dist
 * на сборке (чтобы конфиг правился на задеплоенном сайте без пересборки)
 * и генерирует статические метатеги, robots.txt и sitemap.xml из того же конфига.
 *
 * Метатеги именно статические: Telegram, Discord, VK и Twitter не выполняют JS
 * и читают только исходный HTML, поэтому OG-разметка обязана быть в нём.
 */
function siteConfig(): Plugin {
  const readConfig = (): string => fs.readFileSync(CONFIG_PATH, "utf8");

  return {
    name: "site-config",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname] = (req.url ?? "").split("?");
        if (pathname !== `/${CONFIG_FILE}`) {
          next();
          return;
        }
        try {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(readConfig());
        } catch (error) {
          next(error instanceof Error ? error : new Error(String(error)));
        }
      });
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(
          "</head>",
          `  ${buildHeadTags(readSeoConfig())}\n  </head>`,
        );
      },
    },
    generateBundle() {
      const origin = readSeoConfig().site.url.replace(/\/+$/, "");

      this.emitFile({
        type: "asset",
        fileName: CONFIG_FILE,
        source: readConfig(),
      });

      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
      });

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          "  <url>\n" +
          `    <loc>${origin}/</loc>\n` +
          "    <changefreq>weekly</changefreq>\n" +
          "    <priority>1.0</priority>\n" +
          "  </url>\n" +
          "</urlset>\n",
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), siteConfig(), viteSingleFile()],
});
