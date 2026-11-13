import type { CSSProperties } from "react";
import { Container } from "react-bootstrap";
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

  const profileHeight = config.layout.profileHeightPercent;
  const layoutStyle = {
    "--profile-rows": `${profileHeight}fr`,
    "--links-rows": `${100 - profileHeight}fr`,
  } as CSSProperties;

  return (
    <>
      <MatrixBackground config={config.background.matrix} />
      <Container as="main" fluid className="main-container" style={layoutStyle}>
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
      </Container>
    </>
  );
};

MainContainer.displayName = "MainContainer";
