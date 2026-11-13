# Screen navigation

The `ScreenPager` component hosts a vertical list of full-viewport screens.
It intercepts mouse-wheel input and accumulates complete wheel-notch distance,
rather than counting individual `wheel` events. Three notches are required
before switching to the adjacent screen. A progress bar at the bottom
indicates how much input remains before the transition.

The threshold is configurable in `ScreenPager.tsx`:
- `WHEEL_NOTCHES_PER_SCREEN` — number of wheel notches required per screen.
- `WHEEL_DELTA_PER_NOTCH` — normalized wheel delta treated as one notch.

Wheel-up navigation returns to the previous screen. The component accepts
a `screens` array, so future screens can be added without changing the
navigation logic.

The transition uses a vertical slide animation and respects
`prefers-reduced-motion`. The progress bar is hidden when no transition
input is being accumulated.
