import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import GButton from "@/components/ui/Button";
import aboutData from "@/json/about.json";

const Cta = () => (
  <section id="CTA" data-light-bg className="py-16 sm:py-24">
    <div className="mx-auto px-2">
      <Reveal>
        <div className="border-primary/80 flex flex-col items-start justify-between gap-6 rounded-3xl border-2 border-dashed bg-white p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="heading_2 font-semibold">{aboutData.cta.heading}</h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              {aboutData.cta.description}
            </p>
          </div>
          <div className="grid gap-3">
            {aboutData.cta.buttons.map((btn) => (
              <Link key={btn.label} href={btn.href}>
                <GButton
                  className="w-full"
                  variant={btn.style === "primary" ? "primary" : "secondary"}
                  size="md"
                >
                  {btn.label}
                </GButton>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Cta;
