import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Contact ${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
  description:
    "Contact Techverzing Technologies for digital marketing and IT solutions. Reach us by phone, email, or the online form for websites, apps, CRM automation, SEO, and more.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact ${siteConfig.name}`,
    description:
      "Contact Techverzing Technologies for digital marketing and IT solutions. Reach us by phone, email, or the online form for websites, apps, CRM automation, SEO, and more.",
    url: "/contact",
    type: "website",
  },
};

const Contact: React.FC = () => {
  return (
    <section
      aria-label="Contact"
      className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
    >
      <h1 className="heading text-cream-white">Contact</h1>
    </section>
  );
};

export default Contact;