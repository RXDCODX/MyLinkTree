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
scrolling TODO list on the right. The panels have no card borders or permanent
backgrounds; text rows get a subtle background on hover. On narrow screens,
the panels stack vertically.

TODO entries are typed as `TodoItem` in `TodoAutoScroll.tsx`:
- `id` — stable task identifier.
- `text` — task description.
- `completed` — `true` renders `[x]` and strikes through the task; `false` renders `[ ]`.
- `completedAt` — optional completion date in `YYYY-MM-DD`; shown beneath a completed task in muted, italic, underlined text.

The example task data lives in `AboutScreen.tsx`. The list automatically
loops, pauses when hovered or focused, and uses tighter spacing between tasks.
The animation respects `prefers-reduced-motion`.

Wheel-up navigation returns to the previous screen. The component accepts
a `screens` array, so future screens can be added without changing the
navigation logic. The transition uses a vertical slide animation and also
respects `prefers-reduced-motion`.
