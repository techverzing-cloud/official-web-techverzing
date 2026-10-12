import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rawData from "@/content/services-data.json";
import introData from "@/content/services.json";
import { siteConfig } from "@/lib/seo";
import SectionHero from "@/components/global/SectionHero";
import ServiceIntro from "@/components/services/ServiceIntro";
import ServiceHighlights from "@/components/services/ServiceHighlights";
import ServiceAdvantage from "@/components/services/ServiceAdvantage";

type ServicePageData = {
  heading: {
    title: string;
    heading: string;
    text: string;
  };
  intro: {
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    description: string[];
  }[];
  highlights: {
    title: string;
    icon: string;
    description: string[];
  }[];
  advantage: {
    title: string;
    subtitle: string;
    description: string[];
    advantages: { title: string; description: string }[];
  };
};

const servicesData = rawData as Record<string, ServicePageData>;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(servicesData).map((services) => ({ services }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ services: string }>;
}): Promise<Metadata> {
  const { services } = await params;
  const data = servicesData[services];
  if (!data) return {};

  const title = `${data.heading.title} | ${siteConfig.name}`;

  return {
    title,
    description: data.heading.text,
    alternates: {
      canonical: `/services/${services}`,
    },
    openGraph: {
      title,
      description: data.heading.text,
      url: `/services/${services}`,
      type: "website",
    },
  };
}

async function ServicesPage({
  params,
}: {
  params: Promise<{ services: string }>;
}) {
  const param = await params;
  const data = servicesData[param.services];
  if (!data) notFound();

  const intro = introData.services.find(
    (s) => s.link.url === `/services/${param.services}`
  );
  if (!intro) notFound();

  return (
    <>
      <SectionHero
        eyebrow="Techverzing Services"
        heading={intro.title}
        description={intro.slogan}
        primary={{ label: "Discuss a project", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
        scrollTo="#service-intro"
      />
      <ServiceIntro
        heading={data.heading.heading}
        text={data.heading.text}
        icon={intro.icon}
        items={data.intro}
      />
      <ServiceHighlights items={data.highlights} />
      <ServiceAdvantage
        title={data.advantage.title}
        subtitle={data.advantage.subtitle}
        description={data.advantage.description}
        advantages={data.advantage.advantages}
      />
    </>
  );
}

export default ServicesPage;