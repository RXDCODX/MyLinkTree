import type { CSSProperties } from "react";
import "./todo-auto-scroll.scss";

interface Props {
  items: string[];
}

export const TodoAutoScroll = ({ items }: Props) => {
  const duration = Math.max(items.length * 6, 24);
  const trackStyle = {
    "--todo-scroll-duration": duration + "s",
  } as CSSProperties;

  if (items.length === 0) {
    return <p className="todo-auto-scroll__empty">Пока задач нет.</p>;
  }

  return (
    <div
      className="todo-auto-scroll"
      role="region"
      aria-label="Список задач"
      tabIndex={0}
    >
      <div className="todo-auto-scroll__track" style={trackStyle}>
        {[0, 1].map((copy) => (
          <ul
            className="todo-auto-scroll__sequence"
            key={copy}
            aria-hidden={copy === 1}
          >
            {items.map((item, index) => (
              <li className="todo-auto-scroll__item" key={copy + "-" + index}>
                <span className="todo-auto-scroll__marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

TodoAutoScroll.displayName = "TodoAutoScroll";
