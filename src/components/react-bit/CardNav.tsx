"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const contentEl = navEl.querySelector(
      ".card-nav-content",
    ) as HTMLElement | null;
    if (!contentEl) return 260;

    const containerEl = containerRef.current;
    const wasWidth = containerEl?.style.width ?? "";
    const wasTransition = containerEl?.style.transition ?? "";
    if (containerEl) {
      containerEl.style.transition = "none";
      containerEl.style.width = "90vw";
    }

    const wasVisible = contentEl.style.visibility;
    const wasPointerEvents = contentEl.style.pointerEvents;
    const wasPosition = contentEl.style.position;
    const wasHeight = contentEl.style.height;

    contentEl.style.visibility = "visible";
    contentEl.style.pointerEvents = "auto";
    contentEl.style.position = "static";
    contentEl.style.height = "auto";

    contentEl.offsetHeight;

    const topBar = 60;
    const padding = 16;
    const contentHeight = contentEl.scrollHeight;

    contentEl.style.visibility = wasVisible;
    contentEl.style.pointerEvents = wasPointerEvents;
    contentEl.style.position = wasPosition;
    contentEl.style.height = wasHeight;

    if (containerEl) {
      containerEl.style.width = wasWidth;
      containerEl.style.transition = wasTransition;
    }

    const maxHeight = window.innerHeight - 40;
    return Math.min(topBar + contentHeight + padding, maxHeight);
  };

  const getCollapsedWidth = () =>
    window.matchMedia("(max-width: 768px)").matches ? "90vw" : "50vw";

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;
    const containerEl = containerRef.current;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });
    if (containerEl) gsap.set(containerEl, { width: getCollapsedWidth() });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    if (containerEl) {
      tl.to(containerEl, { width: "90vw", duration: 0.4, ease }, 0);
    }

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  useLayoutEffect(() => {
    const [top, bottom] = linesRef.current;
    if (!top || !bottom) return;

    const tweenTop = gsap.to(top, {
      y: isHamburgerOpen ? 4 : 0,
      rotation: isHamburgerOpen ? 45 : 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
    const tweenBottom = gsap.to(bottom, {
      y: isHamburgerOpen ? -4 : 0,
      rotation: isHamburgerOpen ? -45 : 0,
      duration: 0.4,
      ease: "power2.inOut",
    });

    return () => {
      tweenTop.kill();
      tweenBottom.kill();
    };
  }, [isHamburgerOpen]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      ref={containerRef}
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 z-[99] top-[calc(env(safe-area-inset-top,0px)+1.2em)] md:top-[calc(env(safe-area-inset-top,0px)+2em)] w-[90vw] md:w-[50vw] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div className="logo-container flex items-center" data-cursor-hover>
            <Link href="/" aria-label="Go to home" className="flex items-center">
              <Image
                src={logo}
                alt={logoAlt}
                width={120}
                height={28}
                className="h-14 w-auto"
                priority
              />
            </Link>
          </div>

          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} group h-full min-w-11 flex flex-col items-center justify-center cursor-pointer gap-[6px] pr-2`}
            onClick={toggleMenu}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            data-cursor-hover
            style={{ color: menuColor || "#000" }}
          >
            <div
              ref={(el) => {
                linesRef.current[0] = el;
              }}
              className="hamburger-line w-[30px] h-[2px] bg-current transition-opacity duration-300 group-hover:opacity-75"
            />
            <div
              ref={(el) => {
                linesRef.current[1] = el;
              }}
              className="hamburger-line w-[30px] h-[2px] bg-current transition-opacity duration-300 group-hover:opacity-75"
            />
          </div>
        </div>

        <div
          className={`card-nav-content no-scroll-bar absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 overflow-y-auto justify-start z-[1] ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          } md:flex-row md:items-start md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => {
            const twoCol = (item.links?.length ?? 0) > 4;
            return (
              <div
                key={`${item.label}-${idx}`}
                className={`nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 ${
                  twoCol ? "md:flex-[2_1_0%]" : "md:flex-[1_1_0%]"
                }`}
                ref={setCardRef(idx)}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                  {item.label}
                </div>
                <div
                  className={`nav-card-links mt-auto flex ${
                    twoCol
                      ? "flex-row flex-wrap gap-x-4 gap-y-[2px]"
                      : "flex-col gap-[2px]"
                  }`}
                >
                  {item.links?.map((lnk, i) => (
                    <a
                      key={`${lnk.label}-${i}`}
                      className={`nav-card-link inline-flex items-center gap-[6px] py-1.5 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px] ${
                        twoCol ? "basis-[calc(50%-0.5rem)]" : ""
                      }`}
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                    >
                      <Icon
                        icon="lucide:arrow-up-right"
                        className="nav-card-link-icon shrink-0"
                        aria-hidden="true"
                      />
                      {lnk.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
