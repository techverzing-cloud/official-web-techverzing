"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const tasks = [
  { name: "Website Performance Optimization", pct: 92, color: "#FF8C42" },
  { name: "SEO & Organic Growth", pct: 68, color: "#7CC6A0" },
  { name: "CRM & Workflow Automation", pct: 45, color: "#8AB4F8" },
  { name: "Custom Software Development", pct: 100, color: "#C9A7FF" },
];

const MacWindow = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 85%",
              once: true,
            },
          })
          .from(root.current, {
            y: 30,
            opacity: 0,
            scale: 0.96,
            duration: 0.7,
            ease: "power3.out",
          })
          .from(
            ".mac-row",
            {
              y: 14,
              opacity: 0,
              stagger: 0.09,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.35"
          );

        const rows = gsap.utils.toArray<HTMLElement>(".mac-row", root.current);
        const bars = rows.map((r) => r.querySelector<HTMLElement>(".mac-bar")!);
        const spins = rows.map((r) => r.querySelector<HTMLElement>(".mac-spin")!);
        const checks = rows.map((r) => r.querySelector<HTMLElement>(".mac-check")!);

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });

        tl.set(spins, { autoAlpha: 1, scale: 1 }, 0);
        tl.set(checks, { autoAlpha: 0, scale: 0.5 }, 0);

        rows.forEach((_, i) => {
          const at = i * 0.35;
          tl.fromTo(
            bars[i],
            { scaleX: 0 },
            {
              scaleX: Number(bars[i].dataset.pct) / 100,
              duration: 1.1,
              ease: "power2.inOut",
            },
            at
          );
          tl.to(spins[i], { autoAlpha: 0, duration: 0.2 }, at + 1.0);
          tl.to(
            checks[i],
            { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
            at + 1.0
          );
        });

        gsap.to(".mac-spin", {
          rotate: 360,
          repeat: -1,
          ease: "none",
          duration: 0.9,
        });
        gsap.to(".mac-cursor", {
          opacity: 0,
          repeat: -1,
          yoyo: true,
          duration: 0.5,
          ease: "steps(1)",
        });
        gsap.to(".mac-live", { opacity: 0.25, repeat: -1, yoyo: true, duration: 0.9 });
        gsap.to(".mac-shine", {
          xPercent: 240,
          repeat: -1,
          duration: 2.2,
          ease: "power1.inOut",
          stagger: 0.25,
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".mac-bar").forEach((bar) => {
          gsap.set(bar, { scaleX: Number(bar.dataset.pct) / 100 });
        });
        gsap.set(".mac-spin", { autoAlpha: 0 });
        gsap.set(".mac-check", { autoAlpha: 1, scale: 1 });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="relative mx-auto w-full max-w-xl"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black-dull shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-space-mono text-xs text-dull-text">
            techverzing ~ active-tasks
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-space-mono text-[10px] uppercase tracking-[0.2em] text-impact">
            <span className="mac-live h-1.5 w-1.5 rounded-full bg-impact" />
            live
          </span>
        </div>

        <div className="p-5 font-space-mono">
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.name} className="mac-row">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-cream-white">
                    <span className="relative grid h-4 w-4 place-items-center">
                      <span className="mac-spin inline-block h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-impact" />
                      <span className="mac-check absolute inset-0 grid place-items-center rounded-full bg-white/10 text-[9px] leading-none text-[#7CC6A0] opacity-0">
                        ✓
                      </span>
                    </span>
                    {task.name}
                  </span>
                  <span className="text-dull-text">{task.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <span
                    data-pct={task.pct}
                    style={{ background: task.color, transform: "scaleX(0)" }}
                    className="mac-bar relative block h-full origin-left rounded-full"
                  >
                    <span className="mac-shine absolute inset-y-0 -left-1/3 w-1/3 bg-white/40 blur-[2px]" />
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-dull-text">
            <span className="text-impact">&gt;</span>
            <span>Building digital solutions for growth...</span>
            <span className="mac-cursor inline-block h-3.5 w-2 align-middle bg-cream-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacWindow;
