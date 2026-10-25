import { Col, Container } from "react-bootstrap";
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

  return (
    <>
      <MatrixBackground config={config.background.matrix} />
      <Container className="main-container">
        <Col>
          <AvatarBlock profile={config.profile} twitch={config.twitch} />
          <FlipTitle
            title={config.profile.title}
            flip={config.profile.titleFlip}
          />
          {config.groups.map((group) => (
            <LinkGroup key={group.id} group={group} />
          ))}
        </Col>
      </Container>
    </>
  );
};

MainContainer.displayName = "MainContainer";
