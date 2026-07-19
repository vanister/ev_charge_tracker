# Bottom Tab Bar — Liquid Glass — Implementation Tasks

Design doc: [bottom-nav-liquid-glass-design.md](./bottom-nav-liquid-glass-design.md)

## Phase 1: Glass material

- [x] 1. Add a `.liquid-glass` utility to `src/index.css` (in `@layer utilities`): translucent surface (`color-mix` on `--color-surface`), backdrop blur + saturate, hairline border, specular-highlight + elevation shadow, and a `@supports not (backdrop-filter)` solid-surface fallback.
- [x] 2. Add an unlayered `.dark .liquid-glass` override (after the existing top-level `.dark` block) tuning translucency, border, and highlight/shadow for dark mode.

## Phase 2: Floating capsule

- [x] 3. Restructure `src/pages/layout/BottomTabBar.tsx` into a `pointer-events-none` full-width centering layer (carrying `bottom-tab-bar` root class, `hidden` toggle, and safe-area bottom padding) wrapping a `pointer-events-auto`, `rounded-full`, `.liquid-glass` nav pill. Leave imports, `TABS`, types, and `isActive` logic unchanged.
- [x] 4. Style tab items: rounded cells, active = tinted lozenge + primary text, inactive = muted text, with `transition-colors`. Reuse existing tokens only — no new colors.

## Phase 3: Layout + verification

- [x] 5. Increase `<main>` bottom padding in `src/pages/layout/Layout.tsx` so scrolled content clears the floating bar.
- [x] 6. Verify:
  - [x] `npm run build` passes (tsc + vite)
  - [ ] `npm run dev`: capsule floats and blurs content behind it while scrolling; all four tabs navigate with the active lozenge following the selection; dark mode (Settings → Theme) reads correctly; bottom content isn't hidden; gutter taps pass through; a `hideTabBar` flow fully hides the bar — _manual browser check still pending_
  - [x] Run `evs-review` on the diff (no issues); `npm run test` passes (121/122; the one failure is pre-existing and unrelated)
- [x] 7. `architecture.md` reviewed — describes the nav only structurally (app shell + routes), which is unchanged by this visual restyle; no update needed.
