# 002 — Pause MacWindow's infinite animations when off-screen

- **Status**: DONE
- **Commit**: 2c71806
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (motion only)

## Problem

`src/components/home/MacWindow.tsx:84-104` starts four **infinite** tweens that run for the entire
life of the page, even when the window is scrolled far off-screen:

```tsx
// src/components/home/MacWindow.tsx:84-104 — current
gsap.to(".mac-spin", { rotate: 360, repeat: -1, ease: "none", duration: 0.9 });
gsap.to(".mac-cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" });
gsap.to(".mac-live", { opacity: 0.25, repeat: -1, yoyo: true, duration: 0.9 });
gsap.to(".mac-shine", { xPercent: 240, repeat: -1, duration: 2.2, ease: "power1.inOut", stagger: 0.25 });
```

They force a repaint every frame forever (a spinner, a blinking cursor, a pulsing dot, four bar
shimmers), consuming CPU/battery for zero on-screen benefit once the user scrolls past.

## Target

Keep the exact same tweens, but drive their playback from a master timeline that is **paused
when the component is out of the viewport**. Use a ScrollTrigger on `root.current`:

```tsx
const ambient = gsap.timeline({ paused: true });
ambient
  .to(".mac-spin", { rotate: 360, repeat: -1, ease: "none", duration: 0.9 }, 0)
  .to(".mac-cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" }, 0)
  .to(".mac-live", { opacity: 0.25, repeat: -1, yoyo: true, duration: 0.9 }, 0)
  .to(".mac-shine", { xPercent: 240, repeat: -1, duration: 2.2, ease: "power1.inOut", stagger: 0.25 }, 0);

ScrollTrigger.create({
  trigger: root.current,
  start: "top bottom",
  end: "bottom top",
  onToggle: (self) => (self.isActive ? ambient.play() : ambient.pause()),
});
```

Values are unchanged (durations/easings are already correct per AUDIT §2 — constant motion is `linear`/`none`, opacity pulses are fine). This is purely a scoping fix.

## Repo conventions to follow

- ScrollTrigger is already registered and used in this file (`src/components/home/MacWindow.tsx:5,8`).
- `gsap.matchMedia()` guard already exists in this file (`:24`) — keep the ambient timeline inside the no-preference branch.
- `prefers-reduced-motion` branch (`:107-113`) must NOT start the ambient timeline.

## Steps

1. In `src/components/home/MacWindow.tsx`, replace the four standalone `gsap.to(...)` infinite tweens (lines 84-104) with one `paused` timeline holding all four, then a `ScrollTrigger.create` that plays/pauses it.
2. Keep the timeline inside the existing `mm.add("(prefers-reduced-motion: no-preference)", …)` block.
3. Do not alter the entrance timeline or the progress-bar animation.

## Boundaries

- Do NOT change durations, easings, or target classes.
- Do NOT add dependencies.
- Motion scoping only — no markup or class changes.

## Verification

- **Mechanical**: `pnpm tsc --noEmit`, `pnpm build` succeed.
- **Feel check**: scroll MacWindow into view → spinner spins, cursor blinks, bars shimmer. Scroll it fully away, open DevTools Performance, record ~2s → no lingering MacWindow repaint. Scroll back → motion resumes without a visible restart jump.
- **Done when**: the spinners/shimmers stop work when off-screen and resume smoothly when visible.
