"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import homeData from "@/content/home.json";
import { renderTextWithHighlights } from "@/lib/util";
import { ENABLE_PRELOADER } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

// The WebGL orb is the heaviest thing on the page - keep it out of the initial
// bundle and only mount it once the page is idle.
const CrystalizedOrb = dynamic(() => import("./CrystalizedOrb"), { ssr: false });

const isLowEndDevice = () => {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  const lowRam = typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory <= 4;
  return lowCpu || lowRam;
};

const Hero = () => {
  const root = useRef<HTMLElement>(null);
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
      const shift = window.matchMedia("(min-width: 768px)").matches && !reduce ? 24 : 0;

      // Pre-reveal state, set once at mount. The copy block stays in its
      // natural spot - only the text layers hide - so the reveal depends on no
      // viewport-height math and works the same on every screen. Reduced motion
      // hides with opacity only (no movement).
      gsap.set(".hero-orb", { scale: reduce ? 1 : 0.7 });
      gsap.set(".hero-eyebrow", { autoAlpha: 0, y: reduce ? 0 : 16 });
      gsap.set(".hero-word", reduce ? { autoAlpha: 0 } : { yPercent: 115 });
      gsap.set(".hero-sub", { autoAlpha: 0, y: reduce ? 0 : 20 });
      gsap.set(".hero-cta > *", { autoAlpha: 0, y: reduce ? 0 : 18 });
      gsap.set(".hero-scroll", { autoAlpha: 0 });

      // `ready` flips the instant the preloader lifts. The timeline is rebuilt
      // and played then: orb settles at centre → text fades/slides in over it.
      if (!ready) return;

      const intro = gsap.timeline({ defaults: { ease: reduce ? "power1.out" : "power3.out" } });
      if (!reduce) {
        intro.to(
          ".hero-orb",
          { scale: 1, xPercent: shift, duration: 1.4, ease: "power2.inOut" },
          0
        );
      }
      const wordTo = reduce ? { autoAlpha: 1 } : { yPercent: 0 };
      intro
        .to(".hero-eyebrow", { autoAlpha: 1, y: 0, duration: 0.6 }, 0.35)
        .to(
          ".hero-word",
          { ...wordTo, duration: 0.9, stagger: 0.06, ease: "power4.out" },
          0.35
        )
        .to(".hero-sub", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.65)
        .to(
          ".hero-cta > *",
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
          0.8
        )
        .to(".hero-scroll", { autoAlpha: 1, duration: 0.5 }, 1.0);
    },
    { scope: root, dependencies: [ready] }
  );

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ambient scroll cue
        gsap.to(".hero-scroll-icon", {
          y: 6,
          duration: 1.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Scroll parallax - the orb drifts slowly as the copy lifts away.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        tl.to(".hero-orb", { yPercent: 8, ease: "none" }, 0).to(
          ".hero-copy-inner",
          { yPercent: -10, autoAlpha: 0.4, ease: "none" },
          0
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="hero"
      data-dark-bg
      className="relative mb-8 min-h-svh w-full overflow-hidden text-cream-white"
    >
      <div
        className={`hero-orb pointer-events-none absolute inset-0 grid place-items-center ${
          ready ? "z-0" : "z-[10000]"
        }`}
      >
        <div className="relative h-[62vmin] w-[62vmin] max-w-[70vw]">
          <CrystalizedOrb preset="ember" theme="dark" size={0.66} interactive={!isLowEndDevice()} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(115%_85%_at_50%_45%,rgba(32,34,35,0.7)_0%,rgba(32,34,35,0.25)_50%,transparent_78%)] md:hidden" />

      <div className="hero-copy relative z-10 flex min-h-svh flex-col items-center justify-center px-6 py-20 text-center md:px-12 lg:items-start lg:px-[clamp(2rem,7vw,8rem)] lg:text-left">
        <div className="hero-copy-inner mt-14 flex max-w-xl flex-col items-center gap-5 lg:mt-24 lg:max-w-[40rem] lg:items-start lg:gap-6">
          <span className="hero-eyebrow font-space-mono text-[11px] uppercase tracking-[0.34em] text-cream-white/70 md:text-xs">
            Techverzing Technologies
          </span>

          <h1
            className="hero-title font-nunito text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em]"
            style={{ fontStretch: "82%", wordSpacing: "0.06em" }}
          >
            {["Where technology meets", "business growth"].map((line, li) => (
              <span key={li} className="block">
                {line.split(" ").map((word, wi) => (
                  <span
                    key={wi}
                    className="mr-[0.24em] inline-block overflow-hidden align-bottom"
                  >
                    <span className="hero-word inline-block will-change-transform">
                      {renderTextWithHighlights(
                        word,
                        ["technology", "growth"],
                        "text-impact"
                      )}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-sub max-w-xl font-inter text-sm font-normal leading-relaxed text-cream-white/75 text-pretty md:text-lg">
            {homeData.hero.subHeading}
          </p>

          <div className="hero-cta mt-2 flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/contact"
              data-cursor-hover
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-cream-white px-4 py-2.5 text-xs font-semibold text-primary transition duration-150 ease-out hover:bg-impact active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:px-6 sm:py-3 sm:text-sm md:text-base"
            >
              Start a project
              <Icon
                icon="lucide:arrow-right"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/services"
              data-cursor-hover
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-cream-white/25 px-4 py-2.5 text-xs font-medium text-cream-white/85 transition duration-150 ease-out hover:border-cream-white/60 hover:text-cream-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:px-6 sm:py-3 sm:text-sm md:text-base"
            >
              Explore services
            </Link>
          </div>

          <a
            href="#what-we-do"
            data-cursor-hover
            aria-label="Scroll to what we do"
            className="hero-scroll mt-4 inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded py-2 font-space-mono text-[10px] uppercase tracking-[0.3em] text-cream-white/60 transition-colors duration-200 hover:text-cream-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Scroll
            <Icon
              icon="lucide:arrow-down"
              className="hero-scroll-icon"
              width={16}
              height={16}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;