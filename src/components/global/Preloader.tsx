"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Toggle the site preloader here.
export const ENABLE_PRELOADER = false;

const BRAND = "TECHVERZING";
const SLATS = 8;

const Preloader = () => {
  const root = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (!ENABLE_PRELOADER) return;
      const rootEl = root.current;
      if (!rootEl) return;

      document.body.style.overflow = "hidden";

      let finished = false;
      let safety = 0;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(safety);
        document.body.style.overflow = "";
        ScrollTrigger.refresh();
        setDone(true);
      };

      // Never block access: hard safety net if anything stalls.
      safety = window.setTimeout(finish, 6000);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const letters = gsap.utils.toArray<HTMLElement>(".pre-letter", rootEl);
        const slats = gsap.utils.toArray<HTMLElement>(".pre-slat", rootEl);
        const counter = { v: 0 };

        gsap.set(letters, { yPercent: 100, y: 0 });

        const tl = gsap.timeline({ onComplete: finish });
        tl.to(letters, {
          yPercent: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
        })
          .to(
            ".pre-tagline",
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            0.35
          )
          .to(
            barRef.current,
            { scaleX: 1, duration: 1.5, ease: "power1.inOut" },
            0.3
          )
          .to(
            counter,
            {
              v: 100,
              duration: 1.5,
              ease: "power1.inOut",
              onUpdate: () => {
                if (countRef.current)
                  countRef.current.textContent = Math.round(
                    counter.v
                  ).toString();
              },
            },
            0.3
          )
          .to(
            ".pre-content",
            { opacity: 0, y: -24, duration: 0.4, ease: "power2.in" },
            "+=0.1"
          )
          .to(
            slats,
            {
              yPercent: -100,
              duration: 0.7,
              ease: "power4.inOut",
              stagger: 0.07,
            },
            "-=0.15"
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.toArray<HTMLElement>(".pre-letter", rootEl), {
          yPercent: 0,
          y: 0,
        });
        gsap.set(barRef.current, { scaleX: 1 });
        gsap.set(gsap.utils.toArray<HTMLElement>(".pre-tagline", rootEl), {
          opacity: 1,
          y: 0,
        });
        if (countRef.current) countRef.current.textContent = "100";
        gsap.to(rootEl, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.5,
          onComplete: finish,
        });
      });

      return () => {
        window.clearTimeout(safety);
        document.body.style.overflow = "";
      };
    },
    { scope: root, dependencies: [] }
  );

  if (!ENABLE_PRELOADER || done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader-root fixed inset-0 z-[9999] select-none"
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLATS }).map((_, i) => (
          <span key={i} className="pre-slat div flex-1 bg-primary" />
        ))}
      </div>

      <div className="pre-content relative z-10 flex h-full w-full flex-col justify-between px-6 py-8 text-cream-white md:px-12 md:py-10">
        <div className="flex items-center justify-between font-space-mono text-[10px] uppercase tracking-[0.3em] text-dull-text md:text-xs">
          <span>Techverzing</span>
          <span>Digital · IT · Software</span>
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          <h1
            style={{ fontStretch: "85%" }}
            className="flex w-full justify-center overflow-hidden font-nunito text-[clamp(1.5rem,7vw,6rem)] font-black uppercase leading-none tracking-[-0.02em]"
          >
            {BRAND.split("").map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <span className="pre-letter inline-block translate-y-full">
                  {ch}
                </span>
              </span>
            ))}
          </h1>
          <p className="pre-tagline translate-y-2 text-sm text-dull-text opacity-0 md:text-base">
            Where Technology Meets Business Growth.
          </p>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex-1">
            <div className="h-px w-full overflow-hidden bg-white/15">
              <span
                ref={barRef}
                className="block h-full w-full origin-left scale-x-0 bg-impact"
              />
            </div>
            <p className="mt-3 font-space-mono text-[10px] uppercase tracking-[0.3em] text-dull-text">
              Loading experience
            </p>
          </div>
          <div className="flex items-baseline font-nunito leading-none text-cream-white">
            <span ref={countRef} className="text-4xl tabular-nums md:text-6xl">
              0
            </span>
            <span className="text-lg text-impact md:text-2xl">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
