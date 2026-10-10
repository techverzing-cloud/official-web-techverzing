"use client";

import { Icon } from "@iconify/react";
import homeData from "@/json/home.json";
import Divider from "@/components/ui/Divider";
import { Marquee } from "./Marquee";
import SectionHeading from "./SectionHeading";

const TrustedBy = () => {
  const { trustedBy } = homeData;
  const names = trustedBy.names;

  return (
    <section data-light-bg className="rounded-t-4xl mrPy">
      <div className="mrMx flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow={trustedBy.eyebrow}
          heading={trustedBy.heading}
        />

        <div className="flex w-max items-center gap-4 rounded-full border border-black/10 bg-white px-5 py-3">
          <Icon icon="mdi:star" className="text-impact" width={24} />
          <div className="flex items-baseline gap-1 font-nunito">
            <span className="text-2xl font-bold text-black-slate">
              {trustedBy.rating.value}
            </span>
            <span className="text-dull-text-dark">
              /{trustedBy.rating.outOf}
            </span>
          </div>
          <div className="border-l border-black/10 pl-4 text-xs leading-tight text-dull-text-dark">
            <div>{trustedBy.rating.label}</div>
            <div>{trustedBy.rating.reviews}</div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-6 md:mt-20 md:gap-10">
        <div className="font-nunito text-[clamp(1.75rem,5vw,4rem)] font-semibold uppercase tracking-tight text-black-slate">
          <Marquee text={names} speed={45} />
        </div>
        <Divider />
        <div className="font-nunito text-[clamp(1.25rem,3.2vw,2.5rem)] font-medium uppercase tracking-tight text-black/40">
          <Marquee text={names} speed={60} reverse />
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
