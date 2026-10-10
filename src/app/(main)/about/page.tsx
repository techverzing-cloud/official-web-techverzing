import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `About ${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
  description:
    "Learn about Techverzing Technologies — the digital marketing and IT solutions agency building websites, apps, automation, AI, and marketing for real growth.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${siteConfig.name}`,
    description:
      "Learn about Techverzing Technologies — the digital marketing and IT solutions agency building websites, apps, automation, AI, and marketing for real growth.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <section
      aria-label="About"
      className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
    >
      <h1 className="heading text-cream-white">About</h1>
    </section>
  );
}