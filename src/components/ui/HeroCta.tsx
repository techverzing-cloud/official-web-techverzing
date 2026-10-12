import Link from "next/link";
import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";

interface HeroCtaLink {
  label: string;
  href: string;
}

interface HeroCtaProps {
  primary: HeroCtaLink;
  secondary?: HeroCtaLink;
  className?: string;
}

export default function HeroCta({ primary, secondary, className }: HeroCtaProps) {
  return (
    <div
      className={twMerge(
        "flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row",
        className
      )}
    >
      <Link
        href={primary.href}
        data-cursor-hover
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream-white px-6 py-3 text-sm font-semibold text-primary transition duration-150 ease-out hover:bg-impact active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-auto md:text-base"
      >
        {primary.label}
        <Icon
          icon="lucide:arrow-right"
          aria-hidden="true"
          className="transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
        />
      </Link>

      {secondary ? (
        <Link
          href={secondary.href}
          data-cursor-hover
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream-white/25 px-6 py-3 text-sm font-medium text-cream-white/85 transition duration-150 ease-out hover:border-cream-white/60 hover:text-cream-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impact focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:w-auto md:text-base"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}
