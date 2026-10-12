# Performance Audit — Techverzing

**Scope:** Full static-code audit of the Techverzing marketing site, plus a production build for concrete bundle evidence.
**Date:** 2026-10-12
**Commit:** `755ccfa`
**Method:** Read-only source inspection of `src/`, `next.config.ts`, `tailwind.config.ts`, `package.json`; `pnpm build` (Next.js 16.2.1 / Turbopack); inspection of `.next/` chunk output and prerendered HTML.
**No application code or configuration was modified. No runtime browser profiling was performed.**

---

## How to read this document

**Evidence tags used throughout:**

- **MEASURED** — a concrete number produced by the production build or by reading build artifacts. Reproducible.
- **CONFIRMED (source)** — the code pattern (a listener, a render loop, an import, an animated property) is directly visible at the cited `file:line`. There is no doubt the pattern exists; only its runtime *magnitude* is unknown.
- **SUSPECTED** — a code-based inference about cost/magnitude that has **not** been validated with a browser profile.

No FPS, Long Task, memory, or Lighthouse numbers are claimed anywhere below. Where a number is important but unmeasured, it is listed in the **Before/After Measurement Plan** (§8) as a thing to capture.

**Measurement caveat on bundle sizes:** every "KB" figure in §6 is the **uncompressed** on-disk size of the JavaScript chunks referenced by a page's prerendered HTML. Real over-the-wire transfer is materially smaller after gzip/brotli (typically ~30–35% of these numbers). Numbers are useful for *relative* comparison between routes and chunks, not as transfer-size claims.

---

## 1. Executive Summary

The site is a Next.js 16 App Router marketing site with a very animation-heavy, GSAP/WebGL-driven visual identity. The craft level is high and several performance-positive patterns are already in place (dynamic import of the home WebGL orb, `ScrollTrigger` off-screen pausing in `MacWindow`, `IntersectionObserver` lazy-mounting in `WhyWeExist`, `useGSAP` scoping, and `prefers-reduced-motion` handling in most animation components).

The problems cluster into four themes:

1. **Per-event forced layout (the biggest real risk).** Several hot pointer/scroll handlers call `getBoundingClientRect()` on every event — or worse, every animation frame — which forces synchronous layout. The worst offender, `services/circular-gallery.tsx`, calls it **inside the rAF loop** (`onCheckHover()` runs every frame). `MagicBento`'s global spotlight reads the rect of **every card** on every `document.mousemove`. This is layout thrashing by construction. **CONFIRMED (source); magnitude SUSPECTED.**

2. **Animation loops and tweens that never pause.** Multiple canvases (`DotGrid`, `DotField`, `CircularGallery`) and infinite GSAP tweens (`SectionHero` cue, `ServiceHero` ring/badge) keep running when off-screen, when the tab is hidden, or forever after intro. `DotGrid` — used on the home page — has **no idle detection at all** and redraws its entire dot grid every frame, forever.

3. **Runtime network waterfall for icons and oversized WebGL textures.** `@iconify/react` is used with **no bundled icon data**, so icons are fetched from `api.iconify.design` at runtime — including in the always-mounted header. Service pages load multi-megabyte JPG/WebP files directly as WebGL textures with no `next/image` optimization. **CONFIRMED (source).**

4. **No code splitting below the fold.** There is exactly **one** `next/dynamic` in the whole codebase. Every other heavy client (WebGL galleries, MagicBento, dot canvases, BounceCards) ships in the route's initial JavaScript. **MEASURED:** the `/about` initial load references two WebGL/`ogl` chunks (~99 KB uncompressed) even though the WebGL component is far below the fold.

**Top measured facts**

| Measurement | Value |
|---|---|
| Production build | Compiles in 6.2 s; TypeScript 7.7 s; 24 static pages |
| `/services/[services]` | SSG for 10 paths (`generateStaticParams`, `dynamicParams=false`) |
| Total JS chunks | 24 files, ~1250 KB (uncompressed) |
| Largest single chunk | 221 KB — React DOM / Next client runtime (baseline) |
| `/about` initial JS (referenced chunks) | ~954 KB uncompressed across 14 chunks |
| `/` (home) initial JS | ~915 KB uncompressed across 14 chunks |
| `/services/[services]` initial JS | ~965 KB uncompressed across 14 chunks |
| WebGL (`ogl`) in `/about` initial load | Yes — chunks of 55 KB + 44 KB referenced in `about.html` |
| `motion` (Framer) in bundle | Not found (dependency is unused) |

**Bottom line:** the highest-leverage fixes are (a) remove layout reads from animation loops, (b) bundle icon data / stop the runtime icon fetch, (c) lazy-mount and pause off-screen animation, and (d) add `next/dynamic` + `IntersectionObserver` for below-the-fold heavy components. None of these require a rewrite — they are local, well-understood changes.

---

## 2. Architecture Overview

**Stack**

- Next.js `16.2.1` (App Router, Turbopack builds), React `19.2.4`, TypeScript `5`, Tailwind CSS `4`.
- Animation: `gsap` `3.14.2` + `@gsap/react`, `lenis` `1.3.26` (smooth scroll), `ogl` `1.0.11` (WebGL).
- Icons: `@iconify/react` `6.0.0` (**no** `@iconify-json/*` data packages).
- Other: `react-hot-toast`, `resend` (API route), `clsx`, `tailwind-merge`.
- `motion` `14.0.0` is declared but **has zero imports** in `src/` (CONFIRMED via grep; no Framer Motion API markers found in build output) → dead dependency.

**Rendering model**

