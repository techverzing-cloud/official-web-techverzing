"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ENABLE_PRELOADER } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

// Solid dark overlay matching the hero section; the hero's orb animates
// center→right once we lift.
const Preloader = () => {
  const root = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!ENABLE_PRELOADER) return;
    setShouldShow(true);
  }, []);

  useGSAP(
    () => {
      if (!ENABLE_PRELOADER || !shouldShow) return;
      const rootEl = root.current;
      if (!rootEl) return;

      document.body.style.overflow = "hidden";
      document.documentElement.setAttribute("data-preloading", "true");

      let finished = false;
      let safety = 0;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(safety);
        document.body.style.overflow = "";
        document.documentElement.removeAttribute("data-preloading");
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("preloader:complete"));
        setDone(true);
      };

      // Never block access: hard safety net if anything stalls.
      safety = window.setTimeout(finish, 6000);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { v: 0 };

        const tl = gsap.timeline({ onComplete: finish });
        tl.to(
          barRef.current,
          { scaleX: 1, duration: 1.5, ease: "power1.inOut" },
          0
        )
          .to(
            counter,
            {
              v: 100,
              duration: 1.5,
              ease: "power1.inOut",
              onUpdate: () => {
                if (countRef.current)
                  countRef.current.textContent = Math.round(counter.v).toString();
              },
            },
            0
          )
          .to(
            ".pre-content",
            { opacity: 0, y: -24, duration: 0.4, ease: "power2.in" },
            "+=0.1"
          )
          .to(rootEl, { autoAlpha: 0, duration: 0.4 }, "<0.1");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(barRef.current, { scaleX: 1 });
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
        document.documentElement.removeAttribute("data-preloading");
      };
    },
    { scope: root, dependencies: [shouldShow] }
  );

  if (!ENABLE_PRELOADER || !shouldShow || done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader-root fixed inset-0 z-[9999] select-none bg-primary"
    >
      <div className="pre-content relative z-10 flex h-full w-full flex-col justify-between px-6 py-8 text-cream-white md:px-12 md:py-10">
        <div className="flex items-center justify-between font-space-mono text-[10px] uppercase tracking-[0.3em] text-dull-text md:text-xs">
          <span>Techverzing</span>
          <span>Digital · IT · Software</span>
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
