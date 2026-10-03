import type { MatrixConfig } from "../../config/types";

/**
 * Красный цифровой дождь по мотивам https://github.com/Rezmason/matrix
 *
 * Идеи, взятые из оригинала:
 *  - глифы живут в фиксированной сетке и не двигаются, «дождь» — это волна
 *    освещения ячеек в колонке;
 *  - в одной колонке несколько капель, которые никогда не сталкиваются
 *    (как зубья пилообразной волны из оригинала);
 *  - на конце каждой капли — светящийся «трассер» с bloom;
 *  - символы циклически меняются;
 *  - чёрный фон, палитра приведена к одному оттенку.
 */

const GLYPHS =
  "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ" +
  "0123456789Z:・.=*+-<>[]{}|";

const FONT_STACK =
  '"Consolas", "MS Gothic", "Menlo", "DejaVu Sans Mono", monospace';

const FADE_ALPHA = 0.16;
const MIN_DROP_GAP = 6;
const MAX_DROPS_PER_COLUMN = 2;
const MAX_DPR = 2;
const MAX_DT = 0.05;

interface Drop {
  head: number;
  speed: number;
  length: number;
}

interface Column {
  drops: Drop[];
  cooldown: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.trim().replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);

  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return [255, 0, 0];

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const rgba = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const randomInt = (max: number): number => Math.floor(Math.random() * max);

export class MatrixRain {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly config: MatrixConfig;

  private cell: number;
  private columns: Column[] = [];
  private glyphs = new Uint16Array(0);

  private cols = 0;
  private rows = 0;
  private width = 0;
  private height = 0;

  private frame = 0;
  private lastTime = 0;
  private disposed = false;
  private staticFrameRendered = false;

  constructor(canvas: HTMLCanvasElement, config: MatrixConfig) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2D context unavailable");

    this.canvas = canvas;
    this.ctx = ctx;
    this.config = config;
    this.cell = config.fontSize;
  }

  start(): void {
    this.resize();
    this.lastTime = performance.now();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.renderFrame(0);
      this.staticFrameRendered = true;
      return;
    }

    this.frame = requestAnimationFrame(this.loop);
  }

  destroy(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
  }

  private readonly loop = (now: number): void => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.loop);

    if (document.hidden) {
      this.lastTime = now;
      return;
    }

    const dt = Math.min(MAX_DT, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.renderFrame(dt);
  };

  resize(): void {
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    this.canvas.width = Math.floor(cssWidth * dpr);
    this.canvas.height = Math.floor(cssHeight * dpr);
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, cssWidth, cssHeight);

    this.width = cssWidth;
    this.height = cssHeight;
    this.cell = this.config.fontSize;
    this.cols = Math.max(1, Math.ceil(cssWidth / this.cell));
    this.rows = Math.max(1, Math.ceil(cssHeight / this.cell));

    this.glyphs = new Uint16Array(this.cols * this.rows);
    this.columns = [];
    for (let col = 0; col < this.cols; col += 1) {
      this.columns.push({
        drops: [],
        cooldown: Math.random() * 2,
      });
      this.seedColumn(col);
    }

    this.ctx.font = `600 ${this.cell}px ${FONT_STACK}`;
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "center";
  }

  private seedColumn(col: number): void {
    const base = randomInt(this.rows);
    for (let offset = 0; offset < this.rows; offset += 1) {
      const row = (base + offset) % this.rows;
      this.glyphs[row * this.cols + col] = randomInt(GLYPHS.length);
    }
  }

  private glyphAt(col: number, row: number): number {
    return this.glyphs[row * this.cols + col];
  }

  private setGlyphAt(col: number, row: number, value: number): void {
    this.glyphs[row * this.cols + col] = value;
  }

  private createDrop(): Drop {
    const { fallSpeed, raindropLength } = this.config;
    return {
      head: -randomInt(Math.max(2, raindropLength)) - 1,
      speed: fallSpeed * (0.75 + Math.random() * 0.5),
      length: Math.max(
        4,
        Math.round(raindropLength * (0.6 + Math.random() * 0.8)),
      ),
    };
  }

  private canSpawn(column: Column): boolean {
    if (column.drops.length >= MAX_DROPS_PER_COLUMN) return false;
    const topmost = column.drops.reduce(
      (min, drop) => Math.min(min, drop.head),
      Number.POSITIVE_INFINITY,
    );
    return topmost > MIN_DROP_GAP;
  }

  private advance(dt: number): void {
    for (const column of this.columns) {
      column.cooldown -= dt;
      if (column.cooldown <= 0) {
        if (this.canSpawn(column)) {
          column.drops.push(this.createDrop());
          column.cooldown = Math.random() * 0.6;
        } else {
          column.cooldown = 0.15;
        }
      }

      const kept: Drop[] = [];
      for (const drop of column.drops) {
        drop.head += drop.speed * dt;
        if (drop.head - drop.length < this.rows + 4) kept.push(drop);
      }
      kept.sort((a, b) => a.head - b.head);

      // Капли в одной колонке никогда не наезжают друг на друга.
      for (let i = 0; i < kept.length - 1; i += 1) {
        const limit = kept[i + 1].head - MIN_DROP_GAP;
        if (kept[i].head > limit) kept[i].head = limit;
      }

      column.drops = kept;
    }
  }

  private drawColumn(col: number, dt: number): void {
    const column = this.columns[col];
    const { glyphColor, trailColor, headColor, cycleSpeed, opacity } =
      this.config;

    for (const drop of column.drops) {
      const headRow = Math.floor(drop.head);

      for (let i = 0; i < drop.length; i += 1) {
        const row = headRow - i;
        if (row < 0 || row >= this.rows) continue;

        if (Math.random() < cycleSpeed * dt * 60) {
          this.setGlyphAt(col, row, randomInt(GLYPHS.length));
        }

        const distance = i / drop.length;
        const bodyAlpha = opacity * (1 - distance * 0.7);

        if (i === 0) {
          // Свечение делаем красным: размытие почти-белого давало серую дымку.
          this.ctx.shadowColor = rgba(glyphColor, 0.85);
          this.ctx.shadowBlur = this.cell * 0.35;
          this.ctx.fillStyle = rgba(headColor, opacity);
        } else {
          this.ctx.shadowBlur = 0;
          this.ctx.fillStyle = rgba(
            distance > 0.55 ? trailColor : glyphColor,
            bodyAlpha,
          );
        }

        this.ctx.fillText(
          GLYPHS[this.glyphAt(col, row)],
          col * this.cell + this.cell / 2,
          row * this.cell,
        );
      }
    }

    this.ctx.shadowBlur = 0;
  }

  private renderFrame(dt: number): void {
    if (this.staticFrameRendered && dt === 0) return;

    if (dt > 0) this.advance(dt);

    // Гасим строго чёрным, иначе хвосты красного тонируют весь фон.
    this.ctx.fillStyle = `rgba(0, 0, 0, ${FADE_ALPHA})`;
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let col = 0; col < this.cols; col += 1) {
      this.drawColumn(col, dt);
    }
  }
}
