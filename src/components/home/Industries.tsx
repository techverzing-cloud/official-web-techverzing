"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import homeData from "@/json/home.json";
import { ArrowRightIcon } from "@/components/ui/Icons";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const { industries } = homeData;
const ITEMS = industries.items;
const COUNT = ITEMS.length;

type LenisLike = { scrollTo: (target: number, options?: object) => void };

const pad = (n: number) => String(n).padStart(2, "0");

const Industries = () => {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const railFill = useRef<HTMLSpanElement>(null);
  const scrollerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<number[]>([0, 1]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const pinEl = pin.current;
          if (!pinEl) return;

          const panels = gsap.utils.toArray<HTMLElement>(".ind-panel", pinEl);
          const outer = gsap.utils.toArray<HTMLElement>(".ind-outer", pinEl);
          const inner = gsap.utils.toArray<HTMLElement>(".ind-inner", pinEl);
          const backgrounds = gsap.utils.toArray<HTMLElement>(".ind-bg", pinEl);
          const headings = gsap.utils.toArray<HTMLElement>(
            ".ind-heading",
            pinEl
          );

          const splits = headings.map(
            (heading) =>
              new SplitText(heading, {
                type: "chars,words,lines",
                linesClass: "clip-text",
              })
          );

          let currentIndex = -1;
          let animating = false;
          let pendingIndex: number | null = null;
          let lastActive = 0;

          gsap.set(panels, { autoAlpha: 0, zIndex: 0 });
          gsap.set(outer, { yPercent: 100 });
          gsap.set(inner, { yPercent: -100 });

          const showPanel = (index: number) => {
            if (animating) {
              pendingIndex = index;
              return;
            }
            if (index === currentIndex) return;

            const direction = index > currentIndex ? 1 : -1;
            const factor = direction === -1 ? -1 : 1;
            const prev = currentIndex;
            animating = true;

            const tl = gsap.timeline({
              defaults: { duration: 1.1, ease: "power2.inOut" },
              onComplete: () => {
                animating = false;
                if (pendingIndex !== null && pendingIndex !== currentIndex) {
                  const next = pendingIndex;
                  pendingIndex = null;
                  showPanel(next);
                }
              },
            });

            if (prev >= 0) {
              gsap.set(panels[prev], { zIndex: 0 });
              tl.to(backgrounds[prev], { yPercent: -12 * factor }, 0).set(
                panels[prev],
                { autoAlpha: 0 }
              );
            }

            gsap.set(panels[index], { autoAlpha: 1, zIndex: 1 });

            tl.fromTo(
              [outer[index], inner[index]],
              { yPercent: (i) => (i === 0 ? 100 * factor : -100 * factor) },
              { yPercent: 0 },
              0
            )
              .fromTo(
                backgrounds[index],
                { yPercent: 12 * factor },
                { yPercent: 0 },
                0
              )
              .fromTo(
                splits[index].chars,
                { autoAlpha: 0, yPercent: 150 * factor },
                {
                  autoAlpha: 1,
                  yPercent: 0,
                  duration: 0.9,
                  ease: "power2.out",
                  stagger: { each: 0.02, from: "random" },
                },
                0.15
              );

            currentIndex = index;
          };

          const st = ScrollTrigger.create({
            trigger: pinEl,
            start: "top top",
            end: () => "+=" + (panels.length - 1) * window.innerHeight,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (railFill.current) {
                gsap.set(railFill.current, { scaleX: self.progress });
              }
              const i = Math.round(self.progress * (panels.length - 1));
              if (i !== lastActive) {
                lastActive = i;
                setActive(i);
                setSeen((prevSeen) => {
                  const next = [i - 1, i, i + 1].filter(
                    (n) => n >= 0 && n < panels.length && !prevSeen.includes(n)
                  );
                  return next.length ? [...prevSeen, ...next] : prevSeen;
                });
                showPanel(i);
              }
            },
          });
          scrollerRef.current = st;

          showPanel(0);

          return () => {
            splits.forEach((split) => split.revert());
          };
        }
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const pinEl = pin.current;
        if (!pinEl) return;
        ScrollTrigger.create({
          trigger: pinEl,
          start: "top 90%",
          once: true,
          onEnter: () => setSeen(Array.from({ length: COUNT }, (_, n) => n)),
        });
      });
    },
    { scope: root }
  );

  const goToPanel = (i: number) => {
    const st = scrollerRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / (COUNT - 1));
    const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
    if (lenis?.scrollTo) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      ref={root}
      data-dark-bg
      className="relative mrBg overflow-hidden text-cream-white"
    >
      <div ref={pin} className="relative motion-safe:h-screen">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-[75vh] bg-[linear-gradient(180deg,rgba(9,9,11,0.8)_0%,rgba(9,9,11,0.45)_55%,transparent_100%)]" />

        {ITEMS.map((item, i) => (
          <div
            key={item.text}
            role="group"
            aria-label={item.text}
            className="ind-panel relative h-screen w-full motion-safe:absolute motion-safe:inset-0"
          >
            <div className="ind-outer relative h-full w-full overflow-hidden">
              <div className="ind-inner relative h-full w-full overflow-hidden">
                <div className="ind-bg absolute inset-0 motion-safe:will-change-transform">
                  {seen.includes(i) ? (
                    <Image
                      src={item.image}
                      alt={item.text}
                      fill
                      priority={i === 0}
                      quality={72}
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#151516_0%,#2a2a2d_60%,#3a2416_100%)]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.72)_0%,rgba(9,9,11,0.35)_45%,rgba(9,9,11,0.85)_100%)]" />
                </div>

                <div className="relative z-10 mrMx flex h-full flex-col justify-end px-5 pb-[clamp(8.5rem,18vw,11rem)] sm:px-0">
                  <h3 className="ind-heading max-w-[20ch] text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:max-w-none sm:text-6xl lg:text-7xl xl:text-8xl">
                    {item.text}
                  </h3>
                  <Link
                    href={item.link}
                    data-cursor-hover
                    className="group mt-7 inline-flex w-max items-center gap-3 rounded-full border border-cream-white/25 bg-cream-white/5 px-6 py-3.5 text-sm font-semibold text-cream-white backdrop-blur-sm transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-impact hover:bg-impact hover:text-primary active:scale-[0.98]"
                  >
                    Explore service
                    <span className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRightIcon />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
          <div className="mrMx flex items-center justify-between gap-6 px-5 pt-[clamp(6.5rem,10vw,7rem)] sm:px-0">
            <span className="inline-flex items-center gap-3 whitespace-nowrap font-spaceMono text-[11px] uppercase tracking-[0.3em] text-cream-white/70">
              <span className="h-px w-8 bg-impact" />
              {industries.eyebrow}
            </span>
            <Link
              href="/services"
              data-cursor-hover
              className="group pointer-events-auto hidden w-max text-nowrap items-center gap-3 rounded-full bg-impact px-5 py-3 text-xs font-semibold text-primary transition-[color,background-color,transform] duration-200 ease-out hover:bg-cream-white active:scale-[0.98] sm:inline-flex sm:px-7 sm:py-4 sm:text-sm"
            >
              Explore all services
              <span className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>

          <div
            className={`mrMx mt-[clamp(2.5rem,6vw,6rem)] max-w-4xl px-5 transition-all duration-700 ease-out sm:px-0 ${
              active > 0 ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <h2 className="font-semibold text-white text-[clamp(1.6rem,4.4vw,4rem)] leading-[clamp(1.9rem,4.8vw,4.8rem)]">
              {industries.heading}
            </h2>
            <p className="mt-5 font-spaceMono text-[11px] uppercase tracking-[0.3em] text-cream-white/60">
              Scroll to explore
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 motion-safe:block">
          <div className="mrMx px-5 pb-6 sm:px-0 sm:pb-8">
            <div className="flex items-end justify-between gap-6">
              <span className="max-w-[55%] truncate font-spaceMono text-[11px] uppercase tracking-[0.25em] text-dull-text sm:max-w-full">
                <span className="mr-2 text-cream-white">
                  {ITEMS[active].text}
                </span>
              </span>
              <span className="font-spaceMono text-[11px] text-dull-text">
                {pad(active + 1)} / {pad(COUNT)}
              </span>
            </div>
            <div className="relative mt-4 h-px w-full bg-cream-white/15">
              <span
                ref={railFill}
                className="absolute inset-y-0 left-0 h-px w-full origin-left scale-x-0 bg-impact"
              />
            </div>
            <div className="mt-4 flex gap-3">
              {ITEMS.map((it, i) => (
                <button
                  key={it.text}
                  type="button"
                  onClick={() => goToPanel(i)}
                  aria-label={`Show ${it.text}`}
                  aria-current={i === active}
                  data-cursor-hover
                  className="pointer-events-auto rounded-full p-1"
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                      i <= active
                        ? "border-impact bg-impact"
                        : "border-cream-white/30"
                    } ${i === active ? "scale-125" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Industries;