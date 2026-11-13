# Layout configuration

The page is designed to fit within the visible browser viewport.

Set `layout.profileWidthPercent` in `links.json` to control how much of the
available width is reserved for the avatar and profile title on desktop
screens. The links panel uses the remaining width.

The value is normalized to the range `20`–`70`; the default is `40`,
which gives the profile 40% and the links panel 60%.

On narrow screens, the profile moves above the links and link groups are
arranged in a two-column grid. The desktop percentage is ignored in this
mobile layout.
