"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import homeData from "@/json/home.json";
import FlowingMenu from "@/components/react-bit/FlowingMenu";
import { ArrowRightIcon } from "@/components/ui/Icons";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const Industries = () => {
  const root = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { industries } = homeData;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(menuRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: menuRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} data-light-bg className="rounded-t-4xl mrPy">
      <div className="mrMx flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow={industries.eyebrow}
          heading={industries.heading}
        />
        <Link
          href="/services"
          data-cursor-hover
          className="group inline-flex w-max text-nowrap items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-cream-white transition-[color,background-color,transform] duration-200 ease-out hover:bg-impact hover:text-primary active:scale-[0.98]"
        >
          Explore all services
          <span className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
            <ArrowRightIcon />
          </span>
        </Link>
      </div>

      <div
        ref={menuRef}
        className="mt-12 overflow-hidden rounded-4xl border border-black/10 md:mt-16 md:min-h-[72vh]"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <FlowingMenu
          items={industries.items}
          speed={18}
          bgColor="#f4f4f4"
          textColor="#141415"
          marqueeBgColor="#FF8C42"
          marqueeTextColor="#141415"
          borderColor="rgba(20,20,21,0.12)"
        />
      </div>
    </section>
  );
};

export default Industries;
