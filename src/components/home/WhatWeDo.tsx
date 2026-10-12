"use client";

import { useRef } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import homeData from "@/content/home.json";
import { Icon as IconifyIcon } from "@iconify/react";
import {
  VisibilityIcon,
  GrowthIcon,
  People,
  EnergyIcon,
} from "@/components/ui/Icons";
import SectionHeading from "./SectionHeading";
import MacWindow from "./MacWindow";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, ComponentType> = {
  execution: VisibilityIcon,
  growth: GrowthIcon,
  automation: People,
  reliability: EnergyIcon,
  strategy: () => <IconifyIcon icon="mdi:lightbulb-on-outline" />,
  commerce: () => <IconifyIcon icon="mdi:cart-outline" />,
  analytics: () => <IconifyIcon icon="mdi:chart-box-outline" />,
};

const WhatWeDo = () => {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const { whatWeDo } = homeData;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current!;
          const getDistance = () =>
            Math.max(0, track.scrollWidth - track.clientWidth);

          const tween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: () => "+=" + getDistance(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (barRef.current) {
                  gsap.set(barRef.current, { scaleX: self.progress });
                }
              },
            },
          });

          gsap.utils.toArray<HTMLElement>(".wwd-card").forEach((card) => {
            gsap.from(card.querySelectorAll(".wwd-el"), {
              y: 60,
              opacity: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 80%",
                toggleActions: "play none none reverse",
              },
            });
          });
        }
      );

      mm.add(
        "(prefers-reduced-motion: reduce)",
        () => {
          gsap.utils.toArray<HTMLElement>(".wwd-card").forEach((card) => {
            gsap.from(card, {
              y: 40,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
            });
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="what-we-do"
      data-light-bg
      className="rounded-t-4xl overflow-hidden scroll-mt-24"
    >
      <div className="mrMx grid gap-10 pt-24 md:pt-32 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={whatWeDo.eyebrow}
            heading={whatWeDo.heading}
          />
          <p className="mt-6 max-w-2xl text-base text-dull-text-dark md:text-lg">
            {whatWeDo.description}
          </p>
        </div>
        <MacWindow />
      </div>

      <div
        ref={pinRef}
        className="mt-12 flex items-center overflow-hidden motion-safe:mt-16 motion-safe:h-screen"
      >
        <div
          ref={trackRef}
          className="flex w-full flex-col gap-6 motion-safe:flex-row motion-safe:gap-8 motion-safe:will-change-transform"
        >
          {whatWeDo.capabilities.map((cap) => {
            const Icon = ICONS[cap.icon] ?? GrowthIcon;
            return (
              <Link
                key={cap.hash}
                href="/services"
                data-cursor-hover
                className="wwd-card group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-4xl border border-dashed border-black/15 bg-white/70 p-6 transition-transform duration-200 ease-out md:p-10 motion-safe:h-[70vh] motion-safe:w-[82vw] motion-safe:md:w-[58vw] motion-safe:lg:w-[40vw] motion-safe:xl:w-[32vw] [@media(hover:hover)_and_(pointer:fine)]:md:hover:-translate-y-2"
              >
                <span className="wwd-el pointer-events-none absolute right-6 top-2 font-nunito text-[clamp(4rem,9vw,8rem)] font-black leading-none text-black/5">
                  {cap.index}
                </span>

                <div className="wwd-el flex items-center gap-4">
                  <span className="center h-12 w-12 rounded-full bg-primary text-cream-white">
                    <span className="h-6 w-6">
                      <Icon />
                    </span>
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-dull-text-dark">
                    #{cap.hash}
                  </span>
                </div>

                <div>
                  <h3 className="wwd-el heading_3 font-semibold text-black-slate">
                    {cap.heading}
                  </h3>
                  <p className="wwd-el mt-4 line-clamp-5 max-w-md text-dull-text-dark md:line-clamp-none">
                    {cap.description}
                  </p>
                  <ul className="wwd-el mt-6 flex flex-wrap gap-2">
                    {cap.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs text-dull-text-dark"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default WhatWeDo;
