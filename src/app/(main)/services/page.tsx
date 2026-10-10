import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${siteConfig.name} Services | Web, App, CRM, AI & Marketing Solutions`,
  description:
    "Explore Techverzing Technologies services — website development, mobile apps, custom CRM & automation, AI/ML solutions, UI/UX design, SEO & performance marketing, digital branding, and 360° marketing.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: `${siteConfig.name} Services | Web, App, CRM, AI & Marketing Solutions`,
    description:
      "Explore Techverzing Technologies services — website development, mobile apps, custom CRM & automation, AI/ML solutions, UI/UX design, SEO & performance marketing, digital branding, and 360° marketing.",
    url: "/services",
    type: "website",
  },
};

const Services = () => (
  <section
    aria-label="Services"
    className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
  >
    <h1 className="heading text-cream-white">Services</h1>
  </section>
);

export default Services;