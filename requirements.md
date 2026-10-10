# Asset Requirements

## Who We Are Section

### Assets Used

None. The section uses no imagery.

### Placeholders

None.

### Notes

- `whoWeAre.stats` from `src/json/home.json` is rendered with a count-up animation.
- The dot-grid background is procedurally drawn (`react-bit/DotGrid`).
- The team image (`public/global/bgimage.jpeg`, data key `whoWeAre.img`) is intentionally not rendered.

## How We Work Section

Located on the About page, below the About the Company section (`src/components/home/HowWeWork.tsx`, rendered in `src/app/(main)/about/page.tsx`).

### Assets Used

None. The section uses no imagery yet.

### Placeholders

- Six step visuals, one per process stage. Each card renders a dashed "schematic" frame with a placeholder (image icon + "Image coming soon"), a faint grid, and a scan line instead of an image.
- Data keys: `howWeWork.steps[0-5].image` in `src/json/about.json` (currently `""`).
- To use a real image: drop the file in `public/about/how-we-work/` and set the key to its path (e.g. `/about/how-we-work/01-discover.webp`); the card automatically swaps the placeholder for a `next/image` (`fill`, `object-cover`). Recommended ratio: 3:2, min 1200px wide. There is a `TODO` at the top of `src/components/home/HowWeWork.tsx` restating this.

### Notes

- The ambient background is an OGL flow-field shader (`react-bit/FlowField`).
- The process deck is a GSAP ScrollTrigger pinned, scroll-scrubbed cover-flow (one active card scaled up, neighbours receding). Falls back to a stacked, scroll-revealed list on mobile and under `prefers-reduced-motion`.
- The stage rail nodes are clickable and jump to their step via Lenis (`window.__lenis`), falling back to native smooth scroll.
