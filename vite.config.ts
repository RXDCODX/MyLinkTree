import fs from "node:fs";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const CONFIG_FILE = "links.json";
const CONFIG_PATH = new URL(`./${CONFIG_FILE}`, import.meta.url);

/**
 * Отдаёт links.json из корня репозитория в dev-режиме и копирует его в dist
 * на сборке, чтобы конфиг правился на задеплоенном сайте без пересборки.
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
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: CONFIG_FILE,
        source: readConfig(),
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), siteConfig(), viteSingleFile()],
});