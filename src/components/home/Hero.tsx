import { renderTextWithHighlights } from "@/lib/util";
import { Marquee } from "./Marquee";
import homeData from "@/json/home.json";

const marqueeText =
  "We craft high-performance websites that help startups go live faster • We build reliable and scalable mobile apps for expanding businesses • We enhance brand presence with strategic 360° marketing and SEO • We design efficient CRM and automation solutions that streamline operations • We transform ideas into real products through intuitive design and smart engineering";

const Hero = () => {
  return (
    <section
      id="hero"
      data-dark-bg
      className="w-full relative mb-8 pt-[clamp(2rem,8vw,8rem)] pb-[clamp(1rem,4vw,6rem)]"
    >
      {/* ✅ FIXED BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Blurred Image */}
        <div
          className="absolute inset-0 scale-110 blur-sm"
          style={{
            backgroundImage: "url('/global/bgimage.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Black Shade */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ✅ CONTENT ABOVE BACKGROUND */}
      <div className="container mx-auto py-20 text-cream-white relative z-10">
        <h1
          style={{
            fontStretch: "75%",
          }}
          className="heading_0 uppercase font-extrabold !tracking-[-0.02em] !leading-[1] w-full px-global max-w-6xl text-center mx-auto"
        >
          <span className="block text-[clamp(0.8rem,2.4vw,1.4rem)] !tracking-[0.12em] uppercase font-semibold text-cream-white/70 mb-4 md:mb-6">
            Techverzing Technologies
          </span>
          <span className="block">
            {renderTextWithHighlights(
              "Where technology meets business growth",
              ["technology", "growth"],
              "text-impact font-semibold whitespace-pre-line"
            )}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl px-4 text-center text-sm md:text-lg text-cream-white/70">
          {homeData.hero.subHeading}
        </p>
      </div>

      {/* ✅ MARQUEE ABOVE BACKGROUND */}
      <div className="absolute bottom-0 left-0 right-0 text-cream-white z-10">
        <Marquee text={marqueeText} />
      </div>
    </section>
  );
};

export default Hero;
