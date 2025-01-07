import { Image } from "react-bootstrap";
import ava from "../../../public/ava.png";
import "./block.scss";

export const AvatarBlock = () => {
  return (
    <>
      <Image src={ava} className="avatar" rounded />
    </>
  );
};
