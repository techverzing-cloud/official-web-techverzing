"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function ClientProviders() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      anchors: { offset: -96 },
      allowNestedScroll: true,
      prevent: (node) => {
        // Prevent Lenis from handling scroll on chat widget and its portal
        if (node.id === "chat-widget-portal") return true;
        if (node.closest("#chat-widget-portal")) return true;
        if (node.closest(".techverzing-chat-widget")) return true;
        if (node.closest(".ai-chat-widget-root")) return true;
        return false;
      },
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      (window as Window & { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" />
    </>
  );
}
