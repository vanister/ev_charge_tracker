# Bottom Tab Bar — Liquid Glass

Restyle the bottom tab bar (`src/pages/layout/BottomTabBar.tsx`) as a floating, translucent glass capsule in the style of Apple's Liquid Glass. Visual-only: same destinations, routes, icons, props, active-tab logic, and `hideTabBar` behavior.

## Approach

- Introduce a reusable **glass material** in `src/index.css` — a translucent surface that blurs the content behind it, with a specular top highlight and elevation shadow, plus a solid fallback where blur is unsupported and a dark-mode variant.
- Turn the edge-to-edge bar into a **floating pill**: a transparent full-width layer that centers a rounded capsule detached from the screen edges. Taps in the empty gutters pass through to the page.
- The active tab reads as its own tinted glass lozenge; inactive tabs are muted. Selection change animates via color transition.
- Nudge page bottom padding so scrolled content clears the floating bar.

## Pseudocode

```
# index.css
.liquid-glass:
  translucent(surface-token)
  backdrop-blur + saturate
  hairline border
  shadow(inset top highlight, outer elevation)
  @supports no-backdrop-filter -> solid surface
.dark .liquid-glass: darker translucency + tuned highlight/shadow

# BottomTabBar
<centering layer: fixed bottom, full width, taps pass through, safe-area pad, hidden toggle>
  <nav: glass pill, rounded-full, taps enabled>
    for tab in TABS:
      <Link rounded cell>
        if active: tinted lozenge + primary text
        else: muted text
        <Icon /> <label />
```

## Reuse / constraints

- Reuse existing design tokens (surface/border/primary, `text-body-secondary`) and the `Icon` component — no new colors or dependencies.
- Keep `bottom-tab-bar` as the first, kebab, root className; keep `clsx` for conditional classes.

## Out of scope

- Glass treatment for `AppHeader.tsx`.
- Single sliding/morphing active indicator (per-tab lozenge kept for simplicity).
