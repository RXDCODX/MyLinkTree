import { useEffect, useState } from "react";
import { bakedConfig } from "./siteConfig";
import { CONFIG_FILE, normalizeConfig } from "./normalize";
import type { SiteConfig, ConfigStatus } from "./types";

const configUrl = (): string => new URL(CONFIG_FILE, document.baseURI).href;

/**
 * Начальное состояние — встроенный в бандл конфиг, то есть ровно тот, которым
 * отрендерен HTML при сборке. После монтирования подтягиваем links.json,
 * чтобы правки на сервере подхватывались без пересборки.
 */
export const useSiteConfig = (): {
  config: SiteConfig;
  status: ConfigStatus;
} => {
  const [config, setConfig] = useState<SiteConfig>(bakedConfig);
  const [status, setStatus] = useState<ConfigStatus>("ready");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(configUrl(), {
          signal: controller.signal,
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        setConfig(normalizeConfig(await response.json()));
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn(
          `Не удалось обновить ${CONFIG_FILE}, остаётся встроенная версия.`,
          error,
        );
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  return { config, status };
};
