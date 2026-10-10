"use client";
import { ReactNode, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
}

export const TextIn = ({ children, className }: Props) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    const el = elRef.current;
    gsap.set(el, { yPercent: 100, opacity: 0 });
    gsap.to(el, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 98%", 
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getById(el.id)?.kill();
    };
  }, []);

  return (
    <div
      ref={elRef}
      className={`will-change-transform overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
interface PropsString {
  children: string;
  alternative?: boolean;
  TextStagger?: boolean;
  threshold?: number;
  delay?: number;
}
export const TextInString = ({ children, alternative, delay }: PropsString) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const wordSpans = useMemo(() => {
    const translateClass = alternative
      ? "-translate-y-full"
      : "translate-y-full";

    return children.split(" ").map((word, index) => (
      <span key={index} className="inline-block overflow-hidden">
        <span className={`letter inline-block opacity-0 ${translateClass}`}>
          {word}
        </span>
        {index < children.split(" ").length - 1 && "\u00A0"}
      </span>
    ));
  }, [children, alternative]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(gsap.utils.toArray(container.querySelectorAll(".letter")), {
      yPercent: alternative ? 100 : -100,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
      delay: delay ? delay / 1000 : 0,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
    };
  }, [wordSpans, alternative, delay]);

  return (
    <div ref={containerRef} className="will-change-transform overflow-hidden">
      {wordSpans}
    </div>
  );
};
