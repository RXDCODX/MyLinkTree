import Markdown from "markdown-to-jsx/react";
import todoMarkdown from "../../content/todo.md?raw";
import type { ProfileConfig, TwitchConfig } from "../../config/types";
import { ProfileMarquee } from "../ProfileMarquee/ProfileMarquee";

interface Props {
  profile: ProfileConfig;
  twitch: TwitchConfig;
}

export const TodoScreen = ({ profile, twitch }: Props) => (
  <div
    className="about-screen about-screen--todo"
    aria-label="Список задач"
  >
    <aside
      className="about-screen__side about-screen__side--down"
      aria-hidden="true"
    >
      <ProfileMarquee profile={profile} twitch={twitch} direction="down" />
    </aside>

    <main className="about-screen__content" aria-label="TODO">
      <div className="about-screen__markdown">
        <Markdown>{todoMarkdown}</Markdown>
      </div>
    </main>

    <aside
      className="about-screen__side about-screen__side--up"
      aria-hidden="true"
    >
      <ProfileMarquee profile={profile} twitch={twitch} direction="up" />
    </aside>
  </div>
);

TodoScreen.displayName = "TodoScreen";