- Routes are statically prerendered: `○ (Static)` for `/`, `/about`, `/contact`, `/services`, `/careers`; `● (SSG)` for `/services/[services]` (10 paths). Only `/api/send-email` is dynamic.
- `src/app/(main)/layout.tsx` mounts app-wide client chrome: `Preloader`, `Header` (`react-bit/CardNav.tsx`), `Cta`, `Footer`, `ClientProviders` (Lenis + Toaster), two `JsonLd` blocks, and analytics.
- `ClientProviders.tsx` wires Lenis to `gsap.ticker` and `ScrollTrigger.update`, and calls `ScrollTrigger.refresh()` on mount.

**Heavy client components and where they mount**

| Component | Type | Mounted by (import kind) |
|---|---|---|
| `CrystalizedOrb.tsx` (51 KB, WebGL) | ogl | `home/Hero.tsx:18` — **dynamic** ✅ |
| `DotGrid.tsx` (always-on canvas) | canvas | `home/WhoWeAre.tsx:8` — static ❌ |
| `DotField.tsx` (idle-stopping canvas) | canvas | `global/SectionHero.tsx:12` — static ❌ |
| `FlowField.tsx` (WebGL) | ogl | `home/HowWeWork.tsx:13` (used on `/about`) — static ❌ |
| `circular-gallery.tsx` (WebGL gallery) | ogl | `services/ServiceIntro.tsx:11` — static ❌ |
| `AboutCircularGallery.tsx` | ogl | **unused (dead)** |
| `Spotlight-card.tsx` | canvas/rAF | `services/ServiceIntro.tsx:10`, `ServiceAdvantage.tsx:10` — static ❌ |
| `MagicBento.tsx` / `Magic-bento.tsx` | canvas-free DOM+GSAP | about: `ServicesOverview.tsx:5`; services: `ServiceHighlights.tsx:8`, `ServiceAdvantage.tsx:9` — static ❌ |
| `BounceCard.tsx` | rAF | `about/WhyWeExist.tsx` — static but IO-gated ✅ |
| `Thought-line.tsx` | rAF/GSAP | `services/ServiceHighlights.tsx:9` — static ❌ |
| `CurtainsScope.tsx` | GSAP scroll | `about/page.tsx` — static ❌ |

**Page import map (all static unless noted)**

- Home (`app/(main)/page.tsx`): `Hero` (dynamic orb), `WhatWeDo`, `WhoWeAre`, `TrustedBy`, `Testimonials`, `Industries`.
- About: `CurtainsScope`, `AboutHero`, `WhyWeExist`, `HowWeWork`, `ServicesOverview`.
- Services list: `SectionHero`.
- Service detail: `SectionHero`, `ServiceIntro`, `ServiceHighlights`, `ServiceAdvantage` (heaviest route).
- Contact: `SectionHero`, `ContactSection`, `MapSection`.

**Animation orchestration model**

- Most GSAP components use `useGSAP({ scope })` with `gsap.matchMedia()` for reduced motion and automatic cleanup — good.
- Lenis drives scroll smoothing; `ScrollTrigger` handles pinned/scrubbed sections (`WhatWeDo`, `HowWeWork`, `CurtainsScope`, `Testimonials`, `Industries`).
- Several components bypass GSAP with their own `requestAnimationFrame` canvas loops (`DotGrid`, `DotField`, `FlowField`, `Spotlight-card`, `BounceCard`) and their own global listeners.

---

## 3. Prioritized Findings

### 3.1 Priority table

