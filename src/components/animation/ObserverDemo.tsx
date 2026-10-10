import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(Observer, SplitText);

type Section = {
  title: string;
  className: string;
  image: string;
};

const sections: Section[] = [
  {
    title: "Scroll down",
    className: "from-slate-900 to-slate-700",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2400&q=90",
  },
  {
    title: "Animated with GSAP",
    className: "from-emerald-950 to-emerald-800",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=90",
  },
  {
    title: "GreenSock",
    className: "from-slate-950 to-indigo-950",
    image:
      "https://images.unsplash.com/photo-150053085107?auto=format&fit=crop&w=2400&q=90",
  },
  {
    title: "Animation platform",
    className: "from-stone-950 to-amber-950",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2400&q=90",
  },
  {
    title: "Keep scrolling",
    className: "from-cyan-950 to-blue-950",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90",
  },
];

export default function App() {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let observer: Observer | undefined;
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".animated-section", root);
      const backgrounds = gsap.utils.toArray<HTMLElement>(".section-bg", root);
      const headings = gsap.utils.toArray<HTMLElement>(
        ".section-heading",
        root,
      );
      const outer = gsap.utils.toArray<HTMLElement>(".section-outer", root);
      const inner = gsap.utils.toArray<HTMLElement>(".section-inner", root);

      let currentIndex = -1;
      let animating = false;

      headings.forEach((heading) => {
        splits.push(
          new SplitText(heading, {
            type: "chars,words,lines",
            linesClass: "clip-text",
          }),
        );
      });

      gsap.set(panels, { autoAlpha: 0, zIndex: 0 });
      gsap.set(outer, { yPercent: 100 });
      gsap.set(inner, { yPercent: -100 });

      function gotoSection(index: number, direction: number) {
        if (animating || panels.length === 0) return;

        index = gsap.utils.wrap(0, panels.length, index);
        animating = true;

        const factor = direction === -1 ? -1 : 1;

        const timeline = gsap.timeline({
          defaults: {
            duration: 1.25,
            ease: "power1.inOut",
          },
          onComplete: () => {
            animating = false;
          },
        });

        if (currentIndex >= 0) {
          gsap.set(panels[currentIndex], { zIndex: 0 });

          timeline
            .to(backgrounds[currentIndex], { yPercent: -15 * factor }, 0)
            .set(panels[currentIndex], { autoAlpha: 0 });
        }

        gsap.set(panels[index], {
          autoAlpha: 1,
          zIndex: 1,
        });

        timeline
          .fromTo(
            [outer[index], inner[index]],
            {
              yPercent: (i) => (i === 0 ? 100 * factor : -100 * factor),
            },
            { yPercent: 0 },
            0,
          )
          .fromTo(
            backgrounds[index],
            { yPercent: 15 * factor },
            { yPercent: 0 },
            0,
          )
          .fromTo(
            splits[index].chars,
            {
              autoAlpha: 0,
              yPercent: 150 * factor,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 1,
              ease: "power2.out",
              stagger: {
                each: 0.025,
                from: "random",
              },
            },
            0.2,
          );

        currentIndex = index;
      }

      observer = Observer.create({
        target: root,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        onDown: () => {
          if (!animating) gotoSection(currentIndex - 1, -1);
        },
        onUp: () => {
          if (!animating) gotoSection(currentIndex + 1, 1);
        },
      });

      gotoSection(0, 1);
    }, root);

    return () => {
      observer?.kill();
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <>
      <style>{`
        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          margin: 0;
        }

        body {
          overflow: hidden;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .clip-text {
          overflow: hidden;
        }

        .section-heading {
          will-change: transform;
        }
      `}</style>

      <main
        ref={containerRef}
        className="relative h-dvh w-full overflow-hidden bg-black text-white"
      >
        <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-5 sm:px-10 lg:px-[5%]">
          <a
            href="#home"
            className="text-xs font-semibold uppercase tracking-[0.25em] sm:text-sm sm:tracking-[0.4em]"
          >
            Animated Sections
          </a>

          <a
            href="https://codepen.io/BrianCross/pen/PoWapLP"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white sm:text-xs sm:tracking-[0.3em]"
          >
            Original Inspiration ↗
          </a>
        </header>

        {sections.map((section, index) => (
          <section
            key={section.title}
            className="animated-section invisible fixed inset-0 h-full w-full"
            aria-label={section.title}
          >
            <div className="section-outer relative h-full w-full overflow-hidden">
              <div className="section-inner relative h-full w-full overflow-hidden">
                <div
                  className={`section-bg absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br ${section.className}`}
                  style={{
                    backgroundImage: `
                      linear-gradient(
                        180deg,
                        rgba(0,0,0,0.55) 0%,
                        rgba(0,0,0,0.15) 50%,
                        rgba(0,0,0,0.4) 100%
                      ),
                      url("${section.image}")
                    `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    willChange: "transform",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-black/10" />

                  <div className="relative z-10 flex w-full flex-col items-center px-5 text-center">
                    <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.5em] text-white/70 sm:text-xs">
                      {`0${index + 1} / 0${sections.length}`}
                    </p>

                    <h2 className="section-heading max-w-[1200px] text-4xl font-semibold leading-[1.12] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem]">
                      {section.title}
                    </h2>

                    <div className="mt-8 h-px w-16 bg-white/70" />

                    <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/75 sm:text-xs">
                      Scroll to explore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="pointer-events-none fixed bottom-7 left-1/2 z-50 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-[9px] uppercase tracking-[0.35em]">
              Discover
            </span>
            <div className="h-8 w-px overflow-hidden bg-white/20">
              <div className="h-3 w-px animate-bounce bg-white" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
