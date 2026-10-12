"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import SpotlightCard from "./Spotlight-card";
import CircularGallery from "./circular-gallery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ServiceIntroItem = {
  title: string;
  subtitle: string;
  image: { src: string; alt: string };
  description: string[];
};

interface ServiceIntroProps {
  heading: string;
  text: string;
  icon: string;
  items: ServiceIntroItem[];
}

const ServiceIntro = ({ heading, text, icon, items }: ServiceIntroProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".intro-head",
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".intro-head",
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );

        ScrollTrigger.batch(".svc-card", {
          start: "top 88%",
          onEnter: (cards) =>
            gsap.fromTo(
              cards,
              { autoAlpha: 0, y: 40 },
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.8,
                ease: "power3.out",
                overwrite: true,
              }
            ),
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="service-intro"
      ref={root}
      data-dark-bg
      aria-label={heading}
      className="relative overflow-hidden py-[clamp(4rem,9vw,9rem)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[20vw] top-1/4 h-[50vh] w-[45vw] rounded-full bg-impact/[0.07] blur-[120px]" />
        <svg
          viewBox="0 0 200 200"
          aria-hidden
          className="absolute -right-[6vw] top-[12%] w-[34vw] max-w-[340px] opacity-[0.35]"
        >
          <path
            d="M10 160 C 60 40, 140 40, 190 130"
            fill="none"
            stroke="#ff8c42"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1 7"
          />
          <path
            d="M30 190 C 80 60, 160 60, 200 150"
            fill="none"
            stroke="#ff8c42"
            strokeWidth="0.75"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="container relative mx-auto">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="intro-head lg:col-span-4 lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cream-white/60">
              <span className="h-px w-8 bg-impact" />
              <Icon icon={icon} width={16} height={16} className="text-impact" />
              What We Do
            </span>
            <h2 className="heading_4 mt-6 font-semibold text-cream-white">
              {heading}
            </h2>
            <p className="mt-6 text-base text-cream-white/70 md:text-lg">{text}</p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, i) => (
                <SpotlightCard
                  key={item.title}
                  spotlightColor="#ff8c42"
                  intensity={0.14}
                  spotlightSize={280}
                  softness={0.65}
                  proximity={140}
                  smoothing={0.35}
                  theme="dark"
                  className="svc-card h-full"
                >
                  <article className="flex h-full flex-col">
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black-slate/80 via-transparent to-transparent"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-impact/40 bg-black-slate/70 px-2.5 py-1 text-xs font-semibold tracking-[0.2em] text-impact backdrop-blur-sm">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-impact" />
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col pt-6">
                      <h3 className="heading_6 font-semibold text-cream-white transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-cream-white/70">
                        {item.subtitle}
                      </p>
                      <ul className="mt-5 space-y-2.5">
                        {item.description.map((d) => (
                          <li
                            key={d}
                            className="flex gap-2.5 text-base leading-relaxed text-cream-white/75"
                          >
                            <Icon
                              icon="mdi:check"
                              width={16}
                              height={16}
                              aria-hidden
                              className="mt-0.5 shrink-0 text-impact"
                            />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/contact"
                        data-cursor-hover
                        className="group/link mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-impact transition-colors duration-200 hover:text-cream-white"
                      >
                        Learn More
                        <Icon
                          icon="mdi:arrow-up-right"
                          width={18}
                          height={18}
                          aria-hidden
                          className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </article>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-[clamp(3rem,6vw,5rem)] h-[clamp(280px,36vw,460px)] w-full overflow-hidden">
        <CircularGallery
          items={items.map((item) => ({
            image: item.image.src,
            text: item.title,
          }))}
          borderRadius={0.06}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>

      <style>{`
        .svc-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(
            120deg,
            transparent 20%,
            rgba(255, 140, 66, 0.5) 35%,
            rgba(255, 140, 66, 0.9) 50%,
            rgba(255, 140, 66, 0.5) 65%,
            transparent 80%
          );
          background-size: 250% 100%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }
        @media (hover: hover) and (prefers-reduced-motion: no-preference) {
          .svc-card:hover::before {
            opacity: 1;
            animation: svc-border-flow 2.5s linear infinite;
          }
        }
        @keyframes svc-border-flow {
          to {
            background-position: -250% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ServiceIntro;