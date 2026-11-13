# Screen navigation

The `ScreenPager` component hosts a vertical list of full-viewport screens.
It intercepts mouse-wheel input and accumulates complete wheel-notch distance,
rather than counting individual `wheel` events. The configured notch threshold
must be reached before switching to the adjacent screen. A progress bar at
the bottom indicates how much input remains before the transition. If wheel
input pauses for one second before the threshold is reached, accumulated
progress is reset.

The second screen is implemented by `AboutScreen`. On desktop it uses two
equal columns: an about/profile text panel on the left and an automatically
scrolling TODO list on the right. The TODO list content is currently defined
in `AboutScreen.tsx` and can be replaced with real items later. Scrolling
pauses when the list is hovered or focused. On narrow screens, the panels
stack vertically.

The TODO animation uses a duplicated list to create a seamless loop and
respects `prefers-reduced-motion`.

Wheel-up navigation returns to the previous screen. The component accepts
a `screens` array, so future screens can be added without changing the
navigation logic. The transition uses a vertical slide animation and also
respects `prefers-reduced-motion`.
