import Link from "next/link";
import { Icon } from "@iconify/react";
import { Marquee } from "@/components/home/Marquee";
import globalData from "@/json/global.json";

interface ServiceCtaProps {
  title: string;
  slogan: string;
}

const ServiceCta = ({ title, slogan }: ServiceCtaProps) => {
  const cta = globalData.menu.cta;
  const email = globalData.contactInfo.items.find(
    (item) => (item.icon || "") === "mdi:email"
  )?.text;

  return (
    <section
      data-light-bg="true"
      aria-label="Get in touch"
      className="relative overflow-hidden pb-[clamp(4rem,8vw,6rem)] pt-[clamp(5rem,12vw,10rem)] text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full bg-impact/15 blur-[120px]"
      />

      <div className="container relative mx-auto mrMx">
        <span className="inline-flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-dull-text-dark">
          <span className="h-px w-8 bg-impact" />
          Contact
        </span>
        <h2 className="heading_2 mx-auto mt-6 max-w-3xl font-semibold text-black-slate">
          {cta.text}
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={cta.buttonLink}
            data-cursor-hover
            className="group inline-flex items-center gap-3 rounded-lg bg-impact px-8 py-4 text-lg font-semibold text-black transition-colors duration-200 hover:bg-black-slate hover:text-cream-white"
          >
            {cta.buttonText}
            <Icon
              icon="mdi:arrow-up-right"
              width={22}
              height={22}
              className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
          {email && (
            <a
              href={`mailto:${email}`}
              data-cursor-hover
              className="inline-flex items-center gap-3 border border-black-slate/20 px-8 py-4 text-lg text-black-slate/70 transition-colors duration-200 hover:border-impact hover:text-black-slate"
            >
              <Icon icon="mdi:email" width={22} height={22} />
              {email}
            </a>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-black-slate/10 py-3 text-black-slate/40">
        <Marquee text={[title, slogan]} speed={30} />
      </div>
    </section>
  );
};

export default ServiceCta;