import SectionHero from "@/components/global/SectionHero";
import about from "@/json/about.json";

const hero = about.hero;

export default function AboutHero() {
  return (
    <SectionHero
      eyebrow={hero.eyebrow}
      heading={hero.heading}
      highlights={["strategy", "technology"]}
      description={hero.description}
      primary={{ label: hero.primary.label, href: hero.primary.href }}
      secondary={{ label: hero.secondary.label, href: hero.secondary.href }}
      scrollTo="#about-company"
    />
  );
}
