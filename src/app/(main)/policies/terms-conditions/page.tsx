import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description:
    "Read the Techverzing Technologies terms and conditions governing use of our website, products, and services.",
  alternates: {
    canonical: "/policies/terms-conditions",
  },
  openGraph: {
    title: `Terms & Conditions | ${siteConfig.name}`,
    description:
      "Read the Techverzing Technologies terms and conditions governing use of our website, products, and services.",
    url: "/policies/terms-conditions",
    type: "website",
  },
};

const bodyText = "font-inter text-base leading-relaxed text-dull-text sm:text-lg";
const linkClass =
  "rounded-sm text-impact underline decoration-impact/40 underline-offset-2 transition-colors duration-200 hover:decoration-impact focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-primary";
const listClass = `${bodyText} mt-4 list-disc space-y-2 pl-6`;
const h2Class = "text-xl font-bold text-cream-white sm:text-2xl";
const h3Class = "mt-6 text-base font-semibold text-cream-white sm:text-lg";

const TermsAndConditionsPage: React.FC = () => {
  return (
    <section
      aria-label="Terms and Conditions"
      className="pb-24 pt-32 md:pb-32 md:pt-40"
    >
      <article className="mx-auto max-w-[70ch]">
        <header className="border-b border-white/10 pb-8">
          <p className="font-spaceMono text-[11px] uppercase tracking-[0.3em] text-impact">
            Legal
          </p>
          <h1 className="heading mt-4 text-cream-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 font-spaceMono text-xs uppercase tracking-[0.2em] text-dull-text">
            Last Updated: 14-10-2026
          </p>
        </header>

        <p className={`${bodyText} mt-10`}>
          Welcome to Techverzing Technologies. By accessing or using our
          website, products, or services, you agree to these Terms and
          Conditions. Please read them carefully.
        </p>

        <section className="mt-10">
          <h2 className={h2Class}>1. Acceptance of Terms</h2>
          <p className={`${bodyText} mt-4`}>
            By visiting our website or engaging with our services, you confirm
            that you have read, understood, and agreed to follow these Terms and
            Conditions. If you do not agree, please do not use our website or
            services.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>2. About Techverzing Technologies</h2>
          <p className={`${bodyText} mt-4`}>
            Techverzing Technologies provides digital services including web
            development, mobile app development, CRM and automation systems, AI
            integrations, marketing services, branding, and related digital
            solutions.
          </p>
          <p className={`${bodyText} mt-4`}>
            These Terms apply to all users, clients, visitors, and any
            individuals accessing our services.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>3. Use of Our Website</h2>
          <p className={`${bodyText} mt-4`}>
            You agree to use our website only for lawful purposes and in a way
            that does not harm, restrict, or negatively impact Techverzing
            Technologies or other users.
          </p>
          <p className={`${bodyText} mt-4`}>You must not:</p>
          <ul className={listClass}>
            <li>Attempt to breach or bypass our website security</li>
            <li>Use our content without permission</li>
            <li>Engage in any harmful, fraudulent, or abusive activity</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>4. Service Engagement and Agreements</h2>
          <p className={`${bodyText} mt-4`}>
            All projects, services, or deliverables are governed by a separate
            written agreement, quotation, proposal, or contract between
            Techverzing Technologies and the client.
          </p>
          <p className={`${bodyText} mt-4`}>This may include details such as:</p>
          <ul className={listClass}>
            <li>Work scope</li>
            <li>Timelines</li>
            <li>Payment structure</li>
            <li>Revisions</li>
            <li>Deliverables</li>
            <li>Cancellation policies</li>
            <li>Support plans</li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            No project is considered active until both parties confirm the
            agreement.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>5. Payments and Billing</h2>
          <ul className={listClass}>
            <li>
              Payments must be made according to the terms provided in the
              invoice or agreement.
            </li>
            <li>
              Delayed payments may result in paused work or delayed delivery.
            </li>
            <li>
              All fees are non-refundable unless stated otherwise in a written
              agreement.
            </li>
            <li>
              Taxes or third-party fees (hosting, domains, APIs, advertising
              budgets) are not included unless explicitly stated.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>6. Intellectual Property</h2>
          <h3 className={h3Class}>Techverzing Technologies Ownership</h3>
          <p className={`${bodyText} mt-3`}>
            All original content on our website—including text, images, designs,
            branding, and code—is owned by Techverzing Technologies.
          </p>
          <h3 className={h3Class}>Client Ownership</h3>
          <p className={`${bodyText} mt-3`}>
            After full payment, the client may receive ownership or usage rights
            to the final deliverables as agreed in the project contract.
          </p>
          <p className={`${bodyText} mt-4`}>
            Concepts, drafts, internal tools, and rejected ideas remain the
            property of Techverzing.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>7. Confidentiality</h2>
          <p className={`${bodyText} mt-4`}>
            Both parties agree to keep project information, data, internal
            documents, and communication confidential. No information will be
            shared with third parties without consent, unless required by law.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>8. Third-Party Services</h2>
          <p className={`${bodyText} mt-4`}>
            Some projects may involve third-party tools, APIs, or services (e.g.,
            hosting, cloud providers, analytics tools). Techverzing is not
            responsible for:
          </p>
          <ul className={listClass}>
            <li>Issues caused by third-party platforms</li>
            <li>Pricing changes</li>
            <li>Downtime</li>
            <li>Policy updates from these providers</li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            Clients must follow the terms and pricing of those platforms
            separately.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>9. Limitation of Liability</h2>
          <ul className={listClass}>
            <li>Loss of revenue, data, or profits</li>
            <li>Business interruption</li>
            <li>Issues caused by external systems or hosting providers</li>
            <li>Damages resulting from misuse or unauthorized access</li>
          </ul>
          <p className={`${bodyText} mt-4`}>
            Our total liability is limited to the amount paid by the client for
            the specific service involved.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>10. Revisions and Changes</h2>
          <p className={`${bodyText} mt-4`}>
            Project revisions are governed by the specific agreement with the
            client. Requests outside the agreed scope may be billed separately.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>11. Termination</h2>
          <p className={`${bodyText} mt-4`}>
            Either party may terminate a project if the other party breaches the
            agreement.
          </p>
          <p className={`${bodyText} mt-4`}>
            Clients remain responsible for all completed work and any
            outstanding payments up to the date of termination.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>12. Privacy</h2>
          <p className={`${bodyText} mt-4`}>
            All personal data collected through our website or services is
            handled according to our{" "}
            <Link className={linkClass} href="/policies/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
          <p className={`${bodyText} mt-4`}>
            We do not sell, rent, or misuse any client information.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>13. Updates to These Terms</h2>
          <p className={`${bodyText} mt-4`}>
            We may update these Terms and Conditions as needed. Continuing to use
            our website or services after updates means you accept the revised
            terms.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>14. Governing Law</h2>
          <p className={`${bodyText} mt-4`}>
            These Terms are governed by the applicable laws of India. Any
            disputes will be handled in the appropriate courts or legal
            jurisdictions in India.
          </p>
        </section>

        <section className="mt-10">
          <h2 className={h2Class}>15. Contact Us</h2>
          <ul className={`${bodyText} mt-4 list-none space-y-2`}>
            <li>
              <strong className="font-semibold text-cream-white">Email:</strong>{" "}
              <a className={linkClass} href="mailto:contact@techverzing.com">
                contact@techverzing.com
              </a>
            </li>
            <li>
              <strong className="font-semibold text-cream-white">
                Company:
              </strong>{" "}
              Techverzing Technologies
            </li>
          </ul>
        </section>
      </article>
    </section>
  );
};

export default TermsAndConditionsPage;
