import Link from "next/link";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Image from "next/image";
import GButton from "@/components/ui/Button";
import WhatWeDo from "@/components/home/WhatWeDo";
import WhoWeAre from "@/components/home/WhoWeAre";
import TrustedBy from "@/components/home/TrustedBy";
import Testimonials from "@/components/home/Testimonials";
import Industries from "@/components/home/Industries";
import { siteConfig, homeDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
    description: homeDescription,
    url: "/",
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
    description: homeDescription,
  },
};

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* What We Do */}
      <WhatWeDo />

      {/* Who We Are */}
      <WhoWeAre />

      {/* Trusted By */}
      <TrustedBy />

      {/* Testimonials */}
      <Testimonials />

      {/* Industries We Transform */}
      <Industries />

      {/* Clients Section */}
      <section data-light-bg className="mrPy pb-8">
        <div
          data-dark-bg
          className="md:h-[90dvh] w-full rounded-4xl relative overflow-hidden text-dull-text bg-primary"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Text Section */}
            <div className="w-full h-full flex flex-col justify-center py-10 px-6 md:px-16 gap-6 md:gap-8">
              <h2
                className="heading_2 text-white font-black font-stretch-75% uppercase mb-2 md:mb-3"
                style={{ wordSpacing: "5px" }}
              >
                Build a growth roadmap that actually takes you forward
              </h2>

              <p className="text-sm md:text-base max-w-md">
                Growing a business needs more than guesswork. It needs a clear
                plan that moves the numbers that actually matter. If you want
                help shaping that plan, reach out anytime. We’ll walk you
                through it at no cost and with zero pressure.
              </p>

              <GButton className="w-max" variant="secondary">
                <Link className="px-3" href="#">
                  Book a free roadmap session
                </Link>
              </GButton>
            </div>

            {/* Image Section */}
            <div className="w-full flex items-center justify-center h-full py-6 px-6 md:py-8 md:px-12 ">
              <div className="border border-dashed p-3 rounded-4xl">
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
    </div>
  );
}
