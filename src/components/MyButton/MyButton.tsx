import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { resolveLinkIcon } from "./linkIcon";

interface Props {
  link: string;
  children: string;
}

export default function MyButton({ children, link }: Props) {
  const icon = resolveLinkIcon(link);

  return (
    <Button
      rel="noopener noreferrer"
      target="_blank"
      variant="primary"
      href={link}
      className="my-button"
    >
      <FontAwesomeIcon
        icon={icon}
        className="my-button-icon my-button-icon-start"
      />
      <span className="my-button-label">{children}</span>
      <FontAwesomeIcon
        icon={icon}
        className="my-button-icon my-button-icon-end"
      />
    </Button>
  );
}
