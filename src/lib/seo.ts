import global from "@/json/global.json";

const siteUrl = "https://www.techverzing.com";

export const siteConfig = {
  name: "Techverzing Technologies",
  shortName: "Techverzing",
  url: siteUrl,
  tagline: "Where Technology Meets Business Growth.",
  description:
    "Techverzing Technologies is a digital marketing and IT solutions agency offering websites, mobile apps, custom CRM, AI/ML, SEO, and 360° marketing.",
  email: "info@techverzing.com",
  phone: "+917307693692",
  address: {
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    addressCountry: "IN",
  },
  socialLinks: global.contactInfo.socialLinks.map((link) => link.href),
} as const;

export const homeTitle =
  "Techverzing Technologies | Digital Marketing & IT Solutions Agency";

export const homeDescription =
  "Techverzing Technologies is a digital marketing and IT solutions agency offering websites, mobile apps, custom CRM, AI/ML, SEO, and 360° marketing.";