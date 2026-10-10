"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GButton from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const ClientsCta = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(".cta-heading", {
          yPercent: 115,
          duration: 0.8,
          ease: "power3.out",
        })
          .from(
            [".cta-copy", ".cta-btn"],
            { y: 20, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" },
            0.15
          )
          .from(
            ".cta-media",
            { scale: 0.96, opacity: 0, duration: 0.8, ease: "power3.out" },
            0.1
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".cta-heading", ".cta-copy", ".cta-btn", ".cta-media"], {
          opacity: 1,
          clearProps: "transform",
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} data-light-bg className="mrPy pb-8">
      <div
        data-dark-bg
        className="md:h-[90dvh] w-full rounded-4xl relative overflow-hidden text-dull-text bg-primary"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Text Section */}
          <div className="w-full h-full flex flex-col justify-center py-10 px-6 md:px-16 gap-6 md:gap-8">
            <div className="overflow-hidden">
              <h2
                className="cta-heading heading_2 text-white font-black font-stretch-75% uppercase mb-2 md:mb-3"
                style={{ wordSpacing: "5px" }}
              >
                Build a growth roadmap that actually takes you forward
              </h2>
            </div>

            <p className="cta-copy text-sm md:text-base max-w-md">
              Growing a business needs more than guesswork. It needs a clear
              plan that moves the numbers that actually matter. If you want
              help shaping that plan, reach out anytime. We’ll walk you
              through it at no cost and with zero pressure.
            </p>

            <GButton className="cta-btn w-fit max-w-full" variant="secondary">
              <Link className="block px-1 text-center sm:px-3" href="/contact">
                Book a free roadmap session
              </Link>
            </GButton>
          </div>

          {/* Image Section */}
          <div className="w-full flex items-center justify-center h-full py-6 px-6 md:py-8 md:px-12">
            <div className="cta-media border border-dashed p-3 rounded-4xl">
              <Image
                src="/home/client.png"
                alt="client"
                width={800}
                height={600}
                className="w-full max-w-[500px] h-auto rounded-3xl md:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsCta;
