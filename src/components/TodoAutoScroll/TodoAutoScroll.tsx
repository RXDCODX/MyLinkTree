import { Children, cloneElement, isValidElement } from "react";
import type {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
} from "react";
import type { CSSProperties } from "react";
import Markdown from "markdown-to-jsx/react";
import "./todo-auto-scroll.scss";

type CheckboxElement = ReactElement<{
  checked?: boolean;
  type?: string;
}>;

const isTaskCheckbox = (node: ReactNode): node is CheckboxElement =>
  isValidElement(node) &&
  node.type === "input" &&
  (node.props as { type?: string }).type === "checkbox";

const isBlockElement = (node: ReactNode) =>
  isValidElement(node) &&
  typeof node.type === "string" &&
  ["blockquote", "div", "hr", "ol", "p", "pre", "table", "ul"].includes(
    node.type,
  );

const MarkdownListItem = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"li">) => {
  const nodes = Children.toArray(children);
  const checkboxIndex = nodes.findIndex(isTaskCheckbox);

  if (checkboxIndex === -1) {
    return <li {...props}>{children}</li>;
  }

  const checkbox = nodes[checkboxIndex] as CheckboxElement;
  const completed = Boolean(checkbox.props.checked);
  const contentNodes = nodes.filter((_, index) => index !== checkboxIndex);
  const firstBlockIndex = contentNodes.findIndex(isBlockElement);
  const inlineContent =
    firstBlockIndex === -1
      ? contentNodes
      : contentNodes.slice(0, firstBlockIndex);
  const blockContent =
    firstBlockIndex === -1 ? [] : contentNodes.slice(firstBlockIndex);

  let label: ReactNode = inlineContent.length > 0 ? (
    <span className="todo-auto-scroll__task-label">{inlineContent}</span>
  ) : null;
  let additionalContent: ReactNode[] = blockContent;

  const firstBlock = blockContent[0];
  if (isValidElement(firstBlock) && firstBlock.type === "p") {
    const paragraph = firstBlock as ReactElement<
      ComponentPropsWithoutRef<"p">
    >;
    label = cloneElement(paragraph, {
      className: [
        paragraph.props.className,
        "todo-auto-scroll__task-label",
      ]
        .filter(Boolean)
        .join(" "),
    });
    additionalContent = blockContent.slice(1).map((node) => {
      if (!completed || !isValidElement(node) || node.type !== "p") {
        return node;
      }

      const dateParagraph = node as ReactElement<
        ComponentPropsWithoutRef<"p">
      >;
      return cloneElement(dateParagraph, {
        className: [
          dateParagraph.props.className,
          "todo-auto-scroll__completed-at",
        ]
          .filter(Boolean)
          .join(" "),
      });
    });
  }

  return (
    <li {...props} data-completed={completed}>
      {checkbox}
      {label}
      {additionalContent}
    </li>
  );
};

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
            <Markdown
              options={{
                slugify: (heading) => createHeadingSlug(heading, copy),
                overrides: {
                  li: MarkdownListItem,
                },
              }}
            >
              {content}
            </Markdown>
          </div>
        ))}
      </div>
    </div>
  );
};

TodoAutoScroll.displayName = "TodoAutoScroll";
