import { useCallback, useEffect, useId, useLayoutEffect, useRef } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import "./ElectricBorder.scss";

// useLayoutEffect ругается во время пре-рендера на сервере, где layout нет.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type ElectricBorderProperties = PropsWithChildren<{
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  className?: string;
  style?: CSSProperties;
}>;

/**
 * Портировано из MARS.Client/src/shared/components/ElectricBorderLegacy
 * Красная «молния» вокруг аватарки: SVG-фильтр с turbulent-шумом и
 * feDisplacementMap искажает обводку, а поверх идут два glow-слоя.
 */
const ElectricBorder = ({
  children,
  color = "#ff1f1f",
  speed = 1,
  chaos = 1,
  thickness = 2,
  className = "",
  style,
}: ElectricBorderProperties) => {
  const rawId = useId().replace(/:/g, "");
  const filterId = `turbulent-displace-${rawId}`;
  const svgReference = useRef<SVGSVGElement | null>(null);
  const rootReference = useRef<HTMLDivElement | null>(null);
  const strokeReference = useRef<HTMLDivElement | null>(null);

  const updateAnim = useCallback(() => {
    const svg = svgReference.current;
    const host = rootReference.current;
    if (!svg || !host) return;

    if (strokeReference.current) {
      strokeReference.current.style.filter = `url(#${filterId})`;
    }

    const width = Math.max(
      1,
      Math.round(host.clientWidth || host.getBoundingClientRect().width || 0),
    );
    const height = Math.max(
      1,
      Math.round(host.clientHeight || host.getBoundingClientRect().height || 0),
    );

    const dyAnims = [
      ...svg.querySelectorAll<SVGAnimateElement>(
        'feOffset > animate[attributeName="dy"]',
      ),
    ];
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute("values", `${height}; 0`);
      dyAnims[1].setAttribute("values", `0; -${height}`);
    }

    const dxAnims = [
      ...svg.querySelectorAll<SVGAnimateElement>(
        'feOffset > animate[attributeName="dx"]',
      ),
    ];
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute("values", `${width}; 0`);
      dxAnims[1].setAttribute("values", `0; -${width}`);
    }

    const baseDur = 6;
    const dur = Math.max(0.001, baseDur / (speed || 1));
    for (const a of [...dyAnims, ...dxAnims]) a.setAttribute("dur", `${dur}s`);

    const disp = svg.querySelector("feDisplacementMap");
    if (disp) disp.setAttribute("scale", String(30 * (chaos || 1)));

    const filterElement = svg.querySelector<SVGFilterElement>(
      "#" + CSS.escape(filterId),
    );
    if (filterElement) {
      filterElement.setAttribute("x", "-200%");
      filterElement.setAttribute("y", "-200%");
      filterElement.setAttribute("width", "500%");
      filterElement.setAttribute("height", "500%");
    }

    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach((a: SVGAnimateElement) => {
        const anim = a as unknown as { beginElement?: () => void };
        if (typeof anim.beginElement === "function") {
          try {
            anim.beginElement();
          } catch {
            /* SMIL может быть недоступен — не критично */
          }
        }
      });
    });
  }, [chaos, filterId, speed]);

  useEffect(() => {
    updateAnim();
  }, [updateAnim]);

  useIsomorphicLayoutEffect(() => {
    if (!rootReference.current) return;
    const ro = new ResizeObserver(() => updateAnim());
    ro.observe(rootReference.current);
    updateAnim();
    return () => ro.disconnect();
  }, [updateAnim]);

  const variables = {
    "--electric-border-color": color,
    "--eb-border-width": `${thickness}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootReference}
      className={`electric-border ${className}`}
      style={{ ...variables, ...style }}
    >
      <svg ref={svgReference} className="eb-svg" aria-hidden focusable="false">
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise1"
              seed="1"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dy"
                values="700; 0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise2"
              seed="1"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dy"
                values="0; -700"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise1"
              seed="2"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate
                attributeName="dx"
                values="490; 0"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="10"
              result="noise2"
              seed="2"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate
                attributeName="dx"
                values="0; -490"
                dur="6s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend
              in="part1"
              in2="part2"
              mode="color-dodge"
              result="combinedNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <div className="eb-layers">
        <div ref={strokeReference} className="eb-stroke" />
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>

      <div className="eb-content">{children}</div>
    </div>
  );
};

export default ElectricBorder;
