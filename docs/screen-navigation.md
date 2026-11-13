# Screen navigation

The `ScreenPager` component hosts a vertical list of full-viewport screens.
It intercepts mouse-wheel input and accumulates three wheel steps before
switching to the adjacent screen. A progress bar at the bottom indicates
how much input remains before the transition.

Wheel-up navigation returns to the previous screen. The component accepts
a `screens` array, so future screens can be added without changing the
navigation logic.

The transition uses a vertical slide animation and respects
`prefers-reduced-motion`. The progress bar is hidden when no transition
input is being accumulated.
