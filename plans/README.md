# Animation improvement plans — home page

Written by the `improve-animations` workflow (recon → audit → vet → plan) against commit
`2c71806`. Scope: the home page only (`src/app/(main)/page.tsx` and
`src/components/home/*` + shared `Button` / `TextIn`).

## Vetted findings (ordered by leverage)

| # | Severity | Category | Location | Finding | Plan |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Cohesion / missed opportunity | `app/(main)/page.tsx:56-99` | Closing Clients CTA panel has zero entrance motion while every other section reveals; CTA `href="#"` is dead | 001 |
| 2 | MEDIUM | Performance | `home/MacWindow.tsx:84-104` | Four `repeat:-1` tweens run forever, incl. fully off-screen | 002 |
| 3 | MEDIUM | Performance | `home/Testimonials.tsx:33,75,81` | Scrub animates `blur(12px)` on large text every frame | 003 |
| 4 | MEDIUM | Physicality / a11y | `ui/Button.tsx:41`, `home/WhatWeDo.tsx:132`, `home/Industries.tsx:51` | No focus ring / press feedback; 500ms pointer-ungated card hover | 004 |
| 5 | MEDIUM | Performance / a11y | `animation/TextIn.tsx:16-36` | Hidden state applied post-paint (flash); cleanup targets a non-existent id | 005 |

### Examined and deliberately left alone

- Hero intro 1.7s reveal — one-time, first-load delight (AUDIT §1 "rare/first-time"); within budget.
- Testimonials pin, WhoWeAre counters/rail, WhatWeDo horizontal pin — already `power3.out`,
  transform-only, reduced-motion handled. High craft.
- `Marquee` scroll-speed-up + `gsap.ticker` decay — intentional momentum; low cost, leave.
- Modal-style centered reveals (none present) — n/a.

## Missed opportunities (additive, low priority)

- `SectionHeading` eyebrow rule (`home/SectionHeading.tsx:27`) is a static `h-px w-8` bar; a
  `scaleX 0→1` draw-in (200ms `ease-out`) would echo the heading rise.
- TrustedBy rating pill (`home/TrustedBy.tsx:21`) has no hover response.
- Hero secondary CTA / free-roadmap CTA could share one press token — already consistent enough.

## Execution order

| Order | Plan | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | 001 | Clients CTA entrance reveal | — | DONE |
| 2 | 002 | MacWindow off-screen pause | — | DONE |
| 3 | 003 | Testimonials blur budget | — | DONE |
| 4 | 004 | Interaction feedback pass | — | DONE |
| 5 | 005 | TextIn pre-paint + cleanup | — | DONE |

Executed against a working tree on top of `2c71806`; verified `tsc` clean, `lint` 0 errors,
`build` 24/24, and `impeccable detect` clean.

### Follow-up polish applied beyond the five plans

- Legibility: Hero eyebrow `text-cream-white/55→/70`, subheading `/70→/75`, scroll cue `/40→/60`;
  `SectionHeading` dark eyebrow `/60→/70`.
- States: focus-visible rings on Hero CTAs + scroll cue; `active:scale-[0.97]` press on Hero CTAs.
- Affordance: WhatWeDo cards converted from non-interactive `<article>` (hover-lift led nowhere) to
  `<Link href="/services">` with `id="what-we-do"` anchor (the Hero "Scroll" cue now targets it).
- Motion plumbing: Lenis `anchors: { offset: -96 }` so in-page anchor jumps glide and clear the header.


## Verification (all plans)

- `pnpm tsc --noEmit` → clean
- `pnpm lint` → no new errors
- `pnpm build` → success
- Feel-check each plan's listed interaction in slow motion (DevTools Animations panel at 10%) and
  with `prefers-reduced-motion: reduce` forced (Rendering panel).
