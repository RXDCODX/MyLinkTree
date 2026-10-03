import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faTelegram } from "@fortawesome/free-brands-svg-icons/faTelegram";
import { faTwitch } from "@fortawesome/free-brands-svg-icons/faTwitch";
import { faVk } from "@fortawesome/free-brands-svg-icons/faVk";
import { faYoutube } from "@fortawesome/free-brands-svg-icons/faYoutube";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { faGift } from "@fortawesome/free-solid-svg-icons/faGift";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";

/**
 * Иконка подбирается по домену ссылки, поэтому в links.json ничего
 * прописывать не нужно — просто добавил ссылку, иконка определилась сама.
 */
const ICONS_BY_HOST: Record<string, IconDefinition> = {
  "t.me": faTelegram,
  "telegram.me": faTelegram,
  "discord.gg": faDiscord,
  "discord.com": faDiscord,
  "vk.com": faVk,
  "vk.ru": faVk,
  "github.com": faGithub,
  "gitlab.com": faGithub,
  "twitch.tv": faTwitch,
  "youtube.com": faYoutube,
  "youtu.be": faYoutube,
  "shikimori.one": faBook,
  "donatex.gg": faGift,
};

const normalizeHost = (host: string): string =>
  host.toLowerCase().replace(/^www\./, "");

export const resolveLinkIcon = (url: string): IconDefinition => {
  try {
    const host = normalizeHost(new URL(url).hostname);
    return ICONS_BY_HOST[host] ?? faLink;
  } catch {
    return faLink;
  }
};
