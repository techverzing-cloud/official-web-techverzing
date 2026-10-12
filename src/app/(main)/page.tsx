import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
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
    </div>
  );
}
