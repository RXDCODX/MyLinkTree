import { useState } from "react";
import ElectricBorder from "../ElectricBorder/ElectricBorder";
import fallbackAvatar from "./ava.jpeg";
import type { ProfileConfig, TwitchConfig } from "../../config/types";
import "./block.scss";

interface Props {
  profile: ProfileConfig;
  twitch: TwitchConfig;
}

export const AvatarBlock = ({ profile, twitch }: Props) => {
  const [failed, setFailed] = useState(false);
  const remote = profile.avatarUrl || twitch.avatarUrl;
  const src = !remote || failed ? fallbackAvatar : remote;

  return (
    <ElectricBorder
      className="avatar-border"
      color={profile.border.color}
      speed={profile.border.speed}
      chaos={profile.border.chaos}
      thickness={profile.border.thickness}
    >
      <img
        className="avatar"
        src={src}
        alt={twitch.displayName}
        width={320}
        height={320}
        onError={() => setFailed(true)}
      />
    </ElectricBorder>
  );
};
