import type { CSSProperties } from "react";
import MyButton from "../MyButton/MyButton";
import type { LinkGroupConfig } from "../../config/types";

interface Props {
  group: LinkGroupConfig;
}

export const LinkGroup = ({ group }: Props) => {
  const groupStyle = {
    "--group-weight": group.links.length,
  } as CSSProperties;

  return (
    <section className="link-group" style={groupStyle}>
      <h2>{group.title}</h2>
      {group.links.map((link) => (
        <MyButton key={`${group.id}-${link.url}`} link={link.url}>
          {link.label}
        </MyButton>
      ))}
    </section>
  );
};
