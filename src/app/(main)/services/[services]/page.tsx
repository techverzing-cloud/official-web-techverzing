import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rawData from "@/json/services/data.json";
import introData from "@/json/services/intro.json";
import { siteConfig } from "@/lib/seo";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceIntro from "@/components/services/ServiceIntro";
import ServiceHighlights from "@/components/services/ServiceHighlights";
import ServiceAdvantage from "@/components/services/ServiceAdvantage";
import ServiceCta from "@/components/services/ServiceCta";

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

  const intro = introData.find(
    (s) => s.link.url === `/services/${param.services}`
  );
  if (!intro) notFound();

  return (
    <>
      <ServiceHero
        title={intro.title}
        slogan={intro.slogan}
        icon={intro.icon}
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
      <ServiceCta title={intro.title} slogan={intro.slogan} />
    </>
  );
}

export default ServicesPage;