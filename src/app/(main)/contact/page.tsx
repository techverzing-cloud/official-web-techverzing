// import React from "react";
// import type { Metadata } from "next";
// import { siteConfig } from "@/lib/seo";

// export const metadata: Metadata = {
//   title: `Contact ${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
//   description:
//     "Contact Techverzing Technologies for digital marketing and IT solutions. Reach us by phone, email, or the online form for websites, apps, CRM automation, SEO, and more.",
//   alternates: {
//     canonical: "/contact",
//   },
//   openGraph: {
//     title: `Contact ${siteConfig.name}`,
//     description:
//       "Contact Techverzing Technologies for digital marketing and IT solutions. Reach us by phone, email, or the online form for websites, apps, CRM automation, SEO, and more.",
//     url: "/contact",
//     type: "website",
//   },
// };

// const Contact: React.FC = () => {
//   return (
//     <section
//       aria-label="Contact"
//       className="flex min-h-[70vh] items-center justify-center px-6 pt-24"
//     >
//       <h1 className="heading text-cream-white">Contact</h1>
//     </section>
//   );
// };

// export default Contact;




// import React from "react";
// import type { Metadata } from "next";
// import { siteConfig } from "@/lib/seo";
// import ContactForm from "./contectForm";


// const description =
//   "Contact Techverzing Technologies for digital marketing and IT solutions. Reach us by phone, email, or the online form for websites, apps, CRM automation, SEO, and more.";

// export const metadata: Metadata = {
//   title: `Contact ${siteConfig.name} | Digital Marketing & IT Solutions Agency`,
//   description,
//   alternates: { canonical: "/contact" },
//   openGraph: {
//     title: `Contact ${siteConfig.name}`,
//     description,
//     url: "/contact",
//     type: "website",
//   },
// };

// const contactMethods = [
//   {
//     label: "Email",
//     value: "info@techverzing.com",
//     href: "mailto:info@techverzing.com",
//     icon: (
//       <>
//         <rect x="3" y="5" width="18" height="14" rx="2" />
//         <path d="m3 7 9 6 9-6" />
//       </>
//     ),
//   },
//   {
//     label: "Phone",
//     value: "+91 7903967692",
//     href: "tel:+917903967692",
//     icon: (
//       <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.04Z" />
//     ),
//   },
// ];

// const workModes = [
//   {
//     title: "Remote collaboration",
//     text: "We work with clients anywhere, over calls and shared project boards.",
//     icon: (
//       <>
//         <rect x="3" y="4" width="18" height="13" rx="2" />
//         <path d="M8 21h8M12 17v4" />
//       </>
//     ),
//   },
//   {
//     title: "Meet in person",
//     text: "Need a face-to-face discussion? Ask and we'll arrange one.",
//     icon: (
//       <>
//         <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
//         <circle cx="12" cy="10" r="2.5" />
//       </>
//     ),
//   },
// ];

// function Icon({ children }: { children: React.ReactNode }) {
//   return (
//     <svg
//       aria-hidden="true"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="h-5 w-5"
//     >
//       {children}
//     </svg>
//   );
// }

// const Contact: React.FC = () => {
//   return (
//     <main className="min-h-screen bg-[#101c2d] text-[#f4f6fa]">
//       <section
//         aria-labelledby="contact-heading"
//         className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pb-24"
//       >
//         <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
//           {/* Left: intro, contact details, how we work */}
//           <div className="lg:pt-2">
//             <h1
//               id="contact-heading"
//               className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
//             >
//               Let&apos;s discuss your next project.
//             </h1>

//             <p className="mt-3 max-w-md text-base leading-7 text-[#c5cedb]">
//               Tell us what you need. We&apos;ll help you explore the right
//               technology solution and reply within one working day.
//             </p>

