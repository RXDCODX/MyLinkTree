export interface LinkItem {
  label: string;
  url: string;
}

export interface LinkGroupConfig {
  id: string;
  title: string;
  links: LinkItem[];
}

export interface BorderConfig {
  color: string;
  speed: number;
  chaos: number;
  thickness: number;
}

export interface ProfileConfig {
  title: string;
  avatarUrl: string;
  border: BorderConfig;
}

export interface TwitchConfig {
  login: string;
  displayName: string;
  avatarUrl: string;
}

export interface MatrixConfig {
  enabled: boolean;
  glyphColor: string;
  trailColor: string;
  headColor: string;
  fontSize: number;
  fallSpeed: number;
  raindropLength: number;
  cycleSpeed: number;
  opacity: number;
  blur: number;
}

export interface TitleMarqueeConfig {
  enabled: boolean;
  speed: number;
  separator: string;
}

export interface SiteInfo {
  url: string;
  lang: string;
  locale: string;
  author: string;
  themeColor: string;
  description: string;
  keywords: string[];
  twitterSite: string;
  ogImage: string;
  titleMarquee: TitleMarqueeConfig;
}

export interface SiteConfig {
  site: SiteInfo;
  profile: ProfileConfig;
  twitch: TwitchConfig;
  background: {
    matrix: MatrixConfig;
  };
  groups: LinkGroupConfig[];
}

export type ConfigStatus = "loading" | "ready" | "error";
