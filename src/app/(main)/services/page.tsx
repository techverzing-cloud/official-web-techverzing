import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { siteConfig } from "@/lib/seo";
import GButton from "@/components/ui/Button";
import Cta from "@/components/global/Cta";
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
    <section
      aria-label="Services"
      id="hero"
      data-dark-bg
      className="mrBg relative overflow-hidden py-8"
    >
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:px-8 sm:pt-32 sm:pb-28">
        <div className="mb-12 text-cream-white">
          <h1 className="heading_0 w-max font-semibold tracking-tight capitalize">
            Our Services
            <div className="ml-auto w-max text-right text-xl tracking-normal text-cream-white/60">
              How can we help you?
            </div>
          </h1>
        </div>

        <div>
          <p className="text-dull-text mt-4">
            If your business is ready to grow, you need more than one off
            services. You need a digital partner who understands your goals and
            works with you to achieve them. We combine technology, marketing,
            and design to create solutions that enhance your brand, improve
            customer experiences, and streamline the way your business operates.
            From the first idea to ongoing support, we help you build the
            digital foundation that drives long term success.
          </p>
        </div>

        <div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GButton className="border-dull-text border">
              <Link href="/contact" className="center">
                Discuss a project
              </Link>
            </GButton>

            <GButton
              variant="secondary"
              className="text-dull-text border-dull-text"
            >
              <Link href="/services" className="center">
                View services
              </Link>
            </GButton>
          </div>
        </div>
      </div>
    </section>

    <ServicesList services={serviceData} />
    <Cta />
  </>
);

export default Services;
