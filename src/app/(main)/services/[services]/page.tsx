import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rawData from "@/json/services/data.json";
import { siteConfig } from "@/lib/seo";

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

  return (
    <section
      aria-label={data.heading.title}
      className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
    >
      <h1 className="heading text-cream-white">{data.heading.title}</h1>
    </section>
  );
}

export default ServicesPage;