import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import globalData from "@/json/global.json";
import { siteConfig } from "@/lib/seo";
import SectionHeading from "@/components/home/SectionHeading";
import ContactForm from "./ContactForm";

const { contactInfo } = globalData;

const phone = contactInfo.items[0].text;
const mapsHref =
  "https://www.google.com/maps/search/?api=1&query=New+Delhi%2C+Delhi%2C+India";

const labelCls =
  "block font-spaceMono text-[11px] uppercase tracking-[0.18em] text-black-slate/60";

const details = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: "mdi:email-outline",
    external: false,
  },
  {
    label: "Phone",
    value: phone,
    href: `tel:${siteConfig.phone}`,
    icon: "mdi:phone-outline",
    external: false,
  },
  {
    label: "Office",
    value: "Janakpuri, New Delhi",
    href: mapsHref,
    icon: "mdi:map-marker-outline",
    external: true,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      data-light-bg
      aria-label="Contact details and enquiry form"
      className="rounded-t-4xl mrPy"
    >
      <div className="mrMx">
        <SectionHeading
          eyebrow="Get in touch"
          heading={["Tell us about", "your project"]}
        />
        <p className="mt-5 max-w-[58ch] text-pretty font-inter text-base font-normal leading-[1.7] text-dull-text-dark md:text-lg">
          We&rsquo;re a small office, so every note that lands here reaches a
          person — not a queue. Tell us what you&rsquo;re building and
          we&rsquo;ll write back within one working day.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <dl className="border-t border-black-slate/10">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-start gap-4 border-b border-black-slate/10 py-4"
                >
                  <Icon
                    icon={detail.icon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-impact"
                  />
                  <div className="min-w-0">
                    <dt className={labelCls}>{detail.label}</dt>
                    <dd className="mt-1">
                      <Link
                        href={detail.href}
                        target={detail.external ? "_blank" : undefined}
                        rel={detail.external ? "noopener noreferrer" : undefined}
                        data-cursor-hover
                        className="break-words font-inter text-base font-medium text-black-slate underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-impact hover:decoration-impact focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        {detail.value}
                      </Link>
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-4">
              <span className={labelCls}>Elsewhere</span>
              <ul className="mt-3 flex flex-wrap gap-2">
                {contactInfo.socialLinks.map((social) => (
                  <li key={social.name}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      data-cursor-hover
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-black-slate/10 bg-white transition-colors duration-200 hover:border-impact focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-95"
                    >
                      <Image
                        src={social.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-black-slate/10 pt-6">
              <h2 className="font-nunito text-lg font-semibold text-black-slate">
                What happens next
              </h2>
              <p className="mt-2 max-w-[52ch] text-pretty font-inter text-sm leading-relaxed text-dull-text-dark md:text-base">
                One of us reads your note. Within a working day you&rsquo;ll
                hear back with a few sharp questions and a clear direction — and
                if it&rsquo;s a fit, the scope, timelines, and honest next
                steps.
              </p>
            </div>
          </div>

          <div
            id="contact-form"
            className="rounded-3xl border border-black-slate/10 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(13,13,14,0.45)] sm:p-8 lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="font-nunito text-xl font-semibold text-black-slate">
              Leave your note
            </h2>
            <p className="mt-1 font-inter text-sm text-dull-text-dark">
              Fields marked <span className="text-impact">*</span> are required.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
