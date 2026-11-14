import type { CSSProperties } from "react";
import { Container } from "react-bootstrap";
import { ScreenPager } from "./ScreenPager/ScreenPager";
import { AboutScreen } from "./AboutScreen/AboutScreen";
import { TodoScreen } from "./TodoScreen/TodoScreen";
import { useSiteConfig } from "../config/useSiteConfig";
import { useTitleMarquee } from "../hooks/useTitleMarquee";
import { AvatarBlock } from "./avatar/block";
import "./container.scss";
import { FlipTitle } from "./FlipTitle/FlipTitle";
import { LinkGroup } from "./LinkGroup/LinkGroup";
import { MatrixBackground } from "./MatrixBackground/MatrixBackground";

export const MainContainer = () => {
  const { config } = useSiteConfig();

  useTitleMarquee(config.profile.title, config.site.titleMarquee);

  const { profileHeightPercent, linksWidthPercent } = config.layout;
  const layoutStyle = {
    "--profile-rows": `${profileHeightPercent}fr`,
    "--links-rows": `${100 - profileHeightPercent}fr`,
    "--links-width": `${linksWidthPercent}vw`,
  } as CSSProperties;

  return (
    <>
      <MatrixBackground config={config.background.matrix} />
      <ScreenPager
        screens={[
          <Container
            as="main"
            fluid
            className="main-container"
            style={layoutStyle}
            key="home"
          >
            <section className="profile-panel" aria-label="Профиль">
              <AvatarBlock profile={config.profile} twitch={config.twitch} />
              <FlipTitle
                title={config.profile.title}
                flip={config.profile.titleFlip}
              />
            </section>

            <section className="links-panel" aria-label="Ссылки">
              {config.groups.map((group) => (
                <LinkGroup key={group.id} group={group} />
              ))}
            </section>
          </Container>,
          <AboutScreen
            profile={config.profile}
            twitch={config.twitch}
            key="about"
          />,
          <TodoScreen
            profile={config.profile}
            twitch={config.twitch}
            key="todo"
          />,
        ]}
      />
    </>
  );
};

MainContainer.displayName = "MainContainer";
