import Markdown from "markdown-to-jsx/react";
import aboutMarkdown from "../../content/about.md?raw";
import type { ProfileConfig, TwitchConfig } from "../../config/types";
import { ProfileMarquee } from "../ProfileMarquee/ProfileMarquee";
import "./about-screen.scss";

interface Props {
  profile: ProfileConfig;
  twitch: TwitchConfig;
}

export const AboutScreen = ({ profile, twitch }: Props) => (
  <div className="about-screen" aria-label="Информация обо мне">
    <aside
      className="about-screen__side about-screen__side--down"
      aria-hidden="true"
    >
      <ProfileMarquee profile={profile} twitch={twitch} direction="down" />
    </aside>

    <main className="about-screen__content" aria-label="Обо мне">
      <div className="about-screen__markdown">
        <Markdown>{aboutMarkdown}</Markdown>
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

AboutScreen.displayName = "AboutScreen";
