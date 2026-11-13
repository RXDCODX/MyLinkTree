# Screen navigation

The `ScreenPager` component hosts a vertical list of full-viewport screens.
It intercepts mouse-wheel input and accumulates complete wheel-notch distance,
rather than counting individual `wheel` events. Three notches are required
before switching to the adjacent screen. A progress bar at the bottom
indicates how much input remains before the transition. If wheel input pauses
for one second before the threshold is reached, accumulated progress is reset.

The threshold is configurable in `ScreenPager.tsx`:
- `WHEEL_NOTCHES_PER_SCREEN` — number of wheel notches required per screen.
- `WHEEL_DELTA_PER_NOTCH` — normalized wheel delta treated as one notch.
- `WHEEL_IDLE_RESET_MS` — idle time before incomplete progress is reset (default: 1000 ms).

Wheel-up navigation returns to the previous screen. The component accepts
a `screens` array, so future screens can be added without changing the
navigation logic.

The transition uses a vertical slide animation and respects
`prefers-reduced-motion`. The progress bar is hidden when no transition
input is being accumulated.
