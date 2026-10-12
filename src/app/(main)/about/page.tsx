import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import CurtainsScope from "@/components/about/CurtainsScope";
import AboutHero from "@/components/about/AboutHero";
import WhyWeExist from "@/components/about/WhyWeExist";
import HowWeWork from "@/components/home/HowWeWork";
import ServicesOverview from "@/components/about/ServicesOverview";

export const metadata: Metadata = {
  title: `About ${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
  description:
    "Learn about Techverzing Technologies - the digital marketing and IT solutions agency building websites, apps, automation, AI, and marketing for real growth.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${siteConfig.name}`,
    description:
      "Learn about Techverzing Technologies - the digital marketing and IT solutions agency building websites, apps, automation, AI, and marketing for real growth.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <AboutHero />

      {/* About the Company */}
      <CurtainsScope />

      {/* Why We Exist */}
      <WhyWeExist />

      {/* How We Work */}
      <HowWeWork />

      {/* Services Overview */}
      <ServicesOverview />
    </>
  );
}