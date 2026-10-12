"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import site from "@/content/site.json";

gsap.registerPlugin(ScrollTrigger);

const { footer } = site;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLElement | null)[]>([]);
  const socialRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    (_context) => {
      const footerEl = footerRef.current;
      if (!footerEl) return;

      const columns = columnRefs.current.filter(Boolean) as HTMLElement[];
      const socialIcons = socialRefs.current.filter(Boolean) as HTMLElement[];

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!prefersReducedMotion) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerEl,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          columns,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          }
        ).fromTo(
          socialIcons,
          { y: 20, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.3)",
            stagger: 0.06,
          },
          "-=0.3"
        );
      } else {
        gsap.set(columns, { y: 0, opacity: 1 });
        gsap.set(socialIcons, { y: 0, opacity: 1, scale: 1 });
      }

      const wordmarkEl = wordmarkRef.current;
      if (wordmarkEl && !prefersReducedMotion) {
        gsap.fromTo(
          wordmarkEl,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wordmarkEl,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else if (wordmarkEl) {
        gsap.set(wordmarkEl, { y: 0, opacity: 1 });
      }

      const linkEls = footerEl.querySelectorAll<HTMLAnchorElement>(
        ".footer-nav-link, .footer-social-link"
      );
      linkEls.forEach((link) => {
        const handleMouseEnter = () => {
          gsap.to(link, {
            x: link.classList.contains("footer-social-link") ? 0 : 4,
            scale: link.classList.contains("footer-social-link") ? 1.08 : 1,
            duration: 0.2,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(link, {
            x: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseDown = () => {
          gsap.to(link, {
            scale: link.classList.contains("footer-social-link") ? 0.92 : 0.98,
            duration: 0.1,
            ease: "power2.out",
          });
        };

        const handleMouseUp = () => {
          gsap.to(link, {
            scale: link.classList.contains("footer-social-link") ? 1.08 : 1,
            duration: 0.2,
            ease: "back.out(1.5)",
          });
        };

        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);
        link.addEventListener("mousedown", handleMouseDown);
        link.addEventListener("mouseup", handleMouseUp);
        link.addEventListener("mouseleave", handleMouseUp);

        return () => {
          link.removeEventListener("mouseenter", handleMouseEnter);
          link.removeEventListener("mouseleave", handleMouseLeave);
          link.removeEventListener("mousedown", handleMouseDown);
          link.removeEventListener("mouseup", handleMouseUp);
        };
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative bg-primary data-dark-bg"
      data-dark-bg
      role="contentinfo"
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(115%_85%_at_50%_45%,rgba(32,34,35,0.8)_0%,rgba(32,34,35,0.4)_50%,transparent_78%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-16">
            <div
              ref={(el) => { columnRefs.current[0] = el; }}
              className="flex flex-col items-center text-center md:items-start md:text-start lg:pr-8"
            >
              <Image
                src="/shared/logo.png"
                alt="Techverzing Technologies logo"
                width={1069}
                height={233}
                className="mb-6 h-9 w-auto md:h-11"
              />

              <p className="text-cream-white/70 text-base md:text-lg leading-relaxed max-w-xs">
                {footer.description}
              </p>

              <div className="mt-8 flex justify-center gap-3 list-none md:justify-start" role="list" aria-label="Social links">
                {site.socialLinks.map((link, idx) => (
                  <li key={idx} role="listitem">
                    <Link
                      ref={(el) => { socialRefs.current[idx] = el; }}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className="footer-social-link group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-200 ease-out hover:border-white/20 hover:bg-white/[0.06] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                      data-cursor-hover
                    >
                      <Image
                        src={link.icon}
                        alt={link.name}
                        width={24}
                        height={24}
                        className="w-5 h-5 object-contain text-cream-white/80 group-hover:text-cream-white transition-colors duration-200"
                      />
                    </Link>
                  </li>
                ))}
              </div>
            </div>

            {footer.navSections.map((section, sectionIdx) => (
              <div
                key={section.label}
                ref={(el) => { columnRefs.current[sectionIdx + 1] = el; }}
                className="flex flex-col items-center text-center md:col-span-1 md:items-start md:text-start"
              >
                <div className="relative pb-3">
                  <div className="absolute bottom-0 left-0 w-10 h-px bg-white/10 max-md:left-1/2 max-md:-translate-x-1/2" aria-hidden="true" />
                  <h3 className="text-cream-white font-nunito font-semibold text-sm md:text-base tracking-wider uppercase">
                    {section.label}
                  </h3>
                </div>
                <nav className="mt-5 w-full" aria-label={`${section.label} links`}>
                  <ul className="space-y-3 list-none" role="list">
                    {section.categories.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.link}
                          className="footer-nav-link group relative inline-flex items-center gap-2 text-cream-white/60 text-sm transition-all duration-200 ease-out hover:text-cream-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm px-1 py-0.5 -mx-1 -my-0.5"
                          data-cursor-hover
                        >
                          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-current after:scale-x-0 after:origin-right group-hover:after:scale-x-100 group-hover:after:origin-left after:transition-transform after:duration-200 after:ease-out">
                            {link.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>

          <div
            ref={(el) => { wordmarkRef.current = el; }}
            className="mt-12 md:mt-16 lg:mt-20 relative"
            aria-hidden="true"
          >
            <div className="relative overflow-hidden">
              <p className="footer-wordmark font-nunito font-extrabold uppercase tracking-tighter md:text-7xl lg:text-8xl xl:text-9xl text-3xl leading-none select-none text-center md:text-left">
                Techverzing
              </p>
            </div>
          </div>
        </div>

        <div className="relative pt-8 md:pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 py-6">
            <p className="text-center text-cream-white/40 text-sm md:text-left md:text-base tracking-wide">
              © {new Date().getFullYear()} Techverzing Technologies. All rights reserved.
            </p>

            <nav className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6" aria-label="Legal links">
              <Link
                href={footer.legal.terms.href}
                className="footer-nav-link text-cream-white/40 text-sm tracking-wide hover:text-cream-white transition-colors duration-200"
                data-cursor-hover
              >
                {footer.legal.terms.label}
              </Link>
              <span className="text-white/5" aria-hidden="true">
                ·
              </span>
              <Link
                href={footer.legal.privacy.href}
                className="footer-nav-link text-cream-white/40 text-sm tracking-wide hover:text-cream-white transition-colors duration-200"
                data-cursor-hover
              >
                {footer.legal.privacy.label}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}