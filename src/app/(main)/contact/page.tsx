import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import SectionHero from "@/components/global/SectionHero";
import ContactSection from "./ContactSection";
import MapSection from "./mapSection";

const description =
  "Contact Techverzing Technologies for digital marketing and IT solutions. Reach us by phone, email, or the online form for websites, apps, CRM automation, SEO, and more.";

export const metadata: Metadata = {
  title: `Contact ${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${siteConfig.name}`,
    description,
    url: "/contact",
    type: "website",
  },
};

const Contact = () => (
  <>
    <SectionHero
      eyebrow="Contact us"
      heading="Let's build something together"
      highlights={["together"]}
      description="Tell us what you're building and we'll write back within one working day - clear scope, honest timelines, no jargon."
      primary={{ label: "Email us", href: `mailto:${siteConfig.email}` }}
      secondary={{ label: "Explore services", href: "/services" }}
      scrollTo="#contact"
    />
    <ContactSection />
    <MapSection />
  </>
);

export default Contact;