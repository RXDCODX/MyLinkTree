import Markdown from "markdown-to-jsx/react";
import aboutMarkdown from "../../content/about.md?raw";
import todoMarkdown from "../../content/todo.md?raw";
import { TodoAutoScroll } from "../TodoAutoScroll/TodoAutoScroll";
import "./about-screen.scss";

export const AboutScreen = () => (
  <div className="about-screen" aria-label="Информация обо мне">
    <section className="about-screen__panel" aria-label="Обо мне">
      <div className="about-screen__markdown">
        <Markdown>{aboutMarkdown}</Markdown>
      </div>
    </section>

    <section className="about-screen__panel" aria-label="TODO">
      <TodoAutoScroll content={todoMarkdown} />
    </section>
  </div>
);

AboutScreen.displayName = "AboutScreen";
