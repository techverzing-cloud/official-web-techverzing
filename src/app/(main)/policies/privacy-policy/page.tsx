import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Read the Techverzing Technologies privacy policy to understand how we collect, use, and protect your information.",
  alternates: {
    canonical: "/policies/privacy-policy",
  },
};

const PrivacyPolicyPage: React.FC = () => {
  return (
    <section
      aria-label="Privacy Policy"
      className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
    >
      <h1 className="heading text-cream-white">Privacy Policy</h1>
    </section>
  );
};

export default PrivacyPolicyPage;