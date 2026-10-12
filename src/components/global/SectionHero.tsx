"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { twMerge } from "tailwind-merge";
import { renderTextWithHighlights } from "@/lib/util";
import { ENABLE_PRELOADER } from "@/lib/config";
import HeroCta from "@/components/ui/HeroCta";
import DotField from "@/components/react-bit/DotField";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeroLink {
  label: string;
  href: string;
}

interface SectionHeroProps {
  heading: string;
  eyebrow?: string;
  description?: string;
  highlights?: string[];
  highlightClassName?: string;
  primary?: SectionHeroLink;
  secondary?: SectionHeroLink;
  scrollTo?: string;
  scrollLabel?: string;
  className?: string;
}

export default function SectionHero({
  heading,
  eyebrow,
  description,
  highlights,
  highlightClassName = "text-impact",
  primary,
  secondary,
  scrollTo,
  scrollLabel = "Scroll",
  className,
}: SectionHeroProps) {
  const root = useRef<HTMLElement>(null);
  const headingId = useId();
  const [ready, setReady] = useState(!ENABLE_PRELOADER);

  useEffect(() => {
    if (!ENABLE_PRELOADER) return;
    const done = () => setReady(true);
    window.addEventListener("preloader:complete", done, { once: true });
    const safety = window.setTimeout(done, 7000);
    return () => {
      window.removeEventListener("preloader:complete", done);
      window.clearTimeout(safety);
    };
  }, []);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".sh-eyebrow", { autoAlpha: 0, y: reduce ? 0 : 14 });
      gsap.set(".sh-word", reduce ? { autoAlpha: 0 } : { yPercent: 115 });
      gsap.set(".sh-desc", { autoAlpha: 0, y: reduce ? 0 : 18 });
      gsap.set(".sh-cta > *", { autoAlpha: 0, y: reduce ? 0 : 16 });
      gsap.set(".sh-cue", { autoAlpha: 0 });

      if (!ready) return;

      const intro = gsap.timeline({
        defaults: { ease: reduce ? "power1.out" : "power3.out" },
      });
      intro
        .to(".sh-eyebrow", { autoAlpha: 1, y: 0, duration: 0.6 }, 0.35)
        .to(
          ".sh-word",
          { ...(reduce ? { autoAlpha: 1 } : { yPercent: 0 }), duration: 0.9, stagger: 0.05, ease: "power4.out" },
          0.5
        )
        .to(".sh-desc", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.85)
        .to(".sh-cta > *", { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09 }, 1)
        .to(".sh-cue", { autoAlpha: 1, duration: 0.5 }, 1.2);
    },
    { scope: root, dependencies: [ready] }
  );

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      gsap.to(".sh-cue-icon", {
        y: 6,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const parallax = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        parallax.to(".sh-copy", { yPercent: -12, autoAlpha: 0.35, ease: "none" }, 0);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-dark-bg
      aria-labelledby={headingId}
      className={twMerge(
        "relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden pb-24 pt-32 text-center text-cream-white",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <DotField
          className="absolute inset-0 h-full w-full"
          dotSpacing={20}
          gradientFrom="rgba(255, 140, 66, 0.45)"
          gradientTo="rgba(232, 230, 217, 0.16)"
        />
        <div className="absolute -top-[10%] left-[15%] right-[15%] h-[46vh] rounded-full bg-impact/15 blur-[130px]" />
      </div>

      <div className="sh-copy relative z-10 flex w-full max-w-4xl flex-col items-center gap-6">
        {eyebrow ? (
          <span className="sh-eyebrow inline-flex items-center gap-3 font-space-mono text-[11px] uppercase tracking-[0.34em] text-cream-white/70">
            <span className="h-px w-8 bg-impact" />
            {eyebrow}
          </span>
        ) : null}

        <h1
          id={headingId}
          className="font-nunito text-[clamp(2.35rem,5.6vw,4.75rem)] font-extrabold uppercase leading-[1.04] tracking-[-0.02em]"
          style={{ fontStretch: "86%", wordSpacing: "0.04em" }}
        >
          {heading.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.24em] inline-block overflow-hidden align-bottom">
              <span className="sh-word inline-block will-change-transform">
                {highlights?.length
                  ? renderTextWithHighlights(word, highlights, highlightClassName)
                  : word}
              </span>
            </span>
          ))}
        </h1>

        {description ? (
          <p className="sh-desc max-w-xl font-inter text-base font-light leading-relaxed text-cream-white/75 text-pretty md:text-lg">
            {description}
          </p>
        ) : null}

        {primary ? (
          <HeroCta className="sh-cta mt-2" primary={primary} secondary={secondary} />
        ) : null}
      </div>

      {scrollTo ? (
        <a
          href={scrollTo}
          data-cursor-hover
          aria-label={`Scroll to ${scrollTo.replace(/^#/, "").replace(/-/g, " ")}`}
          className="sh-cue absolute bottom-8 left-1/2 z-10 inline-flex min-h-11 -translate-x-1/2 flex-col items-center justify-center gap-1.5 rounded font-space-mono text-[10px] uppercase tracking-[0.3em] text-cream-white/60 transition-colors duration-200 hover:text-cream-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          {scrollLabel}
          <Icon icon="lucide:arrow-down" className="sh-cue-icon" width={16} height={16} />
        </a>
      ) : null}
    </section>
  );
}
