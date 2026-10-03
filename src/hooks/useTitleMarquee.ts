import { useEffect } from "react";
import type { TitleMarqueeConfig } from "../config/types";

/**
 * Бегущая строка в заголовке вкладки браузера.
 *
 * Меняет только document.title — статический <title> в HTML остаётся
 * целым, поэтому поисковые сниппеты и превью не портятся.
 */
export const useTitleMarquee = (
  title: string,
  config: TitleMarqueeConfig,
): void => {
  useEffect(() => {
    if (!config.enabled || title === "") {
      document.title = title;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.title = title;
      return;
    }

    const frame = `${title}${config.separator}`;
    const ring = frame.repeat(2);
    let offset = 0;

    const tick = () => {
      document.title = ring.slice(offset, offset + title.length);
      offset = offset + 1 >= frame.length ? 0 : offset + 1;
    };

    tick();
    const timer = window.setInterval(() => {
      if (!document.hidden) tick();
    }, config.speed);

    return () => {
      window.clearInterval(timer);
      document.title = title;
    };
  }, [title, config.enabled, config.speed, config.separator]);
};
