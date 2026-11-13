# Layout configuration

The page uses a vertical layout and is designed to fit within the visible
browser viewport: the profile is above the link groups.

Set `layout.profileHeightPercent` in `links.json` to control how much of the
available height is reserved for the avatar and profile title. The links
panel uses the remaining height.

The value is normalized to the range `20`–`60`; the default is `40`,
which gives the profile 40% and the links panel 60%.

Link groups are arranged in a two-column grid to keep the buttons visible
without scrolling on common desktop and mobile screen sizes.
