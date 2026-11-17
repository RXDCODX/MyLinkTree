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
const TOUCH_SWIPE_THRESHOLD_RATIO = 0.22;
const TOUCH_SWIPE_MIN_PX = 120;
const TOUCH_SWIPE_MAX_PX = 200;
const TOUCH_DIRECTION_LOCK_PX = 12;

export const ScreenPager = ({ screens }: Props) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeScreenRef = useRef(0);
  const accumulatedWheelDeltaRef = useRef(0);
  const directionRef = useRef(0);
  const transitioningRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const wheelIdleTimerRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchTriggeredRef = useRef(false);

  useEffect(() => {
    const clearWheelProgress = () => {
      accumulatedWheelDeltaRef.current = 0;
      directionRef.current = 0;
      setScrollProgress(0);

      if (wheelIdleTimerRef.current !== null) {
        window.clearTimeout(wheelIdleTimerRef.current);
        wheelIdleTimerRef.current = null;
      }
    };

    const startTransition = (nextScreen: number) => {
      if (
        transitioningRef.current ||
        nextScreen < 0 ||
        nextScreen >= screens.length
      ) {
        return;
      }

      clearWheelProgress();
      activeScreenRef.current = nextScreen;
      setActiveScreen(nextScreen);
      transitioningRef.current = true;
      setScrollProgress(1);

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }

      transitionTimerRef.current = window.setTimeout(() => {
        transitioningRef.current = false;
        setScrollProgress(0);
        transitionTimerRef.current = null;
      }, TRANSITION_DURATION_MS);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0 || screens.length < 2) return;

      // Страница управляет вертикальной прокруткой сама.
      event.preventDefault();

      if (transitioningRef.current) return;

      const direction = Math.sign(event.deltaY);
      const nextScreen = activeScreenRef.current + direction;

      // За границами списка экранов сбрасываем незавершённый прогресс.
      if (nextScreen < 0 || nextScreen >= screens.length) {
        clearWheelProgress();
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
        startTransition(nextScreen);
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

    const resetTouchGesture = () => {
      touchStartXRef.current = null;
      touchStartYRef.current = null;

      if (!touchTriggeredRef.current) {
        setScrollProgress(0);
      }

      touchTriggeredRef.current = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || transitioningRef.current) {
        resetTouchGesture();
        return;
      }

      const touch = event.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      touchTriggeredRef.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (
        touchStartXRef.current === null ||
        touchStartYRef.current === null ||
        touchTriggeredRef.current ||
        event.touches.length !== 1 ||
        screens.length < 2
      ) {
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartXRef.current;
      const deltaY = touch.clientY - touchStartYRef.current;

      // Не перехватываем горизонтальные жесты и мелкие движения пальца.
      if (
        Math.abs(deltaY) < TOUCH_DIRECTION_LOCK_PX ||
        Math.abs(deltaY) <= Math.abs(deltaX)
      ) {
        return;
      }

      // Блокируем нативную вертикальную прокрутку только для вертикального свайпа.
      event.preventDefault();

      // Движение пальца вверх ведёт на следующий экран, вниз — на предыдущий.
      const direction = deltaY < 0 ? 1 : -1;
      const nextScreen = activeScreenRef.current + direction;

      if (nextScreen < 0 || nextScreen >= screens.length) {
        setScrollProgress(0);
        return;
      }

      const threshold = Math.min(
        TOUCH_SWIPE_MAX_PX,
        Math.max(
          TOUCH_SWIPE_MIN_PX,
          window.innerHeight * TOUCH_SWIPE_THRESHOLD_RATIO,
        ),
      );
      const progress = Math.min(1, Math.abs(deltaY) / threshold);
      setScrollProgress(progress);

      // Требуем протяжённый свайп, а не короткий flick.
      if (Math.abs(deltaY) >= threshold) {
        touchTriggeredRef.current = true;
        startTransition(nextScreen);
      }
    };

    const handleTouchEnd = () => {
      resetTouchGesture();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);

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
        aria-label="Прогресс переключения экрана"
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
