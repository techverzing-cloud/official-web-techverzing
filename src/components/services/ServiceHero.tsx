"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "@iconify/react";
import { Marquee } from "@/components/home/Marquee";

gsap.registerPlugin(useGSAP);

interface ServiceHeroProps {
  title: string;
  slogan: string;
  icon: string;
}

const ServiceHero = ({ title, slogan, icon }: ServiceHeroProps) => {
  const root = useRef<HTMLElement>(null);
  const words = title.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".hero-word", { yPercent: 110 });
        gsap.set(".hero-mark", { scale: 0.6, opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(
          ".hero-mark",
          { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
          0
        )
          .fromTo(
            ".hero-eyebrow",
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.1
          )
          .fromTo(
            ".hero-badge",
            { scale: 0, rotate: -120 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.8)" },
            0.3
          )
          .to(".hero-word", { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.4)
          .fromTo(
            ".hero-slogan",
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            1.0
          )
          .fromTo(
            ".hero-cta",
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            1.12
          );

        gsap.to(".hero-ring", { rotation: 360, duration: 26, repeat: -1, ease: "none" });
        gsap.to(".hero-badge", { y: -9, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-dark-bg
      aria-label={title}
      className="relative w-full overflow-hidden pb-[clamp(4rem,8vw,7rem)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[20vw] -top-[25vh] h-[60vh] w-[60vw] rounded-full bg-impact/15 blur-[120px]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[2vw] top-1/2 z-0 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative grid h-[42vw] w-[42vw] place-items-center">
          <div className="hero-ring absolute inset-0 rounded-full border border-dashed border-cream-white/10" />
          <Icon icon={icon} className="hero-mark h-[24vw] w-[24vw] text-white/[0.04]" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto mrMx mrPy">
        <div className="hero-eyebrow flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cream-white/60">
          <span className="h-px w-8 bg-impact" />
          Techverzing Services
        </div>

        <div className="mt-10 flex items-start gap-5 md:mt-12 md:gap-8">
          <span className="hero-badge inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-impact text-black will-change-transform md:h-16 md:w-16">
            <Icon icon={icon} width={36} height={36} />
          </span>
          <h1
            style={{ fontStretch: "75%" }}
            className="heading_0 max-w-5xl uppercase font-extrabold !leading-[1] !tracking-[-0.02em] text-cream-white"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top">
                <span className="hero-word block will-change-transform">{word} </span>
              </span>
            ))}{" "}
          </h1>
        </div>

        <p className="hero-slogan mt-8 max-w-2xl text-base text-cream-white/70 md:text-lg">
          {slogan}
        </p>

        <a
          href="/contact"
          className="hero-cta group mt-12 inline-flex w-fit items-center gap-4 border-b border-impact/60 pb-2 text-sm font-semibold uppercase tracking-[0.25em] text-impact transition-colors hover:border-impact hover:text-cream-white"
        >
          Let&apos;s build this
          <Icon
            icon="mdi:arrow-up-right"
            width={18}
            height={18}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 text-cream-white/40">
        <Marquee text={slogan} speed={25} />
      </div>
    </section>
  );
};

export default ServiceHero;