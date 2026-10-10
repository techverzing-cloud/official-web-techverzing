"use client";

import { forwardRef, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
}

const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, delay = 0, duration = 0.6, y = 100, className }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          localRef.current,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: localRef.current,
              start: "top bottom",
              once: true,
            },
          }
        );
      }, localRef);

      return () => ctx.revert();
    }, [delay, duration, y, pathname]);

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={clsx(className)}
      >
        {children}
      </div>
    );
  }
);

Reveal.displayName = "Reveal";

export default Reveal;
