# Brand Booster Format

Brand Booster format has different states depending on User activity (Scrolling or Video Playing). All states will be applied as `[data-*]` attributes to the `.creative` element.

## Offical Specifications

https://stroeerdigitalgroup.atlassian.net/wiki/spaces/SDGPUBLIC/pages/3524722689/SCG+Brand+Booster+Advanced+-+Desktop+MEW+Engl.

## States

- `loaded` - creative was loaded
- `active` - scroll position is on splitter or cover
- `scrolling` - user is scrolling between splitter und cover, only sitebars are visible
- splitter
- `playstate` - playstate from video `play || pause`

## CSS state triggers

```sass

.creative

    // LOADED STATE
    &.is--tweening

    // VIDEO PLAY STATE
    &[data-playstate="play"]

    // VIDEO PAUSE STATE
    &[data-playstate="play"]

    // COVER STATE
    &[data-state="active"]

    // SPLITTER STATE
    &[data-state="splitter"]

    // COVER OR SPLITTER STATE
    &[data-state*="active"]

    // SCROLLING STATE
    &[data-state="scrolling"]


```
