import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./screen-pager.scss";

interface Props {
  /** Экраны располагаются вертикально в том порядке, в котором переданы. */
  screens: ReactNode[];
}

const WHEEL_NOTCHES_PER_SCREEN = 5;
const WHEEL_DELTA_PER_NOTCH = 300;
const WHEEL_IDLE_RESET_MS = 1000;
const TRANSITION_DURATION_MS = 760;
const LINE_DELTA_IN_PIXELS = 40;

export const ScreenPager = ({ screens }: Props) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeScreenRef = useRef(0);
  const accumulatedWheelDeltaRef = useRef(0);
  const directionRef = useRef(0);
  const transitioningRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const wheelIdleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0 || screens.length < 2) return;

      // Страница управляет вертикальной прокруткой сама.
      event.preventDefault();

      if (transitioningRef.current) return;

      const direction = Math.sign(event.deltaY);
      const nextScreen = activeScreenRef.current + direction;

      // За границами списка экранов сбрасываем незавершённый прогресс.
      if (nextScreen < 0 || nextScreen >= screens.length) {
        accumulatedWheelDeltaRef.current = 0;
        directionRef.current = 0;
        setScrollProgress(0);

        if (wheelIdleTimerRef.current !== null) {
          window.clearTimeout(wheelIdleTimerRef.current);
          wheelIdleTimerRef.current = null;
        }

        return;
      }

      let delta = Math.abs(event.deltaY);
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= LINE_DELTA_IN_PIXELS;
      } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= window.innerHeight;
      }

      if (directionRef.current !== direction) {
        directionRef.current = direction;
        accumulatedWheelDeltaRef.current = 0;
      }

      // Считаем накопленную дистанцию прокрутки, а не количество wheel events.
      // Несколько событий от одного физического щелчка складываются в один notch.
      accumulatedWheelDeltaRef.current = Math.min(
        WHEEL_NOTCHES_PER_SCREEN * WHEEL_DELTA_PER_NOTCH,
        accumulatedWheelDeltaRef.current + delta,
      );

      const progress = Math.min(
        1,
        accumulatedWheelDeltaRef.current /
          (WHEEL_NOTCHES_PER_SCREEN * WHEEL_DELTA_PER_NOTCH),
      );
      setScrollProgress(progress);

      if (
        accumulatedWheelDeltaRef.current >=
        WHEEL_NOTCHES_PER_SCREEN * WHEEL_DELTA_PER_NOTCH
      ) {
        if (wheelIdleTimerRef.current !== null) {
          window.clearTimeout(wheelIdleTimerRef.current);
          wheelIdleTimerRef.current = null;
        }

        activeScreenRef.current = nextScreen;
        setActiveScreen(nextScreen);
        transitioningRef.current = true;
        accumulatedWheelDeltaRef.current = 0;
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
      } else {
        // Если прокрутка прервалась на секунду, начинаем накопление заново.
        if (wheelIdleTimerRef.current !== null) {
          window.clearTimeout(wheelIdleTimerRef.current);
        }

        wheelIdleTimerRef.current = window.setTimeout(() => {
          accumulatedWheelDeltaRef.current = 0;
          directionRef.current = 0;
          setScrollProgress(0);
          wheelIdleTimerRef.current = null;
        }, WHEEL_IDLE_RESET_MS);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (wheelIdleTimerRef.current !== null) {
        window.clearTimeout(wheelIdleTimerRef.current);
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
            inert={index !== activeScreen}
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
