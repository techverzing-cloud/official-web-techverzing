"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@iconify/react";
import globalData from "@/json/global.json";
import MagicBento from "./Magic-bento";
import SpotlightCard from "./Spotlight-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AdvantageItem = { title: string; description: string };

interface ServiceAdvantageProps {
  title: string;
  subtitle: string;
  description: string[];
  advantages: AdvantageItem[];
}

const ServiceAdvantage = ({
  title,
  subtitle,
  description,
  advantages,
}: ServiceAdvantageProps) => {
  const root = useRef<HTMLElement>(null);
  const contact = globalData.contactInfo.items;
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
        gsap.utils.toArray<HTMLElement>(".adv-reveal").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        ScrollTrigger.batch(".adv-bento-grid .card", {
          start: "top 88%",
          onEnter: (cards) =>
            gsap.fromTo(
              cards,
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                stagger: 0.12,
                duration: 0.7,
                ease: "power3.out",
                overwrite: true,
              }
            ),
        });
      });
    },
    { scope: root }
  );

  const phone = contact[0];
  const emails = [contact[1], contact[2]].filter((c) => c !== undefined);

  return (
    <section
      ref={root}
      data-dark-bg
      aria-label={title}
      className="relative overflow-hidden py-[clamp(4rem,9vw,9rem)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-15vw] top-1/4 h-[45vh] w-[40vw] rounded-full bg-impact/[0.06] blur-[130px]" />
      </div>

      <div className="container mx-auto mrMx">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="adv-reveal">
                <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cream-white/60">
                  <span className="h-px w-8 bg-impact" />
                  Why Choose Us
                </span>
                <h2 className="heading_4 mt-6 font-semibold text-cream-white">
                  {title}
                </h2>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-impact">
                  {subtitle}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {description.map((d) => (
                  <p key={d} className="adv-reveal text-cream-white/70">
                    {d}
                  </p>
                ))}
              </div>

              <div className="adv-reveal mt-10 space-y-3 border-t border-cream-white/10 pt-8">
                {phone && (
                  <a
                    href={`tel:${phone.text.replace(/\s/g, "")}`}
                    className="flex w-fit items-center gap-3 text-cream-white/70 transition-colors hover:text-impact"
                  >
                    <Icon
                      icon={phone.icon}
                      width={20}
                      height={20}
                      className="text-impact"
                    />
                    {phone.text}
                  </a>
                )}
                {emails.map((email) => (
                  <a
                    key={email.text}
                    href={`mailto:${email.text}`}
                    className="flex w-fit items-center gap-3 text-cream-white/70 transition-colors hover:text-impact"
                  >
                    <Icon
                      icon={email.icon}
                      width={20}
                      height={20}
                      className="text-impact"
                    />
                    {email.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="adv-bento">
              <SpotlightCard
                spotlightColor="#ff8c42"
                intensity={0.12}
                proximity={160}
                theme="dark"
              >
                <MagicBento
                  cards={advantages.map((item) => ({ title: item.title }))}
                  renderCard={(_, index) => {
                    const item = advantages[index];
                    if (!item) return null;
                    return (
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-baseline justify-between gap-4">
                          <h3 className="adv-title heading_6 font-semibold text-cream-white transition-colors duration-300">
                            {item.title}
                          </h3>
                          
                        </div>
                        <p className="mt-4 text-cream-white/70">
                          {item.description}
                        </p>
                      </div>
                    );
                  }}
                  gridClassName="bento-section adv-bento-grid grid gap-3 max-w-none select-none relative mx-auto w-full p-0"
                  textAutoHide={false}
                  glowColor="255, 140, 66"
                  bgColor="#171819"
                  borderColor="#3a3a2e"
                  textColor="#e8e6d9"
                  particleCount={8}
                  disableAnimations={reduceMotion}
                  enableTilt
                />
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .adv-bento-grid .card-responsive .card:nth-child(1) {
            grid-column: span 2;
            grid-row: auto;
          }
        }
        @media (min-width: 1024px) {
          .adv-bento-grid .card-responsive .card:nth-child(2) {
            grid-column: span 2;
            grid-row: auto;
          }
          .adv-bento-grid .card-responsive .card:nth-child(3) {
            grid-column: 1 / -1;
            grid-row: auto;
          }
        }
        .adv-bento-grid .card:hover .adv-title {
          color: #ff8c42;
        }
        .adv-bento-grid .card:hover .adv-arrow {
          transform: translate(4px, -4px);
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default ServiceAdvantage;