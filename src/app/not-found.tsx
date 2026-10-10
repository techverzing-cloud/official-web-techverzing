import Link from "next/link";
import GButton from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
        404
      </p>
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Sorry, we couldn&apos;t find the page you were looking for. Let&apos;s
        get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" data-cursor-hover>
          <GButton>Go to homepage</GButton>
        </Link>
        <Link href="/services" data-cursor-hover>
          <GButton variant="secondary">View services</GButton>
        </Link>
      </div>
    </div>
  );
}