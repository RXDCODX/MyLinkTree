# Screen navigation

The `ScreenPager` component hosts a vertical list of full-viewport screens.
It intercepts mouse-wheel input and accumulates complete wheel-notch distance,
rather than counting individual `wheel` events. The configured notch threshold
must be reached before switching to the adjacent screen. A progress bar at the
bottom indicates how much input remains before the transition. If wheel
input pauses for one second before the threshold is reached, accumulated
progress is reset.

The second screen is implemented by `AboutScreen`. On desktop it uses three
columns: a downward-moving vertical nickname marquee on the left, centered
Markdown content in the middle, and an upward-moving vertical nickname marquee
on the right.

The center column renders Markdown from `src/content/about.md` using
`markdown-to-jsx`. It supports CommonMark and GitHub Flavored Markdown,
including headings, nested lists, tables, links, fenced code blocks,
strikethrough, and task lists. Default URL and HTML sanitization remains
enabled.

Both profile marquees use the existing site configuration:
- `twitch.displayName` (falling back to `twitch.login`) supplies the nickname.
- `profile.avatarUrl` supplies the avatar, with the existing local fallback.
- Each repeated marquee item contains both the circular avatar and vertical
  nickname, so they move together as one unit.

The left marquee moves down and the right marquee moves up. On narrow screens
(640px and below), both side marquees are hidden and the centered Markdown
content occupies the full width. The side columns are kept close to the center
content. Text rows keep a subtle hover background; the content has no card
border or permanent background. All marquee animation respects
`prefers-reduced-motion`.

Wheel-up navigation returns to the previous screen. The component accepts a
`screens` array, so future screens can be added without changing the
navigation logic. The transition uses a vertical slide animation and also
respects `prefers-reduced-motion`.
