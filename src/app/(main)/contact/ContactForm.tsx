"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import contactData from "@/content/contact.json";

const services = contactData.formServices;

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill every field. Silently drop if set.
    if (String(data.get("website") ?? "").trim()) return;

    const name = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const details = String(data.get("message") ?? "").trim();

    const meta = [
      company && `Company: ${company}`,
      phone && `Phone: ${phone}`,
      service && `Service: ${service}`,
    ].filter((line): line is string => Boolean(line));

    const message = [meta.join("\n"), details]
      .filter((part) => part.trim().length > 0)
      .join("\n\n");

    setStatus("sending");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
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
            Work email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            className="contact-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>

      <div>
        <label htmlFor="service" className="contact-label">
          Service <span aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <select
            id="service"
            name="service"
            defaultValue=""
            required
            className="contact-input contact-select [&>option]:bg-white [&>option]:text-black-slate"
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <Icon
            icon="lucide:chevron-down"
            width={18}
            height={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black-slate/40"
          />
        </div>
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
        {status === "success" && (
          <p className="rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-800">
            Thanks, your note is in. We&rsquo;ll reply within one working day.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-800">
            We couldn&rsquo;t send your note. Please try again, or email us at
            info@techverzing.com.
          </p>
        )}
      </div>
    </form>
  );
}
