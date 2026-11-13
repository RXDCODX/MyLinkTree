import { TodoAutoScroll } from "../TodoAutoScroll/TodoAutoScroll";
import "./about-screen.scss";

const TODO_ITEMS = [
  "Добавить краткое описание о себе",
  "Рассказать о текущих проектах",
  "Добавить интересы и увлечения",
  "Подготовить список достижений",
  "Добавить планы на будущее",
  "Обновить контакты и полезные ссылки",
];

export const AboutScreen = () => (
  <div className="about-screen" aria-label="Информация обо мне">
    <section className="about-screen__panel" aria-labelledby="about-screen-title">
      <h1 className="about-screen__title" id="about-screen-title">
        Обо мне
      </h1>
      <div className="about-screen__text">
        <p>Здесь появится информация обо мне.</p>
        <p>
          Позже в этом блоке можно будет рассказать о себе, своих интересах и
          проектах.
        </p>
      </div>
    </section>

    <section className="about-screen__panel" aria-labelledby="about-screen-todo-title">
      <h2 className="about-screen__title" id="about-screen-todo-title">
        TODO
      </h2>
      <TodoAutoScroll items={TODO_ITEMS} />
    </section>
  </div>
);

AboutScreen.displayName = "AboutScreen";
