import { Col, Container } from "react-bootstrap";
import { DonateBlock } from "./donate/block";
import { SocialBlock } from "./socials/block";
import "./container.scss";
import { OtherBlock } from "./other/block";
import { AvatarBlock } from "./avatar/block";
import { StreamsBlock } from "./streams/block";

export const MainContainer = () => {
  return (
    <>
      <div className="parent-container">
        <Container className="main-container">
          <Col>
            <AvatarBlock />
            <h1>AMURADZAKI'Z LINKTREE</h1>
            <DonateBlock />
            <StreamsBlock />
            <SocialBlock />
            <OtherBlock />
          </Col>
        </Container>
      </div>
    </>
  );
};

MainContainer.displayName = "MainContainer";
