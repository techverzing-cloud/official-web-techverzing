"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Status =
  | "idle"
  | "sending"
  | "success"
  | "error"
  | "rate-limited"
  | "spam"
  | "bot-timing-failed";

function ThankYou() {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(panelRef.current, {
          autoAlpha: 0,
          y: 12,
          duration: 0.5,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { scope: panelRef }
  );

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      ref={panelRef}
      role="status"
      aria-live="polite"
      className="flex flex-col items-center py-6 text-center"
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-impact/10 text-impact"
      >
        <Icon icon="lucide:check" width={26} height={26} />
      </span>

      <span className="mt-6 inline-flex items-center gap-3 font-spaceMono text-[11px] uppercase tracking-[0.18em] text-black-slate/60">
        <span className="h-px w-8 bg-impact" />
        Message sent
      </span>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="heading_6 mt-4 font-semibold text-black-slate text-balance outline-none"
      >
        Thanks - your note is in.
      </h2>

      <p className="mt-4 max-w-[46ch] text-pretty font-inter text-base font-normal leading-[1.7] text-dull-text-dark">
        It&rsquo;s landed with a real person, not a queue. We&rsquo;ll read your
        note and reply within one working day.
      </p>
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const formLoadTimeRef = useRef<number>(0);

  useEffect(() => {
    formLoadTimeRef.current = Date.now();
  }, []);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const honeypot = String(data.get("website") ?? "").trim();
    if (honeypot) {
      console.log("Honeypot triggered:", honeypot);
      return;
    }

    if (!consent) {
      setConsentError(true);
      return;
    }

    const name = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const details = String(data.get("message") ?? "").trim();

    const meta = [
      company && `Company: ${company}`,
      phone && `Phone: ${phone}`,
    ].filter((line): line is string => Boolean(line));

    const message = [meta.join("\n"), details]
      .filter((part) => part.trim().length > 0)
      .join("\n\n");

    setStatus("sending");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          consent: true,
          formLoadTime: formLoadTimeRef.current,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setStatus("rate-limited");
        } else if (res.status === 400 && result.code === "SPAM_DETECTED") {
          setStatus("spam");
        } else if (res.status === 400 && result.code === "BOT_TIMING_FAILED") {
          setStatus("bot-timing-failed");
        } else {
          setStatus("error");
        }
        return;
      }
      form.reset();
      setConsent(false);
      setStatus("success");
    } catch (err) {
      console.error("Form submit error:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return <ThankYou />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="contact-label">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
            className="contact-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="contact-label">
            email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@gmail.com"
            autoComplete="email"
            required
            className="contact-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="contact-label">
          Company name
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Your company"
          autoComplete="organization"
          className="contact-input"
        />
      </div>

      <div>
        <label htmlFor="phone" className="contact-label">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+91 00000 00000"
          autoComplete="tel"
          className="contact-input"
        />
      </div>

      <div>
        <label htmlFor="message" className="contact-label">
          Project details <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="What are you building, and what would you like help with?"
          required
          className="contact-input min-h-32 resize-y"
        />
      </div>

      {/* Honeypot: hidden from people, filled by bots. Dropped on submit if set. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="consent"
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-black-slate/15 bg-white px-4 py-3 transition-colors duration-200 hover:border-black-slate/30"
        >
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setConsentError(false);
            }}
            aria-invalid={consentError}
            aria-describedby={consentError ? "consent-error" : undefined}
            className="mt-0.5 size-4 shrink-0 accent-impact focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
          <span className="font-inter text-xs leading-relaxed text-black-slate/80 sm:text-sm">
            I agree to the{" "}
            <Link
              href="/policies/privacy-policy"
              data-cursor-hover
              className="font-semibold text-impact underline underline-offset-2 transition-colors duration-200 hover:text-black-slate"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/policies/terms-conditions"
              data-cursor-hover
              className="font-semibold text-impact underline underline-offset-2 transition-colors duration-200 hover:text-black-slate"
            >
              Terms &amp; Conditions
            </Link>{" "}
            of Techverzing Technologies.
          </span>
        </label>
        {consentError && (
          <p id="consent-error" className="mt-2 font-inter text-xs text-red-600">
            Please agree to the Privacy Policy and Terms &amp; Conditions before
            submitting.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        data-cursor-hover
        className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-impact px-6 py-3 font-nunito text-sm font-semibold text-black-slate transition-[background-color,color,transform] duration-200 hover:bg-black-slate hover:text-cream-white active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
        <Icon
          icon="lucide:arrow-right"
          width={18}
          height={18}
          aria-hidden="true"
          className="transition-transform duration-200 motion-safe:group-hover:translate-x-1"
        />
      </button>

      <div aria-live="polite" role="status">
        {status === "error" && (
          <p className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-800">
            We couldn&rsquo;t send your note. Please try again, or email us at
            info@techverzing.com.
          </p>
        )}
        {status === "rate-limited" && (
          <p className="rounded-xl border border-amber-600/30 bg-amber-600/10 px-4 py-3 text-sm text-amber-800">
            You&rsquo;ve sent 3 messages today. Please wait until tomorrow to
            send more.
          </p>
        )}
        {status === "spam" && (
          <p className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-800">
            Your message was flagged as spam. Please revise and try again.
          </p>
        )}
        {status === "bot-timing-failed" && (
          <p className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-800">
            Submission too fast. Please take your time filling the form.
          </p>
        )}
      </div>
    </form>
  );
}
