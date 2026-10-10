import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description:
    "Read the Techverzing Technologies terms and conditions governing use of our website, products, and services.",
  alternates: {
    canonical: "/policies/terms-conditions",
  },
};

const TermsAndConditionsPage: React.FC = () => {
  return (
    <section
      aria-label="Terms and Conditions"
      className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
    >
      <h1 className="heading text-cream-white">Terms &amp; Conditions</h1>
    </section>
  );
};

export default TermsAndConditionsPage;