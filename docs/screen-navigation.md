# Screen navigation

The `ScreenPager` component hosts a vertical list of full-viewport screens.
It intercepts mouse-wheel input and accumulates complete wheel-notch distance,
rather than counting individual `wheel` events. The configured notch threshold
must be reached before switching to the adjacent screen. A progress bar at the
bottom indicates how much input remains before the transition. If wheel
input pauses for one second before the threshold is reached, accumulated
progress is reset.

The second screen is implemented by `AboutScreen`. On desktop it uses two
equal columns: an about/profile panel on the left and a TODO panel on the right.
Both columns render Markdown from separate files:

- `src/content/about.md` — content for the left column.
- `src/content/todo.md` — content for the right column.

The files are imported as raw text with Vite's `?raw` suffix and rendered by
`markdown-to-jsx`. The renderer supports CommonMark and GitHub Flavored
Markdown, including headings, nested lists, tables, links, fenced code blocks,
strikethrough, and task lists. The default URL and HTML sanitization remains
enabled.

Use regular GFM task-list syntax in `todo.md`:

```md
- [ ] An open task
- [x] A completed task

  _Закрыта: 13.11.2026_
```

A completed task is crossed out. Its following indented paragraph is displayed
beneath it in muted, small, italic, underlined text. Other Markdown elements
are styled to match the dark background and red accents. Text rows get a
subtle background on hover; the columns have no card borders or permanent
backgrounds.

The TODO column automatically loops, pauses when hovered or focused, and uses
tighter spacing between tasks. The animation respects `prefers-reduced-motion`.
On narrow screens, the panels stack vertically.

Wheel-up navigation returns to the previous screen. The component accepts a
`screens` array, so future screens can be added without changing the
navigation logic. The transition uses a vertical slide animation and also
respects `prefers-reduced-motion`.
