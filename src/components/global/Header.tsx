import CardNav, { type CardNavItem } from "@/components/react-bit/CardNav";
import global from "@/json/global.json";

const { sections, links } = global.menu;

const sectionColors = [
  { bg: "#e8e6d9", text: "#141415" },
  { bg: "#FF8C42", text: "#141415" },
];

const items: CardNavItem[] = [
  ...sections.map((section, i) => ({
    label: section.label,
    bgColor: sectionColors[i]?.bg ?? "#e8e6d9",
    textColor: sectionColors[i]?.text ?? "#141415",
    links: section.categories.map((cat) => ({
      label: cat.name,
      href: cat.link,
      ariaLabel: cat.name,
    })),
  })),
  {
    label: "Company",
    bgColor: "#3a3a2e",
    textColor: "#e8e6d9",
    links: links.map((link) => ({
      label: link.label,
      href: link.path,
      ariaLabel: link.label,
    })),
  },
];

const Header = () => {
  return (
    <CardNav
      logo="/global/logo.png"
      logoAlt="Techverzing Technologies"
      items={items}
      baseColor="#202223"
      menuColor="#e8e6d9"
    />
  );
};

export default Header;
