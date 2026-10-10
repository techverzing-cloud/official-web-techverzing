# 003 — Cut the Testimonials scrub blur inside the cheap budget

- **Status**: DONE
- **Commit**: 2c71806
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (motion only)

## Problem

`src/components/home/Testimonials.tsx:33,75,81` animates `filter: blur(12px)` on a `<blockquote>`
whose quote text is `clamp(1.4rem, 2.6vw, 2.25rem)` and up to `max-w-4xl`. The blur runs on a
**scrubbed** timeline (`scrub: 1`, `:61`), so it repaints a large text block every scroll frame —
an expensive filter mid-scroll, worst on Safari. AUDIT §5 caps transition-time blur at < 20px and
flags heavy blur as costly.

```tsx
// src/components/home/Testimonials.tsx:33 — current
gsap.set(cards.slice(1), { opacity: 0, yPercent: 60, filter: "blur(12px)" });
// :75
opacity: 0, yPercent: -60, filter: "blur(12px)", duration: 1
// :81
{ opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1 }
```

## Target

Reduce the blur to **6px** and keep the cross-fade legible. The movement (`yPercent ±60`) and
opacity already mask the swap; 6px is enough to bridge without the paint cost.

```tsx
gsap.set(cards.slice(1), { opacity: 0, yPercent: 60, filter: "blur(6px)" });
// exit
opacity: 0, yPercent: -60, filter: "blur(6px)", duration: 1
// enter
{ opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1 }
```

Keep the reduced-motion branch unchanged (no blur there).

## Repo conventions to follow

- Same file already uses the pattern; this is a value change only.
- AUDIT §5: keep transition-time `filter: blur()` under 20px.
- Blur-masked crossfades are endorsed (AUDIT §7) — 6px keeps the technique, drops the cost.

## Steps

1. In `src/components/home/Testimonials.tsx`, change the three `blur(12px)` occurrences (lines 33, 75) to `blur(6px)`. Leave line 81's `blur(0px)` as-is.
2. Do not change durations, `yPercent`, opacity, or the dots/counter logic.

## Boundaries

- Do NOT restructure the pin/timeline.
- Do NOT touch the `tst-dot`/`setActive` code.
- No new dependencies.

## Verification

- **Mechanical**: `pnpm tsc --noEmit`, `pnpm build` succeed.
- **Feel check**: pin the Testimonials section and scroll slowly — quotes cross-fade without a heavy smear and without visible frame drops (DevTools Performance, look for long paint tasks). Reduced-motion shows a static list.
- **Done when**: the scrub swap stays smooth and the blur is ≤ 6px.
