"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import about from "@/json/about.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// colors lifted from the header nav cards
const palette = [
  { bg: "#e8e6d9", text: "#141415" },
  { bg: "#FF8C42", text: "#141415" },
  { bg: "#3a3a2e", text: "#e8e6d9" },
];

const sections = about.about.sections;

// scroll-timeline layout: lead-in hold, one segment per transition, tail hold
const SEG = 1;
const WIPE = 0.42;
const LEAD = 0.4;
const TAIL = 0.5;

export default function CurtainsScope() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const card = cardRef.current;
      const root = containerRef.current;
      if (!panel || !root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const N = sections.length;
      const DUR = LEAD + Math.max(0, N - 2) * SEG + (N > 1 ? WIPE : 0) + TAIL;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + N * window.innerHeight,
          pin: true,
          scrub: reduced ? true : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * DUR;
            let next = 0;
            for (let i = 0; i < N - 1; i++) {
              const at = LEAD + i * SEG;
              if (t >= at + WIPE / 2) next = i + 1;
            }
            setActive((prev) => (prev === next ? prev : next));
          },
        },
      });

      if (card) {
        tl.set(card, { backgroundColor: palette[0].bg, color: palette[0].text }, 0);
      }

      // one curtain sweep per slide transition, scrubbed by scroll
      for (let i = 0; i < N - 1; i++) {
        const at = LEAD + i * SEG;
        const next = palette[(i + 1) % palette.length];
        tl.set(panel, { xPercent: -100, opacity: 1, backgroundColor: next.bg }, at);
        tl.to(panel, { xPercent: 100, duration: WIPE, ease: "power2.inOut" }, at);
        if (card) {
          tl.to(
            card,
            { backgroundColor: next.bg, color: next.text, duration: WIPE, ease: "power2.inOut" },
            at,
          );
        }
      }
      tl.to({}, { duration: TAIL });
    },
    { scope: containerRef },
  );

  // animate the copy in each time the active slide changes
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const els = contentRef.current?.querySelectorAll(".cs-anim");
      if (!els?.length) return;
      gsap.fromTo(
        els,
        { yPercent: 70, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: true,
        },
      );
    },
    { dependencies: [active], scope: containerRef },
  );

  const color = palette[active % palette.length];
  const section = sections[active];

  return (
    <section
      ref={containerRef}
      id="about-company"
      className="mrBg flex min-h-svh items-center justify-center pb-6 pt-16 md:py-12"
    >
      <div
        ref={cardRef}
        className="relative mx-auto w-[90vw] max-w-[88rem] overflow-hidden rounded-3xl font-nunito"
        style={{ backgroundColor: palette[0].bg, color: palette[0].text }}
      >
        <div
          ref={contentRef}
          className="grid gap-4 p-5 sm:gap-10 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16"
        >
          <div className="flex flex-col justify-between gap-4 sm:gap-10">
            <div className="cs-anim flex items-center justify-between font-spaceMono text-[11px] uppercase tracking-[0.3em] opacity-70">
              <span>{about.about.heading}</span>
              <span>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(sections.length).padStart(2, "0")}
              </span>
            </div>

            <div>
              <h2 className="cs-anim heading font-extrabold text-balance">
                {section.title}
              </h2>
              <p className="cs-anim mt-3 max-w-[36ch] font-inter text-base font-normal leading-relaxed text-pretty opacity-80 sm:mt-6 sm:text-xl">
                {section.text}
              </p>
            </div>

            <Link
              href={section.cta.href}
              data-cursor-hover
              className="cs-anim inline-flex w-fit items-center gap-2 rounded-lg border border-current px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              {section.cta.label}
              <Icon icon="lucide:arrow-up-right" width={16} height={16} />
            </Link>
          </div>

          <div
            className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border sm:aspect-[4/3]"
            style={{
              borderColor: `${color.text}1f`,
              backgroundColor: `${color.text}0d`,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <span className="absolute left-5 top-5 font-spaceMono text-[10px] uppercase tracking-[0.25em] opacity-60">
              {section.title}
            </span>
            <span
              aria-hidden="true"
              className="text-outline pointer-events-none absolute -bottom-8 -right-3 select-none font-nunito text-[clamp(7rem,16vw,14rem)] font-extrabold leading-none tracking-[-0.03em] opacity-60"
              style={{ color: color.text }}
            >
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div
          ref={panelRef}
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          style={{ backgroundColor: palette[1].bg }}
        />
      </div>
    </section>
  );
}