| Priority | File | Problem | Fix | Impact | Confidence | Effort |
|---|---|---|---|---|---|---|
| **P0** | `src/components/services/circular-gallery.tsx` (`onCheckHover` L338-392, `update` L436-451) | `getBoundingClientRect()` called **every rAF frame** inside `onCheckHover`; `pointermove` reads rect again (L350-365); loop never pauses (hidden/offscreen/reduced-motion) | Cache container rect (update on resize + pointermove); skip hover work when pointer outside; pause rAF via `IntersectionObserver` + `visibilitychange`; guard reduced-motion | Layout: eliminates per-frame forced reflow on the hottest route | High (source) / magnitude Suspected | M |
| **P0** | `src/components/about/MagicBento.tsx` & `src/components/services/Magic-bento.tsx` (`GlobalSpotlight` L342-402) | `document.mousemove` → `querySelectorAll('.card')` + `getBoundingClientRect()` **per card**, per event (O(N) forced reflow); writes 4 CSS vars/card; appends 800×800 `mix-blend-mode:screen` div to `<body>` | rAF-throttle the handler; cache card rects (recompute on resize); gate spotlight on section visibility; scope listener; avoid page-wide blend layer | Layout + composite: high-frequency reflow on 3 instances | High (source) / magnitude Suspected | M |
| **P0** | Iconify usage site-wide (`package.json`, `CardNav.tsx:297`, `Cta.tsx:128,143`, `SectionHero.tsx:179`, +~25 more) | `@iconify/react` with **no `@iconify-json/*`** and no `addCollection` → icons fetched at runtime from `api.iconify.design`; header icons mount even when menu closed | Add `@iconify-json/lucide` + `@iconify-json/mdi`, `addCollection` in one client module; or inline SVGs for the handful of icons in global chrome | Network: removes a runtime request waterfall + icon pop-in on every page | High (source) | S |
| **P1** | Page files (`about/page.tsx`, `services/[services]/page.tsx`, `home/page.tsx`) | Only **one** `next/dynamic` in the codebase; WebGL galleries, MagicBento, dot canvases ship in initial JS. **MEASURED:** `/about` initial load references WebGL (`ogl`) chunks (55 KB + 44 KB uncompressed) although FlowField is below the fold | Wrap heavy below-the-fold clients in `next/dynamic` + an `IntersectionObserver` mount gate (pattern already exists in `WhyWeExist.tsx:57-71`) | Network + scripting: smaller initial JS, deferred WebGL parse | High (source) / Measured (chunks) | M |
| **P1** | `src/components/react-bit/DotGrid.tsx` (L141-236, esp. 235) | **No idle detection** — clears + redraws the entire dot canvas every frame, forever, while visible; new `createLinearGradient` every frame (L165-168); permanent 20 ms `setInterval` (L137); SVG glow attrs every frame (L157-161) | Port `DotField` idle-counter logic (+ restart-on-mousemove); cache gradient in resize; fold mouse-speed decay into rAF; remove interval | Scripting + paint: continuous full-canvas repaint on the home page | High (source) / magnitude Suspected | M |
| **P1** | `src/components/home/WhoWeAre.tsx:147-158`, `src/components/home/Testimonials.tsx:33,75,81` | `filter: blur()` animated on text (WhoWeAre entrance) and on **full-viewport cards inside a pinned scrub** (Testimonials) → per-frame large-layer repaint | Animate `opacity`/`transform` only; if a soft reveal is required use a static blurred overlay cross-faded by opacity, or `clip-path` | Paint: most likely long-frame source on those sections | High (source / property) / magnitude Suspected | S |
| **P1** | `src/components/react-bit/CardNav.tsx` (L60-79, 103-113, 138-163, 213) | Animates the **`height` layout property** for menu open/close; `calculateHeight` does write-then-read forced reflow; unthrottled `resize` kills & rebuilds the whole timeline; permanent `will-change-[height]` | Reveal via `transform`/`clip-path`; compute height once; rAF-throttle or width-guard the resize handler; drop `will-change: height` | Layout + paint: nav is on every page | High (source) | M |
| **P1** | `src/components/global/Footer.tsx` (L91-140) | 5 listeners attached to **every** `.footer-nav-link` (dozens of links); a **new `gsap.to` per event**; duplicate `mouseleave` (L130+L133) fires conflicting tweens; one registration never removed in cleanup (leak) | Event delegation on `footerRef`, or CSS transitions for hover; remove duplicate registration | Scripting + memory: on every page | High (source) | S |
| **P1** | `src/components/global/Cta.tsx` (L76, 105, 110) | `getBoundingClientRect()` on **every `pointermove`** before the rAF guard; two large `blur-[120px]`/`blur-3xl` decorative layers; permanent `will-change-transform` | Cache rect; move read inside rAF; bake glow to a radial-gradient; drop static `will-change` | Layout + paint: global component | High (source) / magnitude Suspected | S |
| **P1** | `src/app/(main)/layout.tsx` (head) + `@next/third-parties` | **Dual analytics**: raw `gtag.js` script (`G-9W5BW55VY6`) *and* `<GoogleTagManager gtmId="GTM-MG2ZRTFC" />` both load on every page | Keep one; if GA4 is routed through GTM, remove the raw gtag script | Network: removes duplicate third-party request + main-thread work | High (source) | XS |
| **P2** | `src/components/services/Spotlight-card.tsx` (L186-194, 156-178, 128-130, 273-286) | `getBoundingClientRect()` **every rAF frame**; rewrites multi-stop `color-mix` radial-gradient + opacity strings every frame; effect with **no deps** re-wakes loop on every render; **N instances → N global `pointermove` listeners + N observers + N rAF loops** | Cache rect; transform/opacity-only highlight; add deps; shared/delegated listener for N cards | Layout + paint + scripting, multiplied by card count | High (source) | M |
| **P2** | `src/components/react-bit/FlowField.tsx` (L107-111, 136, 75-79) | `getBoundingClientRect()` on every **global, non-passive** `mousemove`; `antialias:true` on a fullscreen quad; static `ogl` import pulls the lib into `/about` | Cache rect; `{ passive: true }`; `antialias:false`; `next/dynamic` for FlowField | Layout + GPU (measured: `ogl` chunk on `/about`) | High (source) / Measured (chunk) | S |
| **P2** | `src/components/global/SectionHero.tsx` (L60-61, 71-77, 127-132, 151) | Infinite `yoyo` tween on `.sh-cue-icon` never paused off-screen; `will-change-transform` on every heading word; static `DotField` canvas + its permanent 20 ms `setInterval` | Pause the cue tween via `ScrollTrigger.onToggle`; drop `will-change` after intro; lazy-mount the dot field | Scripting + composite: used on 3 routes | High (source) | S |
| **P2** | `src/components/ui/TextIn.tsx:45` / `home/SectionHeading.tsx` | `will-change-transform` kept **permanently** on every animated line; one `ScrollTrigger` per line across Home/About/Services | `clearProps: 'will-change'` after tween, or drop it | Composite: standing layer per heading line | High (source) | S |
| **P2** | `src/components/home/Industries.tsx` (L194, 50-56, 141-149) | Static `will-change-transform` on ~5 **full-viewport** background panels; `SplitText` over **all** headings at mount; full re-render of the panel tree on active-index change | Add/remove `will-change` around transitions; split headings lazily per reveal; isolate counter/rail via refs/memo | Composite + layout init + reconciliation | High (source) / magnitude Suspected | M |
| **P2** | `src/components/services/ServiceAdvantage.tsx:45-61` | One tween + one `ScrollTrigger` **per `.adv-reveal` element** via `forEach` (component already uses `ScrollTrigger.batch` at L63-77) | Use a single `ScrollTrigger.batch` | Scripting: fewer trigger instances | High (source) | S |
| **P2** | `src/components/services/Thought-line.tsx` (L137-177, 211-232, 270) | Infinite `gsap` opacity tweens while working; forced reflow `void t.offsetWidth` on **every `ResizeObserver` callback**; shimmer animates `background-position` (paint); per-instance inline `<style>` | Use CSS keyframes; only reposition on real size delta; accept/scope shimmer | Scripting + layout + paint | High (source) | M |
| **P2** | `src/components/services/ServiceHero.tsx` (L60-61, 95, 104) + `Marquee` | Two infinite tweens (ring rotation, badge float) never visibility-gated; permanent `will-change-transform`; child `Marquee` adds a permanent `gsap.ticker` callback + scroll listener | Pause via `ScrollTrigger`/`IntersectionObserver`; clear `will-change` for `Marquee` | Scripting + composite | High (source) | S |
| **P2** | `src/components/home/Testimonials.tsx:63-64` | `onUpdate` calls `setActive` and tweens every dot each scrub update | Only tween dots when the active index actually changes | Scripting during scroll | Suspected | S |
| **P2** | `public/services/**` (e.g. `digital-branding/3.webp` 2.67 MB, `social-media-optimization/2.jpg` 2.25 MB) | Loaded as **WebGL textures** by `circular-gallery` (no `next/image`); `createMedias` instantiates every image **twice** (`concat`) | Ship properly sized textures; remove the duplicate concat; consider `next/image` for any non-WebGL usage | Network + GPU texture memory | High (source) / Measured (file sizes) | M |
| **P2** | `src/components/others.tsx` + `globals.css` | **5 font families / ~20 weights** (Outfit, Inter, Space Mono, Lexend via `next/font/google`, + local Nunito Sans) | Reduce to the weights actually used per family | Network (font requests) + paint | High (source) | S |
| **P2** | `src/components/about/WhyWeExist.tsx:50-55` | Unthrottled `resize` → `setVw(window.innerWidth)` → full re-render + recompute BounceCards props | rAF-throttle/debounce, or use `matchMedia` change events | Layout + reconciliation during resize | High (source) | S |
| **P2** | `src/components/about/CurtainsScope.tsx:57-65,105-118` | `setState` inside `ScrollTrigger.onUpdate` during scrub (guarded by equality) | Update label/counter via refs instead of React state | Scripting: minor re-renders during scroll | Suspected (guarded) | M |
| **P3** | `src/components/about/CircularGallery.tsx`, `services/Chroma-grid.tsx`, `animation/ObserverDemo.tsx`, `react-bit/FlowingMenu.tsx`, `react-bit/SrollReveal.tsx` | **Dead code** — confirmed 0 imports. `ObserverDemo` even injects `body{overflow:hidden}` if mounted; `SrollReveal` animates per-word `filter: blur` | Delete the files | Bundle hygiene / prevents accidental use | High (source) | XS |
| **P3** | `react-bit/DotGrid.tsx` vs `react-bit/DotField.tsx`; `about/MagicBento.tsx` vs `services/Magic-bento.tsx` | Near-duplicate components (and `DotGrid`'s default export is also named `DotField`) | Consolidate to one implementation each | Maintainability + prevents shipping the wrong variant | High (source) | M |
| **P3** | `package.json` (`motion`) | Unused dependency | Remove from `package.json` | Repo hygiene (not currently bundled) | High (source) / Measured (no markers) | XS |
| **P3** | `src/components/react-bit/DotField.tsx:129-133,171-179,277` | **Functional bug:** idle loop stops after ~30 quiet frames; `onMouseMove` never restarts rAF → glow interaction permanently dead until re-entry | Restart `tick()` in `onMouseMove` when `rafRef.current === null` | Correctness (feature currently dead) | High (source) | XS |
| **P3** | `src/components/about/BounceCard.tsx:47,144,248,332-334,368` | `scale(0)` entrance; `getBoundingClientRect` per pointermove in `pick`; effect with **no deps** wakes rAF each render; raw `<img>` | `scale(0.9)+opacity`; cache rect; add deps; `next/image` | Composite + layout + network | High (source) | S |
| **P3** | All WebGL/canvas components | DPR sampled once at mount; never updated on monitor/zoom change; no `visibilitychange` stop | Optional: observe DPR changes; cancel rAF on `document.hidden` | Composite correctness; low impact | High (source) | S |

> Note: `home/MacWindow.tsx` already pauses its infinite tweens off-screen (`ScrollTrigger.create` toggle, L85-125) and is **not** listed — it is a model for the other components.

### 3.2 Detailed findings

#### P0-1 — `getBoundingClientRect()` inside the animation frame loop
**File:** `src/components/services/circular-gallery.tsx` — `onCheckHover()` (L338-392) called from `update()` (L442-446).
**Evidence (CONFIRMED source):**

```ts
// update() runs every rAF frame:
this.medias.forEach(media => media.update(this.scroll, direction));
this.onCheckHover();                       // L442-446
...
onCheckHover() {
  const rect = this.container.getBoundingClientRect();   // L346 — forced layout, every frame
  ...
}
```

`onCheckHover` also loops all medias doing `Math.hypot` hit-testing each frame. `pointermove` reads `getBoundingClientRect()` again (L350-365). The loop self-schedules forever (`L552`) with no visibility/reduced-motion pause, and registers **9 window listeners** (L565-573). `createMedias` does `galleryItems.concat(galleryItems)` (L404) → every texture is created twice.
**Fix:** cache the container rect; only run hover geometry when the pointer is inside and the pointer actually moved; pause the loop off-screen and on `document.hidden`; respect `prefers-reduced-motion`; drop the duplicated concat.
**Expected impact:** removes per-frame forced reflow and halves texture count on the service detail route.
**Confidence:** High that the read happens every frame; magnitude SUSPECTED. **Effort:** M. **Risk:** Low (localized).

#### P0-2 — MagicBento global spotlight reflows every card per mouse move
**File:** `src/components/about/MagicBento.tsx` and `src/components/services/Magic-bento.tsx` — `GlobalSpotlight` (L342-402).
**Evidence (CONFIRMED source):**

```ts
const handleMouseMove = (e) => {
  const cards = gridRef.current.querySelectorAll('.card');
  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect();   // per card, per mousemove
    ...
    updateCardGlowProperties(card, e.clientX, e.clientY, ...); // 4 CSS var writes
  });
  gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1 });
};
document.addEventListener('mousemove', handleMouseMove);
```

Runs whenever the section is mounted (not visibility-gated) and appends an 800×800 `mix-blend-mode: screen` element to `<body>` each instance. Two instances exist on the service detail page, one on `/about`.
**Fix:** rAF-throttle the handler; cache card rects (invalidate on resize); gate on section intersection; scope the listener to the section; avoid the page-wide blend layer.
**Expected impact:** removes O(cards) forced reflow per mouse move, three times over.
**Confidence:** High (source); magnitude SUSPECTED. **Effort:** M. **Risk:** Medium (must preserve the visual effect).

#### P0-3 — Icons fetched over the network at runtime
**Evidence (CONFIRMED source):** `package.json` has `@iconify/react` but no `@iconify-json/*` package; a repo-wide grep finds no `addCollection`/`loadIcons`; `next.config.ts` has no `optimizePackageImports`. Iconify therefore downloads icon data from `api.iconify.design` per prefix at runtime. Icons appear in globally-mounted chrome (`CardNav` header, `Cta`) and in animated elements (`SectionHero` cue icon).
**Fix:** add the two data packages and call `addCollection` once in a client module, or replace the handful of global-chrome icons with inline SVG.
**Expected impact:** removes a runtime request waterfall + late icon paint (CLS) on every page.
**Confidence:** High (source). **Effort:** S. **Risk:** Low.

#### P1-1 — No below-the-fold code splitting (measured)
**Evidence (MEASURED):** `.next/server/app/about.html` references 14 chunks totalling ~954 KB uncompressed, including two WebGL/`ogl` chunks (`0t8.o5p5o5f0k.js` 55 KB with `WEBGL_lose_context`, `0ou.mopbeij~9.js` 44 KB with `fragmentShader`), despite `FlowField` rendering far below the fold. The service detail page totals ~965 KB. Only `CrystalizedOrb` is dynamically imported (CONFIRMED source: single `next/dynamic` in the repo).
**Fix:** `next/dynamic` + an IntersectionObserver mount gate (copy the `WhyWeExist.tsx:57-71` pattern) for `ServicesOverview`/`MagicBento`, `ServiceIntro`/`circular-gallery`, `FlowField`/`HowWeWork`, and the `SectionHero` dot canvas.
**Expected impact:** smaller initial JS and deferred WebGL library parse on affected routes.
**Confidence:** High (source) + Measured (chunk presence). **Effort:** M. **Risk:** Low.

#### P1-2 — `DotGrid` never idles
**File:** `src/components/react-bit/DotGrid.tsx` (used by home `WhoWeAre.tsx:8`).
**Evidence (CONFIRMED source):** the tick loop always reschedules while visible (`rafRef.current = reduce || !visible ? null : requestAnimationFrame(tick)`, L256/L235) with **no quiet-frame counter** (unlike `DotField`), plus a 20 ms `setInterval` (L137), a per-frame `createLinearGradient` (L165-168) and per-frame SVG glow attribute writes (L157-161).
**Fix:** port `DotField`'s idle logic (and its restart-on-mousemove fix), cache the gradient, remove the interval.
**Confidence:** High (source); magnitude SUSPECTED. **Effort:** M. **Risk:** Low.

*(Remaining P1–P3 findings are summarized in the table with file:line evidence inline; each is confirmed at the cited location.)*

---

## 4. Animation / GPU Audit

**What animates and how.** The site relies on transform/opacity GSAP work in most section components — this is compositor-friendly and correct. The audit's animation problems are concentrated in a few specific patterns, not in the general approach.

**4.1 Painful properties being animated**

| Property | Where | Stage | Note |
|---|---|---|---|
| `filter: blur()` | `WhoWeAre.tsx:147-158` (text entrance), `Testimonials.tsx:33,75,81` (full-viewport cards under pinned scrub) | **paint** | Blur is one of the most expensive properties to animate; scrubbed blur repaints every frame. Highest paint risk. |
| `height` | `CardNav.tsx:103,109-113,144` | **layout + paint** | Animating a block-axis layout property; jank risk on every page's nav. |
| `background-position` | `Thought-line.tsx:270`, `ServiceIntro.tsx` `svc-border-flow`, `Chroma-grid` (dead) | **paint** | Shimmer/border flows; bounded in `Thought-line` but still paint-per-frame. |
| parent CSS var → child mask/filter | `Chroma-grid.tsx` (dead) | **paint/style-recalc** | The known "style recalc storm" anti-pattern; only relevant if the dead file is ever revived. |

**4.2 Render loops that never pause (scripting/composite)**

- `DotGrid` — no idle stop, full clear+redraw every frame (P1-2).
- `DotField` — has idle logic but the interaction restart is broken (P3 bug in table).
- `FlowField` — continuous while visible; pauses off-screen via IO (good) but no `visibilitychange`.
- `circular-gallery.tsx` — unbounded self-scheduling rAF, no pause (P0-1).
- `CrystalizedOrb.tsx` — `moving` is always true, so the `settling` gate is dead; renders forever while visible (has IO off-screen pause — good). Lines 1274, 1448.
- `Spotlight-card.tsx` — ambient loop never settles while visible (P2).
- Infinite tweens that are **never** visibility-gated: `SectionHero` cue (L71-77), `ServiceHero` ring/badge (L60-61). Compare `MacWindow` (pauses, good).

**4.3 `will-change` that is never released (composite memory)**

Permanent `will-change` hints create standing compositor layers:

- `TextIn.tsx:45` — every animated line, across Home/About/Services.
- `Industries.tsx:194` — ~5 full-viewport image panels.
- `SectionHero.tsx:151` — every heading word.
- `Hero.tsx` — every `.hero-word`.
- `ServiceHero.tsx:95,104` — badge + words.
- `CardNav.tsx:213` — `will-change: height` (cannot be composited → pure downside).
- `Cta.tsx:110` — glow.

**Fix direction:** add hints only around the animation (GSAP manages `will-change` during tweens; use `clearProps` on complete), never statically. This is a **composite/memory** concern — not a scripting fix.

**4.4 Correct patterns to keep**

- `useGSAP` + `gsap.matchMedia()` reduced-motion in `Hero`, `WhatWeDo`, `HowWeWork`, `ServiceHero`, `ServiceIntro`, `ServiceAdvantage`, `ServiceHighlights`, `Thought-line`, `Marquee`, `CurtainsScope`.
- `ScrollTrigger.batch` for staggered reveals (`ServiceIntro.tsx:52-67`, `ServiceAdvantage.tsx:63-77`).
- Single staggered tweens instead of per-word tweens in `ServiceHero` (`stagger: 0.08`, L46).
- `MacWindow` off-screen pause (L85-125) — the reference implementation.
- `gtag`/`ScrollTrigger` coordination via a single Lenis ticker in `ClientProviders.tsx`.

**4.5 Honest notes**

- GSAP does **not** move computation to the GPU. Every GSAP `onUpdate`/scrub still runs on the main thread. The GPU only benefits when the *animated property* is `transform`/`opacity`.
- `will-change` and memoization are only recommended above where a standing layer or repeated work is demonstrated in code. No blanket "add `/will-change`" advice.
- Whether a scrubbed blur or a per-frame canvas redraw actually drops frames **cannot be judged from code alone** — it depends on device, layer count, and viewport. Those are flagged SUSPECTED and listed for profiling in §8.

---

## 5. React / JavaScript Audit

**5.1 Effects and render hygiene**

- `Spotlight-card.tsx:128-130` — `useEffect(() => { wakeRef.current?.(); });` **no dependency array** → wakes the rAF loop after every render.
- `BounceCard.tsx:332-334` — same no-deps effect.
- `CrystalizedOrb.tsx:942-967` — prop-sync effect with no deps calls `start()` on every render.
- `Spotlight-card.tsx:109-121` — `settings` object + two `falloff()` calls rebuilt every render (no `useMemo`), yet consumed by the rAF loop.
- `ServiceHighlights.tsx:97-124` / `CurtainsScope` — `items.map(...)` + `renderCard` recreated each render and passed to non-memoized `MagicBento`.
- `Industries.tsx:141-149` — `setActive`/`setSeen` in scroll `onUpdate` re-renders the whole panel tree; only the rail fill is ref-driven (good).
- `WhyWeExist.tsx:50-55` — unthrottled `resize` → state → full re-render.

**5.2 Event listeners**

- `Footer.tsx:91-140` — 5 listeners × every footer link, new tween per event, duplicate `mouseleave`, leak in cleanup (P1).
- `MagicBento` — `document.mousemove` + per-card `mousemove` (P0-2).
- `Spotlight-card.tsx:273-286` — N global `pointermove` listeners (one per card).
- `circular-gallery.tsx:565-573` — 9 window listeners; duplicate `mousewheel`+`wheel`; missing `{ passive: true }`.
- `FlowField.tsx:136` — global non-passive `mousemove`.
- `Cta.tsx:76` — rect read on every `pointermove`.
- `CardNav.tsx:138-163` — unthrottled `resize` rebuilds the timeline.

**5.3 Repeated work / allocations**

- Per-frame array allocations in `CrystalizedOrb.tsx` (L1360,1385,1396-1406, incl. `palette.tones.flat()`) and `FlowField.tsx:121`.
- Per-frame gradient rebuild in `DotGrid.tsx:165-168`.
- Per-move `gsap.to` allocation instead of `quickTo` (`Chroma-grid` dead; `MagicBento` tilt/magnetism).

**5.4 Hydration / client boundary**

- Heavy components are all client components statically pulled into server page shells (see §2/§6). `SectionHeading` and `ServicesOverview` carry `"use client"` for a single child — acceptable but it enlarges the client boundary.
- No `React.memo` on components that receive props recreated every render (`MagicBento`, `SpotlightCard` consumers).

**5.5 Framer Motion**

`motion@14` is imported **nowhere** (CONFIRMED grep) and no Framer Motion API markers appear in the build output (MEASURED). It is dead weight only in `package.json`, not in the bundle.

**5.6 Correct patterns**

`useGSAP({ scope })` cleanup; `IntersectionObserver` lazy-mount in `WhyWeExist`; `setInterval`-vs-`textContent` (avoids re-render) in `Thought-line`; `{ once: true }` entrance triggers; `dynamicParams=false` + `generateStaticParams`.

---

## 6. Network / Bundle / Assets Audit

**6.1 Measured build output**

`pnpm build` succeeded:

```
✓ Compiled successfully in 6.2s
  Finished TypeScript in 7.7s
✓ Generating static pages (24/24)
```

Route classification: `/`, `/about`, `/contact`, `/services`, `/careers`, policies, `robots.txt`, `sitemap.xml`, OG/twitter images = **Static**; `/services/[services]` = **SSG** (10 paths); `/api/send-email` = **Dynamic**.

**6.2 Measured chunk sizes** (uncompressed on-disk; see caveat in §"How to read")

| Chunk | Size | Composition (marker-detected) |
|---|---|---|
| `15h14.h5zuto4.js` | 221 KB | React DOM / Next client runtime (baseline) |
| `0v926ztcce..q.js` | 146 KB | Next framework/router (no app markers) |
| `0w9g4xpwf0vm_.js` | 129 KB | GSAP + Iconify + ScrollTrigger |
| `03~yq9q893hmn.js` | 110 KB | polyfill (listed in `polyfillFiles`) |
| `0t8.o5p5o5f0k.js` | 55 KB | GSAP + WebGL (`WEBGL_lose_context`) |
| `0.nat1g1ks-f0.js` | 56 KB | GSAP + ScrollTrigger (component code) |
| `0ou.mopbeij~9.js` | 44 KB | WebGL shaders (`fragmentShader`, `unpackAlignment`) |
| …11 more | 10–53 KB | app/route code |
| **Total** | **~1250 KB / 24 chunks** | |

**6.3 Measured per-route initial JS** (sum of chunks referenced by prerendered HTML)

| Route | Chunks | Initial JS (uncompressed) |
|---|---|---|
| `/` | 14 | ~915 KB |
| `/about` | 14 | ~954 KB |
| `/services` | 13 | ~866 KB |
| `/services/[services]` | 14 | ~965 KB |
| `/contact` | 13 | ~878 KB |

**6.4 Assets**

- Service imagery is large and served **as WebGL textures** (bypassing `next/image`): `digital-branding/3.webp` 2.67 MB, `social-media-optimization/2.jpg` 2.25 MB, `…/1.jpg` 1.9 MB, `home/client.png` 1.07 MB, `mobile-application/3.webp` 976 KB, … (MEASURED file sizes). `createMedias` duplicates every image.
- Global `logo.png` ~100 KB; `bgimage.jpeg`/`globalbg.jpeg` ~50 KB each.
- `MapSection` uses a Google Maps `<iframe loading="lazy">` (third-party, below the fold) — good lazy attribute; consider a click-to-load facade.
- Icons: runtime fetch from `api.iconify.design` (P0-3).
- Fonts: 5 families / ~20 weights (P2).

**6.5 Third-party scripts**

- Google Analytics `gtag.js` **and** Google Tag Manager both load on every page (P1) — duplicate.

---

## 7. Ordered Optimization Roadmap

Ordered by leverage (impact ÷ effort) and dependency. Phases are independent; within a phase, order does not matter.

**Phase 1 — quick, low-risk wins (hours)**
1. Remove duplicate analytics (P1, layout.tsx).
2. Bundle icon data (`@iconify-json/*` + `addCollection`) or inline chrome SVGs (P0-3).
3. Delete dead code files (P3) and the unused `motion` dependency (P3).
4. Remove the duplicate `mouseleave` registration + fix the leak in `Footer.tsx` (P1).
5. `next.config.ts`: nothing to change; but confirm no `optimizePackageImports` is needed once icons are bundled.

**Phase 2 — remove layout reads from hot paths (1–2 days)**
6. `circular-gallery.tsx`: cache rect, pause loop off-screen/hidden, dedupe textures (P0-1).
7. `MagicBento`/`Magic-bento`: rAF-throttle + cache rects + visibility-gate (P0-2).
8. `Cta.tsx`: cache rect, read inside rAF (P1).
9. `FlowField.tsx`: cache rect, `{ passive: true }`, `antialias:false` (P2).
10. `Spotlight-card.tsx`: cache rect, transform/opacity-only highlight, deps, shared listener (P2).

**Phase 3 — pause what is off-screen; idle what is static (1–2 days)**
11. `DotGrid.tsx`: idle logic + cached gradient (P1).
12. `DotField.tsx`: fix the restart-on-mousemove bug (P3).
13. `SectionHero.tsx` / `ServiceHero.tsx`: gate infinite tweens with `ScrollTrigger.onToggle`.
14. `MacWindow` pattern (already correct) → copy to the above.

**Phase 4 — code splitting + boundary reduction (2–3 days)**
15. `next/dynamic` + IO gate for heavy below-the-fold clients (P1-1). Verify `ogl`/GSAP leave the initial bundle.
16. Reduce `will-change` to animation-time only (`clearProps`).

**Phase 5 — assets & typography (2–3 days)**
17. Re-export service textures at appropriate sizes; remove duplicate image concat (P2).
18. Trim font families/weights (P2).

**Phase 6 — polish / correctness (as time allows)**
19. Paint-property animations (`blur`, `background-position`) → transform/opacity or scoping.
20. `CardNav` height animation → transform/clip; throttled resize.
21. `Industries` SplitText laziness; `WhyWeExist` resize throttle; `CurtainsScope` ref-based updates.
22. DPR-change and `visibilitychange` handling across canvases.

---

## 8. Before/After Measurement Plan

No runtime profiling was performed for this audit. To convert the SUSPECTED magnitudes into facts, capture the following. Run **before** any change and **after** each phase, same device, same network throttle.

**8.1 Field data (real users)**
- CrUX / Vercel Analytics / `web-vitals`: LCP, CLS, INP, TTFB on `/`, `/about`, `/services/[services]`, `/contact`.

**8.2 Lab — Chrome DevTools (mid-tier Android profile or 4× CPU throttle)**
- Performance panel on each route: record 5 s idle, then a scripted scroll through pinned sections, then a mouse-move pass over hero/spotlight/bento areas. Note **Long Tasks**, scripting vs rendering vs painting time, and frame drops.
- Rendering panel: enable **Paint flashing** and **Layer borders** to see blur repaints and standing `will-change` layers.
- Performance Monitor: DOM node count, JS heap, listener count before/after navigating to each route and back.

**8.3 Network**
- DevTools Network, throttled "Fast 3G": count requests to `api.iconify.design`, total bytes for service-page textures, duplicate analytics requests, font requests.
- Coverage panel: unused JS on first load per route (expect reduction after Phase 4).

**8.4 Bundle**
- `ANALYZE=true pnpm build` with `@next/bundle-analyzer` (dev-only; not added here) to produce a treemap; compare `ogl`/GSAP/iconify chunk presence on `/about` and `/services/[services]` before/after Phase 4.
- Re-run `pnpm build` and re-sum the referenced chunks in `.next/server/app/**/*.html` (the method used in §6) for a reproducible initial-JS delta.

**8.5 Specific instruments for specific findings**

| Finding | Instrument |
|---|---|
| Hot-loop `getBoundingClientRect` (P0-1/P0-2) | Performance panel → "Layout" / "Recalculate Style" attribution; record during continuous mouse movement |
| Blur animation (P1) | Paint flashing + Performance "Recalculate Style/Paint" on `WhoWeAre`/`Testimonials` scroll |
| Never-idle canvases (P1-2) | Performance Monitor (GPU/CPU) with the section visible but untouched for 10 s |
| Icon network (P0-3) | Network panel request list, filter `iconify` |
| Code splitting (P1-1) | Coverage panel unused JS + bundle analyzer |

Where a behavior is subjective (does the blur scrub "feel" janky?), verify on a real low-end Android device — emulation under-reports GPU/paint cost.

---

## 9. Quick Wins and What Should Remain Unchanged

**Quick wins (Phase 1 — each under ~1 hour, low risk)**

1. Remove one of the two analytics loaders (`layout.tsx`).
2. Bundle Iconify data / inline the ~5 global-chrome icons.
3. Delete the 5 dead files and remove the `motion` dependency.
4. Fix the `Footer` duplicate `mouseleave` + cleanup leak.
5. Fix the `DotField` restart-on-mousemove bug (restores a currently-dead feature).
6. Add `{ passive: true }` to the `FlowField` `mousemove` listener and set `antialias:false`.

**What should remain unchanged (already correct — do not "optimize" these)**

- `CrystalizedOrb` dynamic import (`Hero.tsx:18`) — correct code splitting; keep.
- `MacWindow.tsx` off-screen tween pause via `ScrollTrigger.create` (L85-125) — the model to copy, not to change.
- `useGSAP({ scope })` + `gsap.matchMedia()` reduced-motion pattern used by most animation components.
- `ScrollTrigger.batch` staggered reveals in `ServiceIntro` and `ServiceAdvantage`.
- `WhyWeExist` IntersectionObserver lazy-mount of `BounceCards`.
- BounceCard's rAF-stops-when-settled and root-scoped listeners.
- Transform/opacity-only GSAP parallax in `Hero`, `WhatWeDo`, `HowWeWork`, `Industries`.
- `next/image` usage in `HowWeWork`, `CardNav`, `Industries`, `Footer`, `ServiceIntro`, `ContactSection`.
- `dynamicParams=false` + `generateStaticParams` static generation.
- Single Lenis ticker wired to `ScrollTrigger` in `ClientProviders.tsx`.
- CSS `clamp()` / theme tokens; `@keyframes` used for simple, low-frequency effects.

**What NOT to do**

- Do not add `will-change` or `force3D` "just in case" — the audit found *too many* permanent hints, not too few.
- Do not recommend GPU acceleration as a generic fix: GSAP and `element.style` writes run on the main thread; only transform/opacity properties benefit from compositing.
- Do not add memoization everywhere — only where a recreated object feeds a render loop or a non-memoized child (the concrete cases listed).
- Do not introduce Web Workers unless a genuinely expensive, independent computation is later identified; nothing in this audit qualifies.

---

## Appendix — Files inspected

`next.config.ts`, `tailwind.config.ts`, `package.json`, `AGENTS.md`; `src/app/(main)/layout.tsx`, `page.tsx`, `about/page.tsx`, `services/page.tsx`, `services/[services]/page.tsx`, `contact/page.tsx`; `src/components/{global,home,about,services,react-bit,animation,ui,form}/*`; `src/css/*`; `.next/server/app/**/*.html`, `.next/static/chunks/*`, `.next/**/build-manifest.json`.

## Appendix — Confidence legend

- **MEASURED** — from `pnpm build` output or build artifacts.
- **CONFIRMED (source)** — the pattern exists exactly at the cited `file:line`.
- **SUSPECTED** — code-based inference about cost/magnitude, not validated by a profile.

All *structural* facts (which listeners, loops, imports, animated properties exist) are CONFIRMED. All *magnitude* claims (jank, dropped frames, memory pressure) are SUSPECTED pending §8 profiling.
