import { useEffect, useRef } from "react";
import { MatrixRain } from "./matrix";
import type { MatrixConfig } from "../../config/types";
import "./matrix.scss";

interface Props {
  config: MatrixConfig;
}

export const MatrixBackground = ({ config }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config.enabled) return;

    let rain: MatrixRain | undefined;
    try {
      rain = new MatrixRain(canvas, config);
      rain.start();
    } catch (error) {
      console.warn("Матрица недоступна:", error);
      return;
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => rain?.resize(), 150);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      rain?.destroy();
    };
  }, [config]);

  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="matrix-background"
      style={{ filter: config.blur > 0 ? `blur(${config.blur}px)` : undefined }}
      aria-hidden="true"
    />
  );
};
