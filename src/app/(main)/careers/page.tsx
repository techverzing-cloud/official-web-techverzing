import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Careers at ${siteConfig.name}`,
  description:
    "Join the Techverzing Technologies team. Reach out to start the conversation and work on websites, apps, AI, automation, and marketing projects.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: `Careers at ${siteConfig.name}`,
    description:
      "Join the Techverzing Technologies team. Reach out to start the conversation and work on websites, apps, AI, automation, and marketing projects.",
    url: "/careers",
    type: "website",
  },
};

const Page = () => {
  return (
    <section
      aria-label="Careers"
      className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
    >
      <h1 className="heading text-cream-white">Careers</h1>
    </section>
  );
};

export default Page;