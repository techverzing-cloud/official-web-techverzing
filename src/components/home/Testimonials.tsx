"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@iconify/react";
import homeData from "@/json/home.json";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const { testimonials } = homeData;
  const items = testimonials.items;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>(".tst-item");
          const dots = gsap.utils.toArray<HTMLElement>(".tst-dot");

          gsap.set(cards.slice(1), {
            opacity: 0,
            yPercent: 60,
                filter: "blur(6px)",
          });

          const setActive = (index: number) => {
            if (counterRef.current) {
              counterRef.current.textContent = String(index + 1).padStart(
                2,
                "0"
              );
            }
            dots.forEach((dot, i) => {
              gsap.to(dot, {
                scaleX: i === index ? 1 : 0.35,
                opacity: i === index ? 1 : 0.3,
                duration: 0.3,
                overwrite: true,
              });
            });
          };

          setActive(0);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: () => "+=" + (cards.length - 1) * window.innerHeight,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                setActive(Math.round(self.progress * (cards.length - 1))),
            },
          });

          cards.forEach((card, i) => {
            if (i === 0) return;
            tl.to(
              cards[i - 1],
              {
                opacity: 0,
                yPercent: -60,
            filter: "blur(6px)",
                duration: 1,
              },
              i - 1
            ).to(
              card,
              { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1 },
              i - 1
            );
          });
        }
      );

      mm.add(
        "(max-width: 767px), (prefers-reduced-motion: reduce), (hover: none)",
        () => {
          gsap.utils.toArray<HTMLElement>(".tst-item").forEach((card) => {
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
    <section ref={root} data-dark-bg className="mrBg text-cream-white">
      <div
        ref={pinRef}
        className="relative flex flex-col overflow-hidden px-4 pb-16 pt-24 md:px-8 md:pb-10 xl:px-12 motion-safe:md:h-screen"
      >
        <div className="mrMx flex items-end justify-between gap-6">
          <SectionHeading
            dark
            eyebrow={testimonials.eyebrow}
            heading={testimonials.heading}
          />
          <span className="hidden items-baseline gap-1 font-nunito md:flex">
            <span
              ref={counterRef}
              className="text-3xl font-bold text-white"
            >
              01
            </span>
            <span className="text-dull-text">
              / {String(items.length).padStart(2, "0")}
            </span>
          </span>
        </div>

        <div className="relative mrMx mt-10 flex-1 space-y-12 motion-safe:md:min-h-0 motion-safe:md:space-y-0">
          {items.map((item, i) => (
            <blockquote
              key={i}
              className="tst-item flex flex-col justify-between motion-safe:md:absolute motion-safe:md:inset-0"
            >
              <div>
                <Icon
                  icon="mdi:format-quote-open"
                  className="text-impact"
                  width={56}
                />
                <p className="mt-6 max-w-4xl font-nunito text-[clamp(1.4rem,2.6vw,2.25rem)] font-medium leading-snug text-white">
                  {item.quote}
                </p>
              </div>

              <footer className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-1 text-impact">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Icon key={star} icon="mdi:star" width={18} />
                  ))}
                  <span className="ml-2 text-sm text-dull-text">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-white">
                    {item.name}
                  </span>
                  <span className="text-dull-text">
                    {" "}
                    — {item.role}, {item.company}
                  </span>
                </p>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mrMx mt-10 hidden gap-2 motion-safe:md:flex">
          {items.map((_, i) => (
            <span
              key={i}
              className="tst-dot h-0.5 w-12 origin-left bg-impact"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