//             <ul className="mt-8 space-y-3">
//               {contactMethods.map((item) => (
//                 <li key={item.label}>
//                   <a
//                     href={item.href}
//                     className="group flex items-center gap-4 rounded-lg border border-[#27374b] bg-[#16243a] p-4 transition-colors hover:border-[#ff8b32]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8b32]"
//                   >
//                     <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff8b32]/12 text-[#ff8b32]">
//                       <Icon>{item.icon}</Icon>
//                     </span>
//                     <span className="min-w-0">
//                       <span className="block text-xs text-[#aeb9c8]">
//                         {item.label}
//                       </span>
//                       <span className="block break-words text-base font-medium text-white group-hover:text-[#ff9b4d]">
//                         {item.value}
//                       </span>
//                     </span>
//                   </a>
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-10 border-t border-[#27374b] pt-6">
//               <h2 className="text-base font-semibold text-white">
//                 Where we work &amp; how we meet
//               </h2>
//               <p className="mt-1 text-sm leading-6 text-[#aeb9c8]">
//                 Remote-first, with in-person meetings when available.
//               </p>

//               <ul className="mt-4 space-y-4">
//                 {workModes.map((mode) => (
//                   <li key={mode.title} className="flex gap-3">
//                     <span className="mt-0.5 text-[#ff8b32]">
//                       <Icon>{mode.icon}</Icon>
//                     </span>
//                     <div>
//                       <h3 className="text-sm font-semibold text-white">
//                         {mode.title}
//                       </h3>
//                       <p className="mt-0.5 text-sm leading-6 text-[#c5cedb]">
//                         {mode.text}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Right: enquiry form */}
//           <div className="rounded-2xl border border-[#27374b] bg-[#1b2a3d] p-5 shadow-xl shadow-black/20 sm:p-8">
//             <h2 className="text-lg font-semibold text-white">
//               Send us an enquiry
//             </h2>
//             <p className="mt-1 text-sm text-[#aeb9c8]">
//               Fields marked with <span className="text-[#ff8b32]">*</span> are
//               required.
//             </p>

//             <ContactForm />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Contact;




// next changes related to map

import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import ContactForm from "./contectForm";
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

const contactMethods = [
  {
    label: "Email",
    value: "info@techverzing.com",
    href: "mailto:info@techverzing.com",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    label: "Phone",
    value: "+91 7903967692",
    href: "tel:+917903967692",
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.04Z" />
    ),
  },
];

const workModes = [
  {
    title: "Remote collaboration",
    text: "We work with clients anywhere, over calls and shared project boards.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    title: "Meet in person",
    text: "Need a face-to-face discussion? Ask and we'll arrange one.",
    icon: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      {children}
    </svg>
  );
}

const Contact: React.FC = () => {
  return (
    <main className="min-h-screen bg-black text-[#f4f6fa]">
      <section
        aria-labelledby="contact-heading"
        className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pb-24"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
          {/* Left: intro, contact details, how we work */}
          <div className="lg:pt-2">
            <h1
              id="contact-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Let&apos;s discuss your next project.
            </h1>

            <p className="mt-3 max-w-md text-base leading-7 text-[#c5cedb]">
              Tell us what you need. We&apos;ll help you explore the right
              technology solution and reply within one working day.
            </p>

            <ul className="mt-8 space-y-3">
              {contactMethods.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-4 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] p-4 transition-colors hover:border-[#ff8b32]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8b32]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff8b32]/12 text-[#ff8b32]">
                      <Icon>{item.icon}</Icon>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-[#aeb9c8]">
                        {item.label}
                      </span>
                      <span className="block break-words text-base font-medium text-white group-hover:text-[#ff9b4d]">
                        {item.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-[#2a2a2a] pt-6">
              <h2 className="text-base font-semibold text-white">
                Where we work &amp; how we meet
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#aeb9c8]">
                Remote-first, with in-person meetings when available.
              </p>

              <ul className="mt-4 space-y-4">
                {workModes.map((mode) => (
                  <li key={mode.title} className="flex gap-3">
                    <span className="mt-0.5 text-[#ff8b32]">
                      <Icon>{mode.icon}</Icon>
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {mode.title}
                      </h3>
                      <p className="mt-0.5 text-sm leading-6 text-[#c5cedb]">
                        {mode.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: enquiry form */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-5 sm:p-8">
            <h2 className="text-lg font-semibold text-white">
              Send us an enquiry
            </h2>
            <p className="mt-1 text-sm text-[#aeb9c8]">
              Fields marked with <span className="text-[#ff8b32]">*</span> are
              required.
            </p>

            <ContactForm />
          </div>
        </div>
      </section>

      <MapSection />
    </main>
  );
};

export default Contact;
