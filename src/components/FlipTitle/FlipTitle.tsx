import { useEffect, useState } from "react";
import type { TitleFlipConfig } from "../../config/types";
import "./FlipTitle.scss";

interface Props {
  title: string;
  flip: TitleFlipConfig;
}

/**
 * Заголовок-кубик: переворачивается на соседнюю грань, показывая второй текст.
 *
 * Обе грани лежат в 3D-пространстве (front и top), а поворот идёт ровно на 90°.
 * Поэтому анимация читается как перекат кубика, а не как плоское отражение.
 */
export const FlipTitle = ({ title, flip }: Props) => {
  const [flipped, setFlipped] = useState(false);
  const active = flip.enabled && flip.back !== "";

  useEffect(() => {
    if (!active) {
      setFlipped(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!document.hidden) setFlipped((value) => !value);
    }, flip.interval);

    return () => window.clearInterval(timer);
  }, [active, flip.interval]);

  if (!active) return <h1>{title}</h1>;

  return (
    <h1 className="flip-title">
      <span
        className={`flip-title__cube${flipped ? " flip-title__cube--flipped" : ""}`}
      >
        <span className="flip-title__face flip-title__face--front">
          {flip.front || title}
        </span>
        <span
          className="flip-title__face flip-title__face--back"
          aria-hidden="true"
        >
          {flip.back}
        </span>
      </span>
    </h1>
  );
};

FlipTitle.displayName = "FlipTitle";
