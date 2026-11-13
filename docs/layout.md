# Layout configuration

The page keeps the original vertical order: profile above the link groups.
It is fitted to the visible viewport without changing the original desktop
spacing and button dimensions when there is enough room.

Set `layout.profileHeightPercent` to control the share of the available
page height reserved for the avatar and profile title. The links receive the
remaining height.

Set `layout.linksWidthPercent` to control the centered links container
width as a percentage of the viewport on desktop screens. Buttons keep the
original 95% width inside the container. On narrow screens, the links
container expands to 95vw for readability.

The original values are used as the base CSS variables:
- Container max width: 620px
- Top and bottom padding: 6vh / 8vh
- Link button width: 95%
- Button padding: 0.6em 1.2em
- Button bottom margin: 0.4em
- Button font size: clamp(1rem, 4.5vw, 1.5rem)
- Group heading margin: 1.8em 0 0.2em
- Group heading font size: 1.1em

When the links area becomes shorter, container-relative units scale button
font, padding, and heading spacing against the actual available height.
Each group receives space proportional to the number of links it contains;
buttons grow evenly within that group to fill the remaining space.

The defaults are `profileHeightPercent: 40` and
`linksWidthPercent: 20`. Both values are normalized to the range 10–95,
with the profile-height value capped at 60.
