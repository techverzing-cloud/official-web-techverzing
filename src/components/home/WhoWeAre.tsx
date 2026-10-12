"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import homeData from "@/content/home.json";
import DotGrid from "@/components/react-bit/DotGrid";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const WhoWeAre = () => {
  const root = useRef<HTMLElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const { whoWeAre } = homeData;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = root.current!;
        const counters = gsap.utils.toArray<HTMLElement>(
          ".wwa-stat-value",
          section
        );
        const frames = gsap.utils.toArray<HTMLElement>(".wwa-story", section);
        const rail = section.querySelector(".wwa-rail");

        // Statement: soft mask rise
        gsap.fromTo(
          ".wwa-statement",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section.querySelector(".wwa-statement"),
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Stats: stagger in + rule draw + count up
        const statsTl = gsap.timeline({
          scrollTrigger: {
            trigger: section.querySelector(".wwa-stats"),
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
        statsTl
          .from(".wwa-stat", {
            y: 24,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          })
          .from(
            ".wwa-stat-rule",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.5,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.1
          );

        counters.forEach((el) => {
          const target = Number(el.dataset.value) || 0;
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v));
            },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Story rail: draws down as you scroll through the list
        if (rail) {
          gsap.fromTo(
            rail,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: storiesRef.current,
                start: "top 70%",
                end: "bottom 75%",
                scrub: 0.5,
              },
            }
          );
        }

        // Story frames: node pop, core ignite, number slide, masked title, text
        frames.forEach((frame) => {
          const node = frame.querySelector(".wwa-node");
          const core = frame.querySelector(".wwa-node-core");
          const num = frame.querySelector(".wwa-num");
          const title = frame.querySelector(".wwa-title");
          const text = frame.querySelector(".wwa-text");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: frame,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
          tl.fromTo(
            node,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            0
          )
            .fromTo(
              core,
              { scale: 0 },
              { scale: 1, duration: 0.5, ease: "power2.out" },
              0.12
            )
            .fromTo(
              num,
              { opacity: 0, x: -16 },
              { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
              0.1
            )
            .fromTo(
              title,
              { yPercent: 115, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
              0.15
            )
            .fromTo(
              text,
              { y: 20, opacity: 0, filter: "blur(6px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "power3.out",
              },
              0.28
            );
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".wwa-statement", { opacity: 1, y: 0 });
        gsap.set(".wwa-story", { opacity: 1, y: 0 });
        gsap.set(".wwa-node, .wwa-node-core", { scale: 1, opacity: 1 });
        gsap.set(".wwa-rail", { scaleY: 1 });
        gsap.utils
          .toArray<HTMLElement>(".wwa-stat-value", root.current!)
          .forEach((el) => {
            el.textContent = el.dataset.value ?? "0";
          });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-dark-bg
      className="mrBg relative overflow-hidden text-cream-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <DotGrid
          dotRadius={1}
          dotSpacing={24}
          bulgeStrength={45}
          gradientFrom="rgba(255,140,66,0.35)"
          gradientTo="rgba(232,230,217,0.12)"
          glowColor="#FF8C42"
        />
      </div>

      <div className="relative z-10 mrMx grid gap-14 py-[clamp(4rem,8vw,10rem)] lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            dark
            eyebrow={whoWeAre.eyebrow}
            heading={whoWeAre.heading}
          />

          <div className="wwa-statement mt-8 max-w-[58ch]">
            <p className="font-inter text-[1.05rem] font-normal leading-[1.7] text-dull-text text-pretty md:text-lg">
              {whoWeAre.statement}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-14">
          <div ref={storiesRef} className="relative">
            <div className="wwa-rail-track absolute inset-y-0 left-[7px] w-px bg-cream-white/15" />
            <div className="wwa-rail absolute left-[7px] top-0 h-full w-px origin-top bg-impact" />

            <div className="flex flex-col">
              {whoWeAre.story.map((block, i) => (
                <article
                  key={block.title}
                  className="wwa-story relative border-t border-cream-white/10 py-8 pl-10 first:border-t-0 first:pt-2 md:pl-12"
                >
                  <span className="wwa-node absolute left-0 top-5 h-[15px] w-[15px] rounded-full border border-impact bg-primary">
                    <span className="wwa-node-core absolute inset-[4px] rounded-full bg-impact" />
                  </span>

                  <div className="flex items-baseline gap-4">
                    <span className="wwa-num font-spaceMono text-sm tabular-nums text-impact">
                      0{i + 1}
                    </span>
                    <span className="block overflow-hidden">
                      <h3 className="wwa-title heading_4 font-semibold text-balance text-white">
                        {block.title}
                      </h3>
                    </span>
                  </div>
                  <p className="wwa-text mt-4 max-w-[52ch] font-inter text-base font-normal leading-[1.7] text-dull-text text-pretty">
                    {block.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="wwa-stats grid grid-cols-2 gap-x-6 gap-y-8 border-t border-cream-white/10 pt-10 sm:grid-cols-4 lg:col-span-2">
          {whoWeAre.stats.map((stat) => (
            <div key={stat.label} className="wwa-stat">
              <p className="font-nunito text-3xl font-bold tabular-nums text-white md:text-4xl">
                <span className="wwa-stat-value" data-value={stat.value}>
                  0
                </span>
                <span className="text-impact">{stat.suffix}</span>
              </p>
              <span className="wwa-stat-rule mt-3 block h-px w-10 bg-impact/70" />
              <p className="mt-3 font-inter text-xs font-medium uppercase tracking-[0.18em] text-dull-text">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;