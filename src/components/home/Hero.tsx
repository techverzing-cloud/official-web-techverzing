"use client";

import { useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import homeData from "@/json/home.json";
import { renderTextWithHighlights } from "@/lib/util";
import CrystalizedOrb from "./CrystalizedOrb";
import { ENABLE_PRELOADER } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      // The preloader paints an opaque dark layer over the page; lift the orb
      // above it so the orb stays visible while loading, then drop it back
      // behind the copy once the preloader lifts.
      let orbZCleanup = () => {};
      if (ENABLE_PRELOADER) {
        const restore = () => gsap.set(".hero-orb", { zIndex: 0 });
        window.addEventListener("preloader:complete", restore, { once: true });
        const safetyZ = window.setTimeout(restore, 7000);
        orbZCleanup = () => {
          window.removeEventListener("preloader:complete", restore);
          window.clearTimeout(safetyZ);
        };
      } else {
        gsap.set(".hero-orb", { zIndex: 0 });
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 768px)",
        },
        (ctx) => {
          const { reduce, isDesktop } = ctx.conditions as {
            reduce: boolean;
            isDesktop: boolean;
          };
          const shift = isDesktop ? 24 : 0;

          if (reduce) {
            gsap.set(
              [
                ".hero-orb",
                ".hero-eyebrow",
                ".hero-sub",
                ".hero-cta > *",
                ".hero-scroll",
              ],
              { autoAlpha: 1 }
            );
            gsap.set(".hero-word", { yPercent: 0 });
            gsap.set(".hero-orb", { scale: 1, xPercent: shift });
            gsap.set(".hero-copy", { xPercent: 0 });
            return;
          }

          // The orb sits at centre, half size, lifted above the opaque preloader.
          gsap.set(".hero-orb", { scale: 0.5 });

          // On reveal the orb grows to full size and drifts right while the copy
          // peels away to the left and reveals. Paused until the preloader lifts.
          const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
          intro
            .to(
              ".hero-orb",
              { scale: 1, xPercent: shift, duration: 1.7, ease: "power2.inOut" },
              0
            )
            .from(".hero-copy", { xPercent: shift, duration: 1.7, ease: "power3.out" }, 0.2)
            .from(".hero-eyebrow", { autoAlpha: 0, y: 16, duration: 0.7 }, 0.5)
            .from(
              ".hero-word",
              { yPercent: 115, duration: 0.9, stagger: 0.06, ease: "power4.out" },
              0.5
            )
            .from(".hero-sub", { autoAlpha: 0, y: 20, duration: 0.8 }, 0.85)
            .from(
              ".hero-cta > *",
              { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 },
              1
            )
            .from(".hero-scroll", { autoAlpha: 0, duration: 0.6 }, 1.25);

          // Ambient scroll cue
          gsap.to(".hero-scroll-icon", {
            y: 6,
            duration: 1.1,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          // Scroll parallax — the orb drifts slowly as the copy lifts away.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.to(".hero-orb", { yPercent: 8, ease: "none" }, 0).to(
            ".hero-copy",
            { yPercent: -10, autoAlpha: 0.4, ease: "none" },
            0
          );

          // Gate the reveal on the preloader; safety net so we never trap the user.
          const play = () => intro.play();
          if (!ENABLE_PRELOADER) {
            play();
            return;
          }
          window.addEventListener("preloader:complete", play, { once: true });
          const safety = window.setTimeout(play, 7000);
          return () => {
            window.removeEventListener("preloader:complete", play);
            window.clearTimeout(safety);
          };
        },
        root
      );

      return () => {
        orbZCleanup();
        mm.revert();
      };
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
      <div className="hero-orb pointer-events-none absolute inset-0 z-[10000] grid place-items-center">
        <div className="h-[88vmin] w-[88vmin] max-w-[88vw]">
          <CrystalizedOrb preset="ember" theme="dark" size={0.72} interactive />
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