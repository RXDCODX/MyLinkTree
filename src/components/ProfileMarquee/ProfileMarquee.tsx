import type { CSSProperties } from "react";
import type { ProfileConfig, TwitchConfig } from "../../config/types";
import { AvatarBlock } from "../avatar/block";
import "./profile-marquee.scss";

type Direction = "up" | "down";

interface Props {
  profile: ProfileConfig;
  twitch: TwitchConfig;
  direction: Direction;
}

const MARQUEE_COPIES = 2;
const NAMES_PER_COPY = 6;

export const ProfileMarquee = ({ profile, twitch, direction }: Props) => {
  const nickname =
    twitch.displayName.trim() || twitch.login.trim() || profile.title;
  const trackStyle = {
    "--profile-marquee-duration": "22s",
  } as CSSProperties;

  return (
    <div className="profile-marquee" data-direction={direction}>
      <div className="profile-marquee__avatar">
        <AvatarBlock profile={profile} twitch={twitch} />
      </div>

      <div className="profile-marquee__viewport">
        <div className="profile-marquee__track" style={trackStyle}>
          {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
            <div
              className="profile-marquee__sequence"
              key={copy}
              aria-hidden={copy === 1}
            >
              {Array.from({ length: NAMES_PER_COPY }, (_, index) => (
                <span className="profile-marquee__name" key={index}>
                  {nickname}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ProfileMarquee.displayName = "ProfileMarquee";
