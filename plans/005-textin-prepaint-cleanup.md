# 005 — Fix TextIn pre-paint flash and dead cleanup

- **Status**: DONE
- **Commit**: 2c71806
- **Severity**: MEDIUM
- **Category**: Performance & accessibility
- **Estimated scope**: 1 file

## Problem

`src/components/animation/TextIn.tsx` drives every section heading. Two defects:

1. **One-frame visible→hidden flash.** The hidden state is applied inside `useEffect` (`:16-20`),
   which runs *after* paint. The server-rendered text paints visible, then snaps to
   `yPercent:100 / opacity:0`, then animates back — a pop on any heading that is in/near the
   viewport at first paint.

```tsx
// src/components/animation/TextIn.tsx:16-36 — current
useEffect(() => {
  if (!elRef.current) return;
  const el = elRef.current;
  gsap.set(el, { yPercent: 100, opacity: 0 });
  gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 98%", toggleActions: "play none none reverse" } });
  return () => { ScrollTrigger.getById(el.id)?.kill(); };
}, []);
```

2. **Dead cleanup.** The animation is created with no `id` (and `el.id` is `""`), so
   `ScrollTrigger.getById(el.id)` always returns `undefined` — the ScrollTrigger/`gsap.to` are never
   killed on unmount. Latent leak.

## Target

- Apply the hidden state **before paint** (no flash) and kill **both** the tween and its trigger on
  cleanup. Keep the exact reveal (`yPercent: 100→0`, `opacity: 0→1`, `0.8s`, `power3.out`,
  `start: "top 98%"`, `toggleActions: "play none none reverse"`).

```tsx
// target
useLayoutEffect(() => {
  const el = elRef.current;
  if (!el) return;
  const anim = gsap.fromTo(
    el,
    { yPercent: 100, opacity: 0 },
    {
      yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 98%", toggleActions: "play none none reverse" },
    }
  );
  return () => {
    anim.scrollTrigger?.kill();
    anim.kill();
  };
}, []);
```

Note: `fromTo` + `useLayoutEffect` guarantees the hidden start applies before the browser paints.

## Repo conventions to follow

- `useGSAP` is the house pattern elsewhere (`Hero`, `WhoWeAre`, …), but this component has no scope
  ref and is a plain wrapper — the minimal faithful fix is `useLayoutEffect` + `fromTo` + captured
  cleanup. Either is acceptable; do not change the public API (`TextIn`, `TextInString`).
- `gsap.registerPlugin(ScrollTrigger)` already imported (`:6`).

## Steps

1. In `src/components/animation/TextIn.tsx`, import `useLayoutEffect` (keep `useEffect` for `TextInString`).
2. Replace the `TextIn` `useEffect` body (lines 16-36) with the `useLayoutEffect` + `fromTo` + captured-cleanup version above.
3. Leave `TextInString` untouched.

## Boundaries

- Do NOT change the `TextIn`/`TextInString` signatures or markup.
- Do NOT change the reveal values.
- No new dependencies.

## Verification

- **Mechanical**: `pnpm tsc --noEmit`, `pnpm build` succeed.
- **Feel check**: reload the home page — the WhatWeDo heading must not flash visible-then-gone before its mask rise. Navigate away and back — no growth in ScrollTrigger count (DevTools `ScrollTrigger.getAll().length` stays stable).
- **Done when**: headings never flash and unmounting the wrapper kills its trigger.
