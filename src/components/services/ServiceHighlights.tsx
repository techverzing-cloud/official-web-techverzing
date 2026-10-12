"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@iconify/react";
import MagicBento from "@/components/react-bit/MagicBento";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ServiceHighlight = {
  title: string;
  icon: string;
  description: string[];
};

interface ServiceHighlightsProps {
  items: ServiceHighlight[];
}

const ServiceHighlights = ({ items }: ServiceHighlightsProps) => {
  const root = useRef<HTMLElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".caps-head",
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".caps-head",
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-light-bg
      aria-label="What's covered"
      className="relative overflow-hidden py-[clamp(4rem,9vw,9rem)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[18vw] top-1/3 h-[45vh] w-[40vw] rounded-full bg-impact/[0.06] blur-[130px]" />
      </div>

      <div className="container relative mx-auto">
        <div className="caps-head">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-dull-text-dark">
            <span className="h-px w-8 bg-impact" />
            Capabilities
          </span>
          <h2 className="heading_4 mt-6 font-semibold text-black-slate">
            What&apos;s Covered
          </h2>
        </div>

        <div className="mt-[clamp(2.5rem,3vw,5rem)]">
          <MagicBento
            cards={items.map((item) => ({ title: item.title }))}
            renderCard={(_, index) => {
              const item = items[index];
              if (!item) return null;
              return (
                <div className="flex h-full flex-col">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[7px] border border-impact/40 bg-impact/10 text-impact">
                    <Icon icon={item.icon} width={26} height={26} />
                  </span>
                  <h3 className="heading_6 mt-5 font-semibold text-cream-white">
                    {item.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {item.description.map((li) => (
                      <li key={li} className="flex gap-3 text-base leading-relaxed text-cream-white/70">
                        <Icon
                          icon="mdi:arrow-top-right"
                          width={18}
                          height={18}
                          className="mt-1 shrink-0 text-impact/80"
                        />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }}
            gridClassName="bento-section cap-grid grid gap-2 max-w-none select-none relative mx-auto w-full p-0"
            textAutoHide={false}
            glowColor="255, 140, 66"
            bgColor="#171819"
            borderColor="#3a3a2e"
            textColor="#e8e6d9"
            disableAnimations={reduceMotion}
            enableTilt
          />
        </div>

        <style>{`
          @media (min-width: 768px) {
            .cap-grid .card-responsive .card:nth-child(1) {
              grid-column: span 2;
              grid-row: auto;
            }
          }
          @media (min-width: 1024px) {
            .cap-grid .card-responsive .card:nth-child(2) {
              grid-column: span 2;
              grid-row: auto;
            }
            .cap-grid .card-responsive .card:nth-child(3) {
              grid-column: 1 / -1;
              grid-row: auto;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default ServiceHighlights;