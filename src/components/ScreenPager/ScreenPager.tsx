import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./screen-pager.scss";

interface Props {
  /** Экраны располагаются вертикально в том порядке, в котором переданы. */
  screens: ReactNode[];
}

const WHEEL_STEPS_PER_SCREEN = 3;
const MAX_PROGRESS_PER_EVENT = 1;
const TRANSITION_DURATION_MS = 760;
const LINE_DELTA_IN_PIXELS = 40;

export const ScreenPager = ({ screens }: Props) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeScreenRef = useRef(0);
  const accumulatedProgressRef = useRef(0);
  const directionRef = useRef(0);
  const transitioningRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0 || screens.length < 2) return;

      const direction = Math.sign(event.deltaY);
      const nextScreen = activeScreenRef.current + direction;

      // Не перехватываем прокрутку за пределами доступных экранов.
      if (nextScreen < 0 || nextScreen >= screens.length) return;

      // Страница управляет вертикальной прокруткой сама.
      event.preventDefault();

      if (transitioningRef.current) return;

      let delta = Math.abs(event.deltaY);
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= LINE_DELTA_IN_PIXELS;
      } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= window.innerHeight;
      }

      // Один wheel event засчитывается максимум как один шаг.
      const stepProgress = Math.min(delta, MAX_PROGRESS_PER_EVENT * 100) / 100;

      if (directionRef.current !== direction) {
        directionRef.current = direction;
        accumulatedProgressRef.current = 0;
      }

      accumulatedProgressRef.current = Math.min(
        WHEEL_STEPS_PER_SCREEN,
        accumulatedProgressRef.current + stepProgress,
      );

      const progress = Math.min(
        1,
        accumulatedProgressRef.current / WHEEL_STEPS_PER_SCREEN,
      );
      setScrollProgress(progress);

      if (accumulatedProgressRef.current >= WHEEL_STEPS_PER_SCREEN) {
        activeScreenRef.current = nextScreen;
        setActiveScreen(nextScreen);
        transitioningRef.current = true;
        accumulatedProgressRef.current = 0;
        directionRef.current = 0;
        setScrollProgress(1);

        if (transitionTimerRef.current !== null) {
          window.clearTimeout(transitionTimerRef.current);
        }

        transitionTimerRef.current = window.setTimeout(() => {
          transitioningRef.current = false;
          setScrollProgress(0);
          transitionTimerRef.current = null;
        }, TRANSITION_DURATION_MS);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, [screens.length]);

  const trackStyle = {
    transform: `translate3d(0, -${activeScreen * 100}svh, 0)`,
  } as CSSProperties;

  return (
    <div className="screen-pager">
      <div className="screen-pager__track" style={trackStyle}>
        {screens.map((screen, index) => (
          <section
            className="screen-pager__screen"
            key={index}
            aria-hidden={index !== activeScreen}
          >
            {screen}
          </section>
        ))}
      </div>

      <div
        className="screen-pager__progress"
        data-visible={scrollProgress > 0}
        role="progressbar"
        aria-label="Прогресс перехода к следующему экрану"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollProgress * 100)}
      >
        <span
          className="screen-pager__progress-value"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
    </div>
  );
};

ScreenPager.displayName = "ScreenPager";
