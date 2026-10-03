import MyButton from "../MyButton/MyButton";
import type { LinkGroupConfig } from "../../config/types";

interface Props {
  group: LinkGroupConfig;
}

export const LinkGroup = ({ group }: Props) => {
  return (
    <section className="link-group">
      <h2>{group.title}</h2>
      {group.links.map((link) => (
        <MyButton key={`${group.id}-${link.url}`} link={link.url}>
          {link.label}
        </MyButton>
      ))}
    </section>
  );
};
