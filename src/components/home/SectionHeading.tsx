"use client";

import { TextIn } from "@/components/animation/TextIn";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string | string[];
  dark?: boolean;
  className?: string;
}

const SectionHeading = ({
  eyebrow,
  heading,
  dark = false,
  className = "",
}: SectionHeadingProps) => {
  const lines = Array.isArray(heading) ? heading : [heading];

  return (
    <div className={className}>
      <span
        className={`inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] ${
          dark ? "text-cream-white/60" : "text-dull-text-dark"
        }`}
      >
        <span className="h-px w-8 bg-impact" />
        {eyebrow}
      </span>
      <h2
        className={`heading_2 mt-4 font-semibold ${
          dark ? "text-white" : "text-black-slate"
        }`}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            <TextIn>{line}</TextIn>
          </span>
        ))}
      </h2>
    </div>
  );
};

export default SectionHeading;
