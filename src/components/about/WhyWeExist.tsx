"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import about from "@/json/about.json";
import SectionHeading from "@/components/home/SectionHeading";
import BounceCards from "./BounceCard";

gsap.registerPlugin(ScrollTrigger);

const { whyWeExist } = about;

const deckFor = (vw: number) =>
  vw >= 1280
    ? {
        containerWidth: vw * 0.8,
        containerHeight: 500,
        cardSize: 360,
        spread: 145,
      }
    : vw >= 1024
      ? {
          containerWidth: vw * 0.8,
          containerHeight: 400,
          cardSize: 280,
          spread: 105,
        }
      : vw >= 640
        ? {
            containerWidth: vw * 0.8,
            containerHeight: 340,
            cardSize: 240,
            spread: 70,
          }
        : {
            containerWidth: vw * 0.9,
            containerHeight: 250,
            cardSize: 160,
            spread: 48,
          };

const WhyWeExist = () => {
  const root = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let raf = 0;
    const sync = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setVw(window.innerWidth);
      });
    };
    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = deckRef.current;
    if (!el || live) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".wwe-el", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  const deck = vw ? deckFor(vw) : null;

  return (
    <section
      ref={root}
      data-light-bg
      className="rounded-t-4xl mrPy overflow-hidden"
    >
      <div className="mrMx text-center">
        <SectionHeading
          eyebrow={whyWeExist.eyebrow}
          heading={whyWeExist.heading}
        />
        <p className="wwe-el mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-dull-text-dark md:text-lg">
          {whyWeExist.description}
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <div
          ref={deckRef}
          className="flex w-full justify-center"
          style={{ height: deck?.containerHeight ?? 500 }}
        >
          {live && deck && (
            <BounceCards
              images={whyWeExist.cards}
              {...deck}
              arc={24}
              rotation={12}
              borderColor="#FF8C42"
              radius={20}
            />
          )}
        </div>

        <span className="wwe-el inline-flex items-center gap-2 font-spaceMono text-[11px] uppercase tracking-[0.25em] text-dull-text-dark">
          <span className="h-px w-8 bg-black/20" />
          {whyWeExist.hint}
        </span>
      </div>
    </section>
  );
};

export default WhyWeExist;