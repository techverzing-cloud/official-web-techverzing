"use client";

import about from "@/content/about.json";
import SectionHeading from "@/components/home/SectionHeading";
import MagicBento from "@/components/react-bit/MagicBento";
import type { BentoCardProps } from "@/components/react-bit/MagicBento";

const { servicesSection, services } = about;

const TINTS = ["#26292a", "#1a1c1d"];

const CARDS: BentoCardProps[] = services.flatMap((category, c) =>
  category.items.map((item) => ({
    color: TINTS[c % TINTS.length],
    label: category.category,
    title: item.title,
    description: item.description,
    icon: item.icon,
  })),
);

const ServicesOverview = () => (
  <section data-dark-bg className="relative overflow-hidden mrBg">
    <div className="relative z-10 mrMx pt-[clamp(3rem,6vw,6rem)] pb-[clamp(2.5rem,5vw,4.5rem)]">
      <SectionHeading
        dark
        eyebrow={servicesSection.eyebrow}
        heading={servicesSection.heading}
      />
      <p className="mt-5 max-w-[62ch] font-inter text-base font-normal leading-[1.7] text-dull-text text-pretty md:text-lg">
        {servicesSection.description}
      </p>

      <div className="mt-10">
        <MagicBento
          cards={CARDS}
          className="w-full max-w-none"
          textAutoHide={false}
          glowColor="255, 140, 66"
          borderColor="rgba(232, 230, 217, 0.14)"
        />
      </div>
    </div>
  </section>
);

export default ServicesOverview;