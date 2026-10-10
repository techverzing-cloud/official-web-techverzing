"use client";

import React, { useState } from "react";

const services = [
  "Web Development",
  "Mobile App Development",
  "CRM & Business Automation",
  "Digital Marketing & SEO",
  "UI/UX Design",
  "Cloud & IT Solutions",
  "Other",
];

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Without JavaScript the form still posts natively to /api/contact.
  return (
    <form
      action="/api/contact"
      method="POST"
      onSubmit={handleSubmit}
      className="mt-6 space-y-4"
    >
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
        <select
          id="service"
          name="service"
          defaultValue=""
          required
          className="contact-input contact-select"
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

      {/* Honeypot: hidden from people, filled by bots. Reject on the server if set. */}
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
        className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#ff8b32] px-5 py-3 text-sm font-bold text-[#101c2d] transition-colors duration-200 hover:bg-[#ff9b4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad70] focus-visible:ring-offset-2  disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      <div aria-live="polite" role="status">
        {status === "success" && (
          <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            Thanks, your enquiry is in. We&apos;ll reply within one working day.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            We couldn&apos;t send your enquiry. Please try again, or email us at
            info@techverzing.com.
          </p>
        )}
      </div>
    </form>
  );
}