import { Col, Container } from "react-bootstrap";
import { LinkGroup } from "./LinkGroup/LinkGroup";
import { MatrixBackground } from "./MatrixBackground/MatrixBackground";
import { AvatarBlock } from "./avatar/block";
import { useSiteConfig } from "../config/useSiteConfig";
import { useTitleMarquee } from "../hooks/useTitleMarquee";
import "./container.scss";

export const MainContainer = () => {
  const { config } = useSiteConfig();

  useTitleMarquee(config.profile.title, config.site.titleMarquee);

  return (
    <>
      <MatrixBackground config={config.background.matrix} />
      <Container className="main-container">
        <Col>
          <AvatarBlock profile={config.profile} twitch={config.twitch} />
          <h1>{config.profile.title}</h1>
          {config.groups.map((group) => (
            <LinkGroup key={group.id} group={group} />
          ))}
        </Col>
      </Container>
    </>
  );
};

MainContainer.displayName = "MainContainer";
