"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import globalData from "@/json/global.json";

gsap.registerPlugin(ScrollTrigger);

interface CtaProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

const HIDDEN_ROUTES = ["/contact"];
const HIDDEN_PREFIXES = ["/policies"];

function CtaSection({
  title,
  description,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: Required<CtaProps>) {
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from([".shared-cta-head", ".shared-cta-body"], {
          y: 28,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  useEffect(() => {
    const section = root.current;
    const dot = glow.current;
    if (!section || !dot) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      dot.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={root}
      data-light-bg="true"
      aria-labelledby="shared-cta-heading"
      className="relative overflow-hidden border-t border-black-slate/10 py-[clamp(4rem,9vw,8rem)] text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full bg-impact/10 blur-[120px]"
      />
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-impact/15 opacity-0 blur-3xl transition-opacity duration-500 ease-out will-change-transform"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        <h2 id="shared-cta-heading" className="shared-cta-head heading_2 text-black-slate">
          {title}
        </h2>
        <p className="shared-cta-body mt-5 max-w-2xl text-pretty text-dull-text-dark">
          {description}
        </p>

        <div className="shared-cta-body mt-9 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
          <Link
            href={primaryHref}
            data-cursor-hover
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-impact px-8 py-4 text-base font-semibold text-black transition-[background-color,color,transform] duration-200 ease-out hover:bg-black-slate hover:text-cream-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
          >
            {primaryText}
            <Icon
              icon="mdi:arrow-up-right"
              width={20}
              height={20}
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
            />
          </Link>

          <Link
            href={secondaryHref}
            data-cursor-hover
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-black-slate/20 px-8 py-4 text-base font-medium text-black-slate/80 transition-[border-color,color,background-color,transform] duration-200 ease-out hover:border-black-slate/40 hover:bg-black-slate/5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
          >
            {secondaryText}
            <Icon
              icon="lucide:arrow-right"
              width={18}
              height={18}
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Cta(props: CtaProps) {
  const pathname = usePathname();

  const hidden =
    HIDDEN_ROUTES.includes(pathname) ||
    HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;

  const defaults = globalData.sharedCta;

  return (
    <CtaSection
      title={props.title ?? defaults.title}
      description={props.description ?? defaults.description}
      primaryText={props.primaryText ?? defaults.primary.text}
      primaryHref={props.primaryHref ?? defaults.primary.href}
      secondaryText={props.secondaryText ?? defaults.secondary.text}
      secondaryHref={props.secondaryHref ?? defaults.secondary.href}
    />
  );
}
