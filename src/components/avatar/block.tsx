import { Image } from "react-bootstrap";
import ava from "./ava.jpeg";
import "./block.scss";

export const AvatarBlock = () => {
  return (
    <>
      <Image src={ava} className="avatar" rounded />
    </>
  );
};
