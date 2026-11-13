import type { CSSProperties } from "react";
import "./todo-auto-scroll.scss";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  /** Дата закрытия в формате YYYY-MM-DD. Указывается для выполненной задачи. */
  completedAt?: string;
}

interface Props {
  items: TodoItem[];
}

const formatCompletionDate = (date: string) => {
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  return parts.reverse().join(".");
};

export const TodoAutoScroll = ({ items }: Props) => {
  const duration = Math.max(items.length * 4, 18);
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
            {items.map((item) => (
              <li
                className="todo-auto-scroll__item"
                data-completed={item.completed}
                key={copy + "-" + item.id}
              >
                <div className="todo-auto-scroll__task-line">
                  <span
                    className="todo-auto-scroll__checkbox"
                    aria-hidden="true"
                  >
                    {item.completed ? "[x]" : "[ ]"}
                  </span>
                  <span className="todo-auto-scroll__task-text">
                    {item.text}
                  </span>
                </div>
                {item.completed && item.completedAt && (
                  <time
                    className="todo-auto-scroll__completed-at"
                    dateTime={item.completedAt}
                  >
                    Закрыта: {formatCompletionDate(item.completedAt)}
                  </time>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

TodoAutoScroll.displayName = "TodoAutoScroll";
