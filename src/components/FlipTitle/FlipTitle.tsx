import { useState } from "react";
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

  const firstWord = title.split(/\s+/, 1)[0] || title;
  const suffix = title.slice(firstWord.length);

  if (!active) return <h1>{title}</h1>;

  return (
    <h1
      className="flip-title"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
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
      <span className="flip-title__suffix">{suffix}</span>
    </h1>
  );
};

FlipTitle.displayName = "FlipTitle";
