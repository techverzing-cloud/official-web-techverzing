# 004 — Interaction feedback pass (Button press/focus, WhatWeDo hover, Industries press)

- **Status**: DONE
- **Commit**: 2c71806
- **Severity**: MEDIUM
- **Category**: Physicality & accessibility
- **Estimated scope**: 3 files (classes only)

## Problem

Three interaction gaps break the site's otherwise consistent feedback language (Hero CTAs already
use `active:scale-[0.97]` + `ease-out`):

1. `src/components/ui/Button.tsx:41-47` — `GButton` only animates colors and has
   `focus:outline-none` with **no replacement focus style**. Keyboard focus is invisible, and the
   button has no press feedback.

```tsx
// src/components/ui/Button.tsx:41 — current
"font-semibold transition-colors duration-200 focus:outline-none cursor-pointer rounded-lg",
```

2. `src/components/home/WhatWeDo.tsx:132` — the capability card uses
   `transition-transform duration-500 … motion-safe:md:hover:-translate-y-2`. 500ms is a sluggish
   hover, and `motion-safe` gates reduced-motion, **not** hover capability, so the lift sticks on touch.

3. `src/components/home/Industries.tsx:51` — the "Explore all services" pill transitions color over
   300ms with no press feedback.

## Target

1. `Button.tsx` — add a visible focus ring and press feedback, and animate transform too:
   `transition-[color,background-color,border-color,transform] duration-200 ease-out`
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`
   `active:scale-[0.97]`
   (press = `scale(0.97)`, AUDIT §3; budget ~160ms but 200ms matches existing token.)

2. `WhatWeDo.tsx` card — drop hover duration to `duration-200 ease-out` and gate the lift behind a
   pointer query using an arbitrary variant:
   `transition-transform duration-200 ease-out`
   `[@media(hover:hover)_and_(pointer:fine)]:md:hover:-translate-y-2`

3. `Industries.tsx` button — add `active:scale-[0.98]` and include `transform` in the transition:
   `transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.98]`.

## Repo conventions to follow

- Hero CTAs are the reference: `src/components/home/Hero.tsx:178,189`
  (`transition duration-150 ease-out … active:scale-[0.97]`).
- Pointer-gating reference (AUDIT §6): `@media (hover: hover) and (pointer: fine)`; Tailwind arbitrary
  variant `[@media(hover:hover)_and_(pointer:fine)]:`.
- Focus color token: `ring-impact` (`#FF8C42`).
- Press scale range must stay 0.95–0.98 (AUDIT §3).

## Steps

1. `Button.tsx:41` — replace the base class string with the transform-inclusive transition; append the `focus-visible:*` and `active:scale-[0.97]` classes. Keep every variant/size class unchanged.
2. `WhatWeDo.tsx:132` — change `transition-transform duration-500` → `transition-transform duration-200 ease-out`; change `motion-safe:md:hover:-translate-y-2` → `[@media(hover:hover)_and_(pointer:fine)]:md:hover:-translate-y-2`.
3. `Industries.tsx:51` — change `transition-colors duration-300` → `transition-[color,background-color,transform] duration-200 ease-out` and add `active:scale-[0.98]`.

## Boundaries

- Classes only; do NOT change markup, props, or the Button variant logic.
- Do NOT alter Hero CTAs (already correct).
- No new dependencies.

## Verification

- **Mechanical**: `pnpm tsc --noEmit`, `pnpm lint`, `pnpm build` succeed.
- **Feel check**: Tab to a `GButton` → visible impact-colored ring. Press it → subtle 0.97 dip. Hover a capability card (desktop) → quick 200ms lift; on touch, tapping does not leave it stuck lifted. Press the Industries pill → subtle dip.
- **Done when**: every pressable control has visible focus + a subtle press response, and card hover is 200ms and pointer-gated.
