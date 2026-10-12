import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { siteConfig } from "@/lib/seo";
import SectionHero from "@/components/global/SectionHero";
import serviceData from "@/json/services/intro.json";

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

type servicesType = {
  title: string;
  slogan: string;
  link: {
    label: string;
    url: string;
  };
  icon: string;
};

function ServicesList({ services }: { services: servicesType[] }) {
  return (
    <section
      id="services-list"
      data-light-bg
      className="w-full rounded-t-3xl px-4 pt-12 sm:pt-16 md:pt-20"
    >
      <div className="container mx-auto">
        <div className="mb-10 text-center sm:mb-14 md:mb-16">
          <div className="flex items-center gap-4">
            <div className="grow border-t border-dashed border-gray-800" />
            <h2 className="heading_3 font-stretch-105% font-semibold tracking-tight">
              Our Services
            </h2>
            <div className="grow border-t border-dashed border-gray-800" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service, i) => (
            <Link
              key={i}
              href={service.link.url}
              className="group flex flex-col rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 md:p-8"
            >
              <div className="bg-complement/10 text-complement border-impact mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-dashed p-2 transition-transform group-hover:scale-110 sm:mb-6 sm:h-16 sm:w-16">
                <Icon
                  icon={service.icon}
                  width="28"
                  height="28"
                  className="sm:h-8 sm:w-8"
                />
              </div>

              <h3 className="mb-1.5 text-base font-semibold group-hover:text-gray-900 sm:mb-2 sm:text-lg">
                {service.title}
              </h3>

              <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                {service.slogan}
              </p>

              <span className="text-complement group-hover:text-impact mt-4 flex items-center gap-2 text-sm font-medium sm:mt-5">
                View more
                <Icon
                  icon="mdi:arrow-right"
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const Services = () => (
  <>
    <SectionHero
      eyebrow="How can we help you?"
      heading="Our Services"
      highlights={["Services"]}
      description="If your business is ready to grow, you need more than one off services. You need a digital partner who understands your goals and works with you to achieve them. We combine technology, marketing, and design to create solutions that enhance your brand, improve customer experiences, and streamline the way your business operates."
      primary={{ label: "Discuss a project", href: "/contact" }}
      secondary={{ label: "View services", href: "/services" }}
      scrollTo="#services-list"
    />

    <ServicesList services={serviceData} />
  </>
);

export default Services;
