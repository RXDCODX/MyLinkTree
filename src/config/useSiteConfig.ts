import { useEffect, useState } from "react";
import { defaultConfig } from "./defaults";
import type {
  BorderConfig,
  LinkGroupConfig,
  LinkItem,
  MatrixConfig,
  ProfileConfig,
  SiteConfig,
  SiteInfo,
  TwitchConfig,
  ConfigStatus,
} from "./types";

const CONFIG_FILE = "links.json";

const CONFIG_URL = new URL(CONFIG_FILE, document.baseURI).href;

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const asString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() !== "" ? value : fallback;

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const asBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const normalizeBorder = (
  value: unknown,
  fallback: BorderConfig,
): BorderConfig => {
  const raw = asRecord(value);
  return {
    color: asString(raw.color, fallback.color),
    speed: Math.max(0.1, asNumber(raw.speed, fallback.speed)),
    chaos: Math.max(0, asNumber(raw.chaos, fallback.chaos)),
    thickness: Math.max(1, asNumber(raw.thickness, fallback.thickness)),
  };
};

const normalizeSite = (value: unknown, fallback: SiteInfo): SiteInfo => {
  const raw = asRecord(value);
  return {
    url: asString(raw.url, fallback.url).replace(/\/+$/, ""),
    lang: asString(raw.lang, fallback.lang),
    locale: asString(raw.locale, fallback.locale),
    author: asString(raw.author, fallback.author),
    themeColor: asString(raw.themeColor, fallback.themeColor),
    description: asString(raw.description, fallback.description),
    keywords: asArray(raw.keywords)
      .map((item) => (typeof item === "string" ? item : ""))
      .filter((item) => item !== ""),
    twitterSite: asString(raw.twitterSite, fallback.twitterSite),
    ogImage: asString(raw.ogImage, fallback.ogImage),
  };
};

const normalizeProfile = (
  value: unknown,
  fallback: ProfileConfig,
): ProfileConfig => {
  const raw = asRecord(value);
  return {
    title: asString(raw.title, fallback.title),
    avatarUrl: asString(raw.avatarUrl, fallback.avatarUrl),
    border: normalizeBorder(raw.border, fallback.border),
  };
};

const normalizeTwitch = (
  value: unknown,
  fallback: TwitchConfig,
): TwitchConfig => {
  const raw = asRecord(value);
  return {
    login: asString(raw.login, fallback.login),
    displayName: asString(raw.displayName, fallback.displayName),
    avatarUrl: asString(raw.avatarUrl, fallback.avatarUrl),
  };
};

const normalizeMatrix = (
  value: unknown,
  fallback: MatrixConfig,
): MatrixConfig => {
  const raw = asRecord(value);
  return {
    enabled: asBoolean(raw.enabled, fallback.enabled),
    glyphColor: asString(raw.glyphColor, fallback.glyphColor),
    trailColor: asString(raw.trailColor, fallback.trailColor),
    headColor: asString(raw.headColor, fallback.headColor),
    fontSize: Math.max(
      6,
      Math.round(asNumber(raw.fontSize, fallback.fontSize)),
    ),
    fallSpeed: Math.max(0.5, asNumber(raw.fallSpeed, fallback.fallSpeed)),
    raindropLength: Math.max(
      1,
      Math.round(asNumber(raw.raindropLength, fallback.raindropLength)),
    ),
    cycleSpeed: Math.min(
      1,
      Math.max(0, asNumber(raw.cycleSpeed, fallback.cycleSpeed)),
    ),
    opacity: Math.min(1, Math.max(0, asNumber(raw.opacity, fallback.opacity))),
    blur: Math.min(20, Math.max(0, asNumber(raw.blur, fallback.blur))),
  };
};

const normalizeLink = (value: unknown, index: number): LinkItem | null => {
  const raw = asRecord(value);
  const url = asString(raw.url, "");
  if (url === "") return null;
  return {
    url,
    label: asString(raw.label, url) || `Link ${index + 1}`,
  };
};

const normalizeGroup = (value: unknown, index: number): LinkGroupConfig => {
  const raw = asRecord(value);
  const links = asArray(raw.links)
    .map(normalizeLink)
    .filter((link): link is LinkItem => link !== null);
  return {
    id: asString(raw.id, `group-${index + 1}`),
    title: asString(raw.title, ""),
    links,
  };
};

export const normalizeConfig = (value: unknown): SiteConfig => {
  const raw = asRecord(value);
  const fallback = defaultConfig;

  return {
    site: normalizeSite(raw.site, fallback.site),
    profile: normalizeProfile(raw.profile, fallback.profile),
    twitch: normalizeTwitch(raw.twitch, fallback.twitch),
    background: {
      matrix: normalizeMatrix(
        asRecord(raw.background).matrix,
        fallback.background.matrix,
      ),
    },
    groups: asArray(raw.groups)
      .map(normalizeGroup)
      .filter((group) => group.links.length > 0),
  };
};

export const useSiteConfig = (): {
  config: SiteConfig;
  status: ConfigStatus;
} => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [status, setStatus] = useState<ConfigStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(CONFIG_URL, {
          signal: controller.signal,
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        setConfig(normalizeConfig(await response.json()));
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn(
          `Не удалось загрузить ${CONFIG_FILE}, используются значения по умолчанию.`,
          error,
        );
        setConfig(defaultConfig);
        setStatus("error");
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  return { config, status };
};
