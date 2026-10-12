"use client";

// TODO: Step images go in `public/about/how-we-work/` (e.g. 01-discover.webp, 02-strategize.webp, ...).
// Set each step's `image` path in `src/json/about.json` (`howWeWork.steps[i].image`) to render it.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import about from "@/json/about.json";
import FlowField from "@/components/react-bit/FlowField";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const { howWeWork } = about;
const STEPS = howWeWork.steps;

type LenisLike = { scrollTo: (target: number, options?: object) => void };

const HowWeWork = () => {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const railFill = useRef<HTMLSpanElement>(null);
  const stepLabel = useRef<HTMLSpanElement>(null);
  const scrollerRef = useRef<ScrollTrigger | null>(null);
  const lastActive = useRef(0);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "10% 0% 10% 0%" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trackEl = track.current;
        if (!trackEl) return;

        const applyPad = () => {
          const card = trackEl.querySelector<HTMLElement>(".hww-card");
          if (!card) return;
          const pad = Math.max(16, (window.innerWidth - card.offsetWidth) / 2);
          trackEl.style.paddingLeft = `${pad}px`;
          trackEl.style.paddingRight = `${pad}px`;
        };

        const getDistance = () =>
          Math.max(0, trackEl.scrollWidth - trackEl.clientWidth);

        applyPad();

        const scrollTween = gsap.to(trackEl, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => "+=" + (getDistance() + window.innerHeight * 0.75),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: applyPad,
            onUpdate: (self) => {
              if (railFill.current) {
                gsap.set(railFill.current, { scaleX: self.progress });
              }
              const i = Math.round(self.progress * (STEPS.length - 1));
              if (i !== lastActive.current) {
                lastActive.current = i;
                setActive(i);
              }
            },
          },
        });
        scrollerRef.current = scrollTween.scrollTrigger ?? null;

        gsap.utils
          .toArray<HTMLElement>(".hww-card", root.current!)
          .forEach((card) => {
            gsap.fromTo(
              card,
              { scale: 0.86, opacity: 0.35 },
              {
                scale: 1,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: scrollTween,
                  start: "left 72%",
                  end: "right 28%",
                  scrub: true,
                },
              }
            );
          });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils
          .toArray<HTMLElement>(".hww-card", root.current!)
          .forEach((card) => {
            gsap.set(card, { clearProps: "transform,opacity" });
          });
      });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (stepLabel.current) {
        gsap.fromTo(
          stepLabel.current,
          { yPercent: 70, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
        );
      }
    },
    { dependencies: [active], scope: root }
  );

  const goToStep = (i: number) => {
    const st = scrollerRef.current;
    if (st) {
      const y = st.start + (st.end - st.start) * (i / (STEPS.length - 1));
      const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      if (lenis?.scrollTo) lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      root.current
        ?.querySelectorAll<HTMLElement>(".hww-card")
        [i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      ref={root}
      data-dark-bg
      className="relative mrBg overflow-hidden text-cream-white"
    >
      <FlowField className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />

      <div className="relative z-10 mrMx pt-[clamp(4rem,8vw,9rem)]">
        <SectionHeading
          dark
          eyebrow={howWeWork.eyebrow}
          heading={howWeWork.heading}
        />
        <p className="mt-6 max-w-2xl font-inter text-base font-normal leading-[1.7] text-dull-text text-pretty md:text-lg">
          {howWeWork.description}
        </p>
      </div>

      <div
        ref={pin}
        className="relative mt-14 overflow-hidden motion-safe:mt-0 motion-safe:flex motion-safe:h-svh motion-safe:flex-col motion-safe:justify-center"
      >
        <div
          ref={track}
          className="relative z-[1] flex flex-col gap-6 motion-safe:flex-row motion-safe:items-center motion-safe:gap-6 motion-safe:px-[6vw] motion-safe:will-change-transform motion-safe:md:gap-8"
        >
          {STEPS.map((step) => (
            <article
              key={step.index}
              data-cursor-hover
              className="hww-card relative flex w-full shrink-0 flex-col overflow-hidden rounded-4xl border border-dashed border-cream-white/15 bg-black-slate/80 p-6 motion-safe:h-[70vh] motion-safe:w-[82vw] motion-safe:md:h-[62vh] motion-safe:md:w-[70vw] motion-safe:lg:w-[46vw] motion-safe:xl:w-[36vw] md:bg-black-slate/60 md:p-8 md:backdrop-blur-sm"
            >
              <div className="relative min-h-[180px] flex-1 overflow-hidden rounded-3xl border border-cream-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,140,66,0.12),transparent_60%)] motion-safe:md:min-h-0">
                <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(232,230,217,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(232,230,217,0.5)_1px,transparent_1px)] [background-size:34px_34px]" />

                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="flex flex-col items-center gap-2 text-dull-text">
                      <Icon
                        icon="mdi:image-outline"
                        width={40}
                        height={40}
                        className="opacity-50"
                      />
                      <span className="font-spaceMono text-[10px] uppercase tracking-[0.25em]">
                        Image coming soon
                      </span>
                    </div>
                  </div>
                )}

                <span className="absolute bottom-3 left-4 font-spaceMono text-[10px] uppercase tracking-[0.25em] text-dull-text">
                  {step.title}
                </span>

                <span
                  className={`pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-impact/10 to-transparent ${
                    inView ? "motion-safe:animate-[hwwScan_5s_linear_infinite]" : ""
                  }`}
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-3">
                  <span className="font-spaceMono text-xs text-impact">
                    {step.index}
                  </span>
                  <span className="h-px w-6 bg-impact/60" />
                  <h3 className="heading_3 font-semibold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 font-inter text-sm leading-relaxed text-dull-text md:text-base">
                  {step.text}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {step.deliverables.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-cream-white/15 px-3 py-1 font-spaceMono text-[10px] uppercase tracking-wider text-dull-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="relative z-10 mx-4 mt-10 sm:mx-8 motion-safe:absolute motion-safe:inset-x-0 motion-safe:bottom-8 motion-safe:mx-[6vw] motion-safe:mt-0">
          <div className="flex items-end justify-between">
            <span className="font-spaceMono text-[11px] uppercase tracking-[0.25em] text-dull-text">
              Stage
              <span className="ml-2 inline-block h-4 overflow-hidden align-bottom">
                <span
                  ref={stepLabel}
                  className="inline-block text-cream-white"
                >
                  {STEPS[active].title}
                </span>
              </span>
            </span>
            <span className="font-spaceMono text-[11px] text-dull-text">
              {STEPS[active].index} / {STEPS[STEPS.length - 1].index}
            </span>
          </div>

          <div className="relative mt-4 h-px w-full bg-cream-white/15">
            <span
              ref={railFill}
              className="absolute inset-y-0 left-0 h-px w-full origin-left scale-x-0 bg-impact"
            />
          </div>

          <div className="mt-4 flex justify-between">
            {STEPS.map((step, i) => (
              <button
                key={step.index}
                type="button"
                onClick={() => goToStep(i)}
                aria-label={`Go to stage ${step.index}: ${step.title}`}
                aria-current={i === active}
                data-cursor-hover
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                    i <= active
                      ? "border-impact bg-impact"
                      : "border-cream-white/30 bg-transparent group-hover:border-cream-white/60"
                  } ${i === active ? "scale-125" : ""}`}
                />
                <span
                  className={`hidden font-spaceMono text-[11px] transition-colors duration-300 md:block ${
                    i === active
                      ? "text-cream-white"
                      : "text-dull-text group-hover:text-cream-white/80"
                  }`}
                >
                  {step.index}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
