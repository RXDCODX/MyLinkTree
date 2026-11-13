import type { CSSProperties } from "react";
import Markdown from "markdown-to-jsx/react";
import "./todo-auto-scroll.scss";

interface Props {
  content: string;
}

const createHeadingSlug = (heading: string, copy: number) => {
  const slug = heading
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return `${copy}-${slug || "section"}`;
};

export const TodoAutoScroll = ({ content }: Props) => {
  const taskCount = content.match(/^\s*(?:[-*+]|\d+\.)\s+/gm)?.length ?? 0;
  const duration = Math.max(taskCount * 4, 18);
  const trackStyle = {
    "--todo-scroll-duration": duration + "s",
  } as CSSProperties;

  if (content.trim().length === 0) {
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
          <div
            className="todo-auto-scroll__sequence"
            key={copy}
            aria-hidden={copy === 1}
          >
            <Markdown options={{ slugify: (heading) => createHeadingSlug(heading, copy) }}>
              {content}
            </Markdown>
          </div>
        ))}
      </div>
    </div>
  );
};

TodoAutoScroll.displayName = "TodoAutoScroll";
