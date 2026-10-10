# 001 — Give the final Clients CTA block an entrance reveal

- **Status**: DONE
- **Commit**: 2c71806
- **Severity**: HIGH
- **Category**: Cohesion & missed opportunities
- **Estimated scope**: 2 files (1 new client component + 1 import swap)

## Problem

`src/app/(main)/page.tsx:56-99` renders the closing "growth roadmap" panel as a plain
server-rendered block with **no scroll motion**, while every other home section reveals on
entry (`wwd-card`, `wwa-statement`, `tst-item`, Industries `clipPath`). The page's last panel
reads dead and the section rhythm breaks. The CTA also links to `href="#"` (a dead link).

Current code (`src/app/(main)/page.tsx:56-99`):

```tsx
<section data-light-bg className="mrPy pb-8">
  <div data-dark-bg className="md:h-[90dvh] w-full rounded-4xl relative overflow-hidden text-dull-text bg-primary">
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
      <div className="w-full h-full flex flex-col justify-center py-10 px-6 md:px-16 gap-6 md:gap-8">
        <h2 className="heading_2 text-white font-black font-stretch-75% uppercase mb-2 md:mb-3" style={{ wordSpacing: "5px" }}>
          Build a growth roadmap that actually takes you forward
        </h2>
        <p className="text-sm md:text-base max-w-md">…</p>
        <GButton className="w-max" variant="secondary">
          <Link className="px-3" href="#">Book a free roadmap session</Link>
        </GButton>
      </div>
      <div className="w-full flex items-center justify-center h-full py-6 px-6 md:py-8 md:px-12">
        <div className="border border-dashed p-3 rounded-4xl">
          <Image src="/home/client.png" alt="client" width={800} height={600} className="w-full max-w-[500px] h-auto rounded-3xl md:max-w-full" />
        </div>
      </div>
    </div>
  </div>
</section>
```

## Target

Extract the block into a client component `src/components/home/ClientsCta.tsx` that reveals on
scroll, matching the site's entrance language:

- Heading: masked line rise — `yPercent: 115 → 0`, `opacity: 0 → 1`, `0.8s`, `ease: "power3.out"`.
- Paragraph + button: `y: 20 → 0`, `opacity: 0 → 1`, `stagger: 0.06`, `0.6s`, `power3.out` (delay ~0.15s).
- Image: `scale: 0.96 → 1`, `opacity: 0 → 1`, `0.8s`, `power3.out`.
- Trigger on the panel, `start: "top 80%"`, `toggleActions: "play none none reverse"`.
- `prefers-reduced-motion: reduce` → set all to visible/static (no transform).
- Button link `href="#"` → `href="/contact"`.

Reference curve: repo uses GSAP `power3.out` (= AUDIT `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`).

## Repo conventions to follow

- Client reveal exemplar: `src/components/home/WhoWeAre.tsx:32-46` (`fromTo` + `scrollTrigger: { toggleActions: "play none none reverse" }`).
- Scale-not-zero entrance exemplar: `src/components/home/MacWindow.tsx:33-39` (`scale: 0.96`).
- Guard with `gsap.matchMedia()` and a `reduce` branch (see `WhoWeAre.tsx:162-172`).
- Success color/utility: `text-impact`, `bg-impact` (`src/css/tailwind.css`).

## Steps

1. Create `src/components/home/ClientsCta.tsx` with `"use client"`, `useRef`, `gsap`, `ScrollTrigger`, `useGSAP`.
2. Move the section markup from `page.tsx` verbatim into the component; keep all existing classes/styles.
3. Add class hooks: `cta-heading` (on the `<h2>`), `cta-copy` (the `<p>`), `cta-btn` (the `GButton`), `cta-media` (the image wrapper).
4. In `useGSAP({ scope: root })`, add a `matchMedia` with a no-preference branch that builds one timeline (heading rise → copy/btn stagger → media scale) with the trigger above, and a reduce branch that `gsap.set`s everything visible.
5. In `page.tsx`, import `ClientsCta` and replace the whole `<section …>…</section>` block with `<ClientsCta />`.
6. Change `href="#"` → `href="/contact"`.

## Boundaries

- Do NOT restyle or restructure the panel; motion classes + the href only.
- Do NOT change GButton or Image props.
- Do NOT add dependencies.
- If the block has drifted from the commit stamp, STOP and report.

## Verification

- **Mechanical**: `pnpm tsc --noEmit` clean; `pnpm lint` no new errors; `pnpm build` succeeds.
- **Feel check**: scroll to the last panel — heading rises from a mask, then paragraph + button ease up, image eases up from 96%; scrolling back up reverses. Toggle `prefers-reduced-motion` → everything static and visible.
- **Done when**: the panel animates in on first scroll and the CTA navigates to `/contact`.
