# Layout configuration

The page uses a vertical layout and is designed to fit within the visible
browser viewport. The profile sits above the link groups.

Set `layout.profileHeightPercent` to control how much of the available
height belongs to the avatar and title. The links area receives the remaining
height. For example, `20` gives the links area 80% of the available height.

Set `layout.linksWidthPercent` to control the width of the centered page
content relative to the viewport. Buttons retain their original 95% width
inside each link group, so changing the content width scales the buttons
proportionally without making them span the entire screen.

Both values are normalized: `profileHeightPercent` accepts 10–60 and
`linksWidthPercent` accepts 30–95. The current defaults are 40 and 46.

The original vertical spacing, button padding, and button width are retained.
Link groups divide the available height according to their number of links,
and buttons expand to fill the remaining space within each group.
