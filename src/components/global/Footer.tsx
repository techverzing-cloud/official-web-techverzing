import Image from "next/image";
import Link from "next/link";
import React from "react";
import global from "@/json/global.json";
import { Icon } from "@iconify/react/dist/iconify.js";
const { footer, contactInfo } = global;
export default function Footer() {
  const { socialLinks } = contactInfo;

  const contactItems = contactInfo.items.map((item) => {
    let type: "phone" | "email" | "address" = "phone";

    if (item.text.includes("@")) type = "email";
    else if (item.text.toLowerCase().includes("address")) type = "address";

    return { type, value: item.text, icon: item.icon };
  });

  return (
    <footer className="bg-primary" data-dark-bg>
      <div className="max-w-screen-2xl px-4 pt-16 pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-24">
        {/* TOP SECTION */}
        <div className="flex flex-col gap-10 lg:flex-row px-10">
          {/* LOGO + DESCRIPTION + SOCIAL */}
          <div className="max-w-sm mx-auto lg:mx-0">
            <div className="flex justify-center sm:justify-center items-end gap-2 px-2 text-cream-white">
              <Image
                src={footer.logo.src}
                width={footer.logo.width}
                height={footer.logo.height}
                alt={footer.logo.alt}
                className="h-12 w-12 object-contain"
              />
              <p className="heading_5 tracking-wide font-stretch-110% font-semibold mb-0.5">
                Techverzing Technologies
              </p>
            </div>

            <p className="max-w-md mx-auto mt-6 leading-relaxed text-center text-sm text-gray-400 sm:text-left">
              {footer.description}
            </p>
            <p className="max-w-md mx-auto mt-4 leading-relaxed text-center text-sm text-gray-400 sm:text-left">
              Techverzing Technologies is a digital marketing and IT solutions
              agency from New Delhi, India providing web development, mobile
              apps, CRM automation, AI/ML, SEO, and 360° marketing.
            </p>

            {/* Social Links */}
            <ul className="flex justify-between sm:justify-center gap-8 mt-6">
              {socialLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    data-cursor-hover
                    className="text-primary transition hover:opacity-80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={link.icon}
                      alt={link.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NAV SECTIONS + CONTACT */}
          <div className=" sm:ml-20 flex flex-wrap gap-8 grow justify-center sm:justify-between text-center sm:text-left">
            {/* NAV SECTIONS */}
            {footer.navSections.map((section, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center sm:items-start"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-cream-white/90">
                  {section.label}
                </p>

                <nav className="mt-5">
                  <ul className="space-y-3 text-sm">
                    {section.categories.map((item, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={item.link}
                          data-cursor-hover
                          className="text-gray-300/70 transition hover:text-cream-white"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}

            {/* CONTACT COLUMN */}
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-sm font-semibold uppercase tracking-wide text-white">
                {contactInfo.title}
              </p>

              <ul className="mt-5 space-y-3 text-sm">
                {contactItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 justify-center sm:justify-start text-gray-300/80"
                  >
                    {item.type === "email" ? (
                      
                      <Link
                        href={`mailto:${item.value}`}
                        data-cursor-hover
                        className="hover:text-cream-white transition"
                      >
                        {item.value}
                      </Link>
                        
                  ) : item.type === "phone" ? (
                      <Link
                        href={`tel:${item.value}`}
                        data-cursor-hover
                        className="hover:text-cream-white transition"
                      >
                        {item.value}
                      </Link>
                    ) : item.type === "address" ? (
                      <address className="not-italic">{item.value}</address>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM / LEGAL */}
        <div className="pt-6 mt-12 border-t border-gray-800 text-xs">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-center md:text-left">
            <p className="text-gray-400 md:text-center tracking-wide">
              Made by{" "}
              <span className="text-[#ffc857] underline underline-offset-2">
                Techverzing Technologies
              </span>
            </p>
            <p className="text-gray-400 center gap-2 flex flex-col md:flex-row grow">
              
              <span className="center gap-1">
                <Icon icon={"ic:outline-copyright"} /> 2025 Techverzing Technologies |
              </span>
              <span className="">All rights reserved.</span>
            </p>

            <p className="text-gray-400 md:text-right space-x-1">
              <Link
                className="inline-block text-teal-400 underline underline-offset-2 transition hover:text-teal-300"
                href={footer.legal.terms.href}
              >
                {footer.legal.terms.label}
              </Link>
              <span>·</span>
              <Link
                className="inline-block text-teal-400 underline underline-offset-2 transition hover:text-teal-300"
                href={footer.legal.privacy.href}
              >
                {footer.legal.privacy.label}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
