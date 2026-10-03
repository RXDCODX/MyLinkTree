import rawConfig from "../../links.json";
import { normalizeConfig } from "./normalize";
import type { SiteConfig } from "./types";

/**
 * Конфиг, встроенный в бандл на этапе сборки.
 *
 * Он же используется для пре-рендера HTML, поэтому разметка в dist/index.html
 * и первый рендер в браузере всегда совпадают (иначе React ругается на гидрацию).
 * Файл links.json при этом по-прежнему отдаётся отдельно — так можно править
 * ссылки на задеплоенном сайте без пересборки.
 */
export const bakedConfig: SiteConfig = normalizeConfig(rawConfig);
