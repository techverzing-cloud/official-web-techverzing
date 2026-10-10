"use client";
import { useLayoutEffect, useRef, memo } from "react";
import gsap from "gsap";

interface MarqueeProps {
  text: string | string[];
  speed?: number;
  reverse?: boolean;
}

const MarqueeComponent: React.FC<MarqueeProps> = ({
  text,
  speed = 50,
  reverse = false,
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const items = Array.isArray(text) ? text : [text];
  const itemsKey = items.join("|");

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tween: gsap.core.Tween | null = null;

    let lastScroll = 0;
    let targetScale = 1;
    let currentScale = 1;

    const ctx = gsap.context(() => {
      const el = innerRef.current;
      if (!el) return;

      tween = gsap.fromTo(
        el,
        { x: reverse ? "-50%" : "0%" },
        {
          x: reverse ? "0%" : "-50%",
          ease: "none",
          duration: speed,
          repeat: -1,
        }
      );
    });

    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScroll;

      // Scroll down → speed up (never reverse)
      if (diff > 0) {
        targetScale = Math.min(4, 1 + diff / 40); // adjust strength
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);

    // Momentum decay
    const decay = () => {
      // Ease toward target scale
      currentScale += (targetScale - currentScale) * 0.1;
      tween?.timeScale(currentScale);

      // Slowly bring target back to 1
      targetScale += (1 - targetScale) * 0.05;
    };
    gsap.ticker.add(decay);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gsap.ticker.remove(decay);
      ctx.revert();
    };
  }, [speed, itemsKey, reverse]);

  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      <div ref={innerRef} style={{ display: "inline-flex" }}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{ paddingRight: "2rem", display: "inline-block" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Marquee = memo(MarqueeComponent);
Marquee.displayName = "Marquee";
