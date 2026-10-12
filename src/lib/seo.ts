import site from "@/content/site.json";

const siteUrl = site.seo.siteUrl;

export const siteConfig = {
  name: site.company.name,
  shortName: site.company.shortName,
  url: siteUrl,
  tagline: site.company.tagline,
  description: site.company.description,
  email: site.contact.emails[0],
  phone: site.contact.phoneRaw,
  address: {
    addressLocality: site.contact.address.locality,
    addressRegion: site.contact.address.region,
    addressCountry: site.contact.address.country,
  },
  socialLinks: site.socialLinks.map((link) => link.href),
} as const;

export const homeTitle = site.seo.defaultTitle;

export const homeDescription = site.seo.defaultDescription;