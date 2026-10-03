import type { SiteConfig } from "./types";

export const defaultConfig: SiteConfig = {
  site: {
    url: "https://rxdcodx.ru",
    lang: "ru",
    locale: "ru_RU",
    author: "RXDCODX",
    themeColor: "#ff1f1f",
    description: "Все мои ссылки в одном месте.",
    keywords: [],
    twitterSite: "",
    ogImage: "ava.png",
  },
  profile: {
    title: "RXDCODX LINKTREE",
    avatarUrl: "ava.png",
    border: {
      color: "#ff1f1f",
      speed: 1,
      chaos: 1,
      thickness: 3,
    },
  },
  twitch: {
    login: "rxdcodx",
    displayName: "RXDCODX",
    avatarUrl: "",
  },
  background: {
    matrix: {
      enabled: true,
      glyphColor: "#ff0000",
      trailColor: "#2b0000",
      headColor: "#ffd9d9",
      fontSize: 16,
      fallSpeed: 8,
      raindropLength: 16,
      cycleSpeed: 0.06,
      opacity: 0.55,
      blur: 1.2,
    },
  },
  groups: [
    {
      id: "donate",
      title: "DONATE",
      links: [{ label: "DonateX", url: "https://donatex.gg/donate/rxdcodx" }],
    },
    {
      id: "streams",
      title: "STREAMS",
      links: [{ label: "RXDCODX", url: "https://twitch.tv/rxdcodx" }],
    },
    {
      id: "socials",
      title: "SOCIALS",
      links: [
        { label: "TELEGRAM", url: "https://t.me/rxdcodx" },
        { label: "TG CHAT", url: "https://t.me/PYROKXNEZXZ_group" },
        { label: "DISCORD", url: "https://discord.gg/XWXDERj95x" },
        { label: "VK GROUP", url: "https://vk.com/rxdcodx_group" },
      ],
    },
    {
      id: "other",
      title: "OTHER",
      links: [
        { label: "SHIKIMORI", url: "https://shikimori.one/PYROKXNEZXZ" },
        { label: "GIT HUB", url: "https://github.com/rxdcodx" },
        { label: "TGC 18+", url: "https://t.me/rxdcodx18" },
      ],
    },
  ],
};
