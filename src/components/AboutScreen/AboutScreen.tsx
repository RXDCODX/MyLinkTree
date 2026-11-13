import { TodoAutoScroll } from "../TodoAutoScroll/TodoAutoScroll";
import type { TodoItem } from "../TodoAutoScroll/TodoAutoScroll";
import "./about-screen.scss";

const TODO_ITEMS: TodoItem[] = [
  {
    id: "about",
    text: "Добавить краткое описание о себе",
    completed: false,
  },
  {
    id: "projects",
    text: "Рассказать о текущих проектах",
    completed: false,
  },
  {
    id: "interests",
    text: "Добавить интересы и увлечения",
    completed: false,
  },
  {
    id: "achievements",
    text: "Подготовить список достижений",
    completed: false,
  },
  {
    id: "plans",
    text: "Добавить планы на будущее",
    completed: false,
  },
  {
    id: "contacts",
    text: "Обновить контакты и полезные ссылки",
    completed: false,
  },
];

export const AboutScreen = () => (
  <div className="about-screen" aria-label="Информация обо мне">
    <section
      className="about-screen__panel"
      aria-labelledby="about-screen-title"
    >
      <h1 className="about-screen__title" id="about-screen-title">
        Обо мне
      </h1>
      <div className="about-screen__text">
        <p className="about-screen__text-line">
          Здесь появится информация обо мне.
        </p>
        <p className="about-screen__text-line">
          Позже в этом блоке можно будет рассказать о себе, своих интересах и
          проектах.
        </p>
      </div>
    </section>

    <section
      className="about-screen__panel"
      aria-labelledby="about-screen-todo-title"
    >
      <h2 className="about-screen__title" id="about-screen-todo-title">
        TODO
      </h2>
      <TodoAutoScroll items={TODO_ITEMS} />
    </section>
  </div>
);

AboutScreen.displayName = "AboutScreen";
