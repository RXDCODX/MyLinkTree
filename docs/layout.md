# Layout configuration

The page keeps the original vertical order: profile above the link groups.
The profile and link list have independent widths.

Set `layout.profileHeightPercent` to control the share of the available
page height reserved for the avatar and profile title. The links receive the
remaining height.

Set `layout.linksWidthPercent` to control the centered links container
width as a percentage of the viewport on desktop screens. It does not
constrain the profile panel. Buttons keep the original 95% width inside
the links container. On narrow screens, the links container expands to 95vw
for readability.

The original link dimensions and spacing are retained as base CSS variables:
- Container max width: 620px
- Top and bottom padding: 6vh / 8vh
- Link button width: 95%
- Button padding: 0.6em 1.2em
- Button bottom margin: 0.4em
- Button font size: clamp(1rem, 4.5vw, 1.5rem)
- Group heading margin: 1.8em 0 0.2em
- Group heading font size: 1.1em

When the links area becomes shorter, container-relative units scale button
font, padding, and heading spacing against the actual links area.

Each group receives space proportional to its number of links plus one
reserved unit for its heading. Buttons therefore keep consistent room across
groups, including groups with a single link such as Twitch. Buttons grow
evenly within each group to fill the available links area.

The defaults are `profileHeightPercent: 40` and
`linksWidthPercent: 20`.
