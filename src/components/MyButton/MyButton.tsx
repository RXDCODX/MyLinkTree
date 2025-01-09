import { Button } from "react-bootstrap";

interface Props {
  link: string;
  children: string;
}

export default function MyButton({ children, link }: Props) {
  return (
    <Button
      rel="noopener noreferrer"
      target="_blank"
      variant="primary"
      href={link}
    >
      {children}
    </Button>
  );
}
