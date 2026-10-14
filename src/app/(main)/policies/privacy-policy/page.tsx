import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Read the Techverzing Technologies Privacy Policy to understand how information submitted through our website contact form is collected, used, protected, and managed.",
  alternates: {
    canonical: "/policies/privacy-policy",
  },
  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      "Read the Techverzing Technologies Privacy Policy to understand how information submitted through our website contact form is collected, used, protected, and managed.",
    url: "/policies/privacy-policy",
    type: "website",
  },
};

const bodyText = "font-inter text-base leading-relaxed text-dull-text sm:text-lg";
const linkClass =
  "rounded-sm text-impact underline decoration-impact/40 underline-offset-2 transition-colors duration-200 hover:decoration-impact focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-primary";
const listClass = `${bodyText} mt-4 list-disc space-y-2 pl-6`;
const h2Class = "text-xl font-bold text-cream-white sm:text-2xl";
const strongClass = "font-semibold text-cream-white";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <section
      aria-label="Privacy Policy"
      className="pb-24 pt-32 md:pb-32 md:pt-40"
    >
      <article className="mx-auto max-w-[70ch]">
        <header className="border-b border-white/10 pb-8">
          <p className="font-spaceMono text-[11px] uppercase tracking-[0.3em] text-impact">
            Legal
          </p>
          <h1 className="heading mt-4 text-cream-white">Privacy Policy</h1>
          <p className="mt-4 font-spaceMono text-xs uppercase tracking-[0.2em] text-dull-text">
            Last Updated: 14 October 2026
          </p>
        </header>

        <section className="mt-10">
          <h2 className={h2Class}>1. Introduction</h2>
          <p className={`${bodyText} mt-4`}>
            Techverzing Technologies (“Techverzing”, “we”, “our”, or “us”)
            respects your privacy and is committed to protecting your personal
            data.
          </p>
          <p className={`${bodyText} mt-4`}>
            This Privacy Policy explains how we collect, use, store, and process
            information submitted through the contact form on our website,{" "}
            <a
              className={linkClass}
              href="https://www.techverzing.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.techverzing.com/
            </a>
            .
          </p>
          <p className={`${bodyText} mt-4`}>
            We aim to handle personal data in accordance with applicable Indian
            laws, including the Information Technology Act, 2000, applicable
            rules, the Digital Personal Data Protection Act, 2023 (DPDP Act), and
            the Digital Personal Data Protection Rules, 2025, as and when their
            relevant provisions become applicable.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>2. Information We Collect</h2>
          <p className={`${bodyText} mt-4`}>
            When you submit our contact form titled “Leave your note”, we may
            collect the following information:
          </p>
          <ul className={listClass}>
            <li>
              <strong className={strongClass}>Full Name (Required):</strong> To
              identify you and respond to your enquiry.
            </li>
            <li>
              <strong className={strongClass}>Email Address (Required):</strong>{" "}
              To communicate with you regarding your enquiry, requirements, or
              requested services.
            </li>
            <li>
              <strong className={strongClass}>Company Name (Optional):</strong>{" "}
              To understand your business or organisational requirements.
            </li>
            <li>
              <strong className={strongClass}>Phone Number (Optional):</strong>{" "}
              To contact you regarding your enquiry when appropriate.
            </li>
            <li>
              <strong className={strongClass}>Project Details (Required):</strong>{" "}
              To understand your project, business needs, technical requirements,
              and the assistance you are seeking.
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            We collect this information when you voluntarily submit the contact
            form. Please ensure that the information you provide is accurate and
            avoid including passwords, financial account credentials, or other
            unnecessary confidential information in your message.
          </p>
          <p className={`${bodyText} mt-4`}>
            We do not intentionally request IP addresses, device information, or
            website analytics data through this contact form for our own
            enquiry-management purposes. However, technical logs may be
            maintained independently by hosting or infrastructure providers,
            depending on their configurations and practices.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>3. How We Use Your Information</h2>
          <p className={`${bodyText} mt-4`}>
            We use the information you submit for the following purposes:
          </p>
          <ul className={listClass}>
            <li>To receive and respond to your enquiries.</li>
            <li>
              To understand your project requirements and business objectives.
            </li>
            <li>
              To discuss relevant services, including website development, mobile
              applications, custom software, AI automation, and other technology
              solutions.
            </li>
            <li>
              To contact you by email or phone, where appropriate, regarding your
              enquiry.
            </li>
            <li>
              To prepare proposals, estimates, consultations, or recommendations
              requested by you.
            </li>
            <li>
              To maintain records of enquiries and related business
              communications.
            </li>
            <li>To protect our website and manage security issues.</li>
            <li>
              To comply with applicable legal obligations or respond to lawful
              requests from competent authorities.
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            We do not sell your personal data. We do not use the information
            submitted through the contact form for unrelated promotional
            communications without the consent or other lawful basis required
            under applicable law.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>4. Consent and Lawful Processing</h2>
          <p className={`${bodyText} mt-4`}>
            We process personal data on a lawful basis permitted by applicable
            law.
          </p>
          <p className={`${bodyText} mt-4`}>
            By submitting the contact form, you voluntarily provide your
            information so that we can receive and respond to your enquiry. Where
            consent is required under applicable law, we will provide the
            necessary information about the purpose of processing and obtain
            consent through an appropriate affirmative action.
          </p>
          <p className={`${bodyText} mt-4`}>
            Where processing is based on consent, you may withdraw your consent
            by contacting us at{" "}
            <a className={linkClass} href="mailto:contact@techverzing.com">
              contact@techverzing.com
            </a>
            . Withdrawal will not affect processing lawfully completed before
            withdrawal. We may retain information where another lawful basis or
            legal obligation permits or requires us to do so.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>5. Sharing of Personal Data</h2>
          <p className={`${bodyText} mt-4`}>
            We do not sell or rent your personal data.
          </p>
          <p className={`${bodyText} mt-4`}>
            We may share your information only where reasonably necessary for the
            purposes described in this policy, including with:
          </p>
          <ul className={listClass}>
            <li>
              <strong className={strongClass}>Authorised personnel:</strong> Team
              members who need the information to understand and respond to your
              enquiry.
            </li>
            <li>
              <strong className={strongClass}>
                Website hosting and infrastructure providers:
              </strong>{" "}
              Providers that help operate and maintain our website and contact
              form.
            </li>
            <li>
              <strong className={strongClass}>
                Email and communication providers:
              </strong>{" "}
              Services used to receive, deliver, or respond to your enquiry.
            </li>
            <li>
              <strong className={strongClass}>Technical service providers:</strong>{" "}
              Other providers involved in maintaining the security and operation
              of our website.
            </li>
            <li>
              <strong className={strongClass}>
                Legal and regulatory authorities:
              </strong>{" "}
              Where disclosure is required or permitted under applicable law.
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            Where third-party providers process personal data on our behalf, we
            will take appropriate steps to address relevant data protection and
            security obligations.
          </p>
          <p className={`${bodyText} mt-4`}>
            We do not authorise these providers to use your information for
            unrelated purposes beyond their permitted role, except where
            otherwise permitted by law.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>6. Data Security and Retention</h2>
          <p className={`${bodyText} mt-4`}>
            We take reasonable technical and organisational measures to protect
            the information submitted through our contact form against
            unauthorised access, disclosure, loss, or misuse.
          </p>
          <p className={`${bodyText} mt-4`}>
            We retain enquiry information only for as long as reasonably
            necessary to respond to your enquiry, manage related business
            communications, maintain relevant business records, or comply with
            applicable legal obligations.
          </p>
          <p className={`${bodyText} mt-4`}>
            When personal data is no longer required, we take appropriate steps to
            erase it, subject to lawful retention requirements.
          </p>
          <p className={`${bodyText} mt-4`}>
            Please note that information transmitted over the internet cannot be
            guaranteed to be completely secure. We nevertheless aim to protect
            the personal data entrusted to us using appropriate safeguards.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>7. Your Privacy Rights</h2>
          <p className={`${bodyText} mt-4`}>
            Subject to applicable law and the commencement of the relevant legal
            provisions, you may have the right to:
          </p>
          <ul className={listClass}>
            <li>
              <strong className={strongClass}>Access:</strong> Request
              information about your personal data and its processing.
            </li>
            <li>
              <strong className={strongClass}>Correction:</strong> Request
              correction or updating of inaccurate personal data.
            </li>
            <li>
              <strong className={strongClass}>Erasure:</strong> Request deletion
              of personal data, subject to applicable legal retention
              requirements.
            </li>
            <li>
              <strong className={strongClass}>Consent withdrawal:</strong>{" "}
              Withdraw consent where processing is based on consent.
            </li>
            <li>
              <strong className={strongClass}>Grievance redressal:</strong> Raise
              concerns or complaints about how your personal data is handled.
            </li>
            <li>
              <strong className={strongClass}>Nomination:</strong> Nominate
              another individual to exercise your rights where provided by
              applicable law.
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            To exercise an applicable right, email us at{" "}
            <a className={linkClass} href="mailto:contact@techverzing.com">
              contact@techverzing.com
            </a>{" "}
            with the subject line “Privacy Request”. We may request reasonable
            information to verify your identity before processing your request.
          </p>
          <p className={`${bodyText} mt-4`}>
            We will handle requests in accordance with the applicable legal
            requirements and timelines.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>
            8. Third-Party Services and International Transfers
          </h2>
          <p className={`${bodyText} mt-4`}>
            Our website relies on third-party infrastructure and communication
            services where necessary to operate the contact form and respond to
            enquiries. These providers may process information on our behalf
            according to their roles and applicable contractual and legal
            requirements.
          </p>
          <p className={`${bodyText} mt-4`}>
            Depending on the providers used, personal data may be processed or
            stored outside India. Any such processing or transfer will be subject
            to applicable Indian legal requirements, including relevant
            restrictions or conditions notified by the Government of India.
          </p>
          <p className={`${bodyText} mt-4`}>
            Our website may also contain links to external websites or social
            media platforms. Their privacy practices are governed by their
            respective policies.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>9. Changes to This Privacy Policy</h2>
          <p className={`${bodyText} mt-4`}>
            We may update this Privacy Policy to reflect changes in our contact
            form, business practices, service providers, or applicable legal
            requirements.
          </p>
          <p className={`${bodyText} mt-4`}>
            Any revised version will be published on this page with an updated
            “Last Updated” date. We encourage visitors to review this page
            periodically.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>10. Contact and Grievances</h2>
          <p className={`${bodyText} mt-4`}>
            For questions about this Privacy Policy, requests concerning your
            personal data, consent withdrawal, or privacy-related complaints,
            contact us:
          </p>
          <ul className={`${bodyText} mt-4 list-none space-y-2`}>
            <li>
              <strong className={strongClass}>Company:</strong> Techverzing
              Technologies
            </li>
            <li>
              <strong className={strongClass}>Email:</strong>{" "}
              <a className={linkClass} href="mailto:contact@techverzing.com">
                contact@techverzing.com
              </a>
            </li>
            <li>
              <strong className={strongClass}>Website:</strong>{" "}
              <a
                className={linkClass}
                href="https://www.techverzing.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.techverzing.com/
              </a>
            </li>
            <li>
              <strong className={strongClass}>Subject line:</strong> Privacy
              Request or Data Protection Grievance
            </li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            We will address privacy-related grievances within the timelines
            prescribed by applicable law.
          </p>
        </section>
      </article>
    </section>
  );
};

export default PrivacyPolicyPage;
