# Content & Assets Guide - Techverzing Website

## Overview

This document describes the centralized content and asset management system implemented for the Techverzing website. All editable company-facing content and images are now organized in a maintainable, page-oriented structure.

---

## Content JSON Structure

### `src/content/site.json` - Shared Company Information

**Purpose**: Single source of truth for all shared company data used across multiple pages.

**Sections**:
- `company` - Name, tagline, description, founding year, experience
- `contact` - Phone, emails, address, maps embed/search URLs, `items` array (for legacy components)
- `socialLinks` - Social media icons and URLs (icons reference `/shared/`)
- `stats` - Key statistics (years, projects, clients, industries)
- `navigation` - Main links, footer sections, menu sections
- `sharedCta` - Reusable CTA block content
- `footer` - Logo, description, navSections, legal links
- `seo` - Site URL, default title/description

**Used by**: Header, Footer, CTA, SEO config, ContactSection, ServiceAdvantage

---

### `src/content/home.json` - Homepage Content

**Purpose**: All content specific to the homepage (`/`).

**Sections**:
- `hero` - Eyebrow, heading, subHeading, wordsAnimation, CTAs, scroll config
- `paragraph` - Intro paragraph with highlightWords
- `servicesSection` - "What We Do" section heading/description
- `clientsSection` - Client quote
- `whatWeDo` - Capabilities cards (7 items with icons, headings, descriptions, tags)
- `whoWeAre` - Statement, image, story blocks, stats (4 items)
- `trustedBy` - Brand names marquee, rating
- `testimonials` - 4 client testimonials
- `industries` - 8 industry cards with images and links

**Used by**: Hero, WhatWeDo, WhoWeAre, TrustedBy, Testimonials, Industries

---

### `src/content/about.json` - About Page Content

**Purpose**: All content for `/about`.

**Sections**:
- `hero` - SectionHero config (eyebrow, heading, highlights, description, CTAs)
- `about` - Company heading, description, 3 sections (Story, Mission, Vision) with CTAs
- `whyWeExist` - Eyebrow, heading, description, hint, 7 image cards
- `howWeWork` - 6 process steps (with optional `image` field)
- `servicesSection` - Eyebrow, heading, description
- `services` - 2 categories (Marketing, Tech Solutions) with 3 items each
- `team` - 4 team members

**Used by**: AboutHero, CurtainsScope, WhyWeExist, HowWeWork, ServicesOverview

---

### `src/content/services.json` - Services Listing Page

**Purpose**: Content for `/services` (services overview grid).

**Sections**:
- `hero` - SectionHero config
- `services` - Array of 10 service cards (title, slogan, link, icon)

**Used by**: Services page (ServicesList component)

---

### `src/content/services-data.json` - Individual Service Pages

**Purpose**: Detailed content for each service detail page (`/services/[slug]`).

**Structure**: Object keyed by service slug (e.g., `website-development`, `mobile-app-development`). Each service contains:
- `heading` - title, heading, text
- `intro` - 3 items with title, subtitle, image (src/alt), description[]
- `highlights` - 3 categories with title, icon, description[]
- `advantage` - title, subtitle, description[], advantages[]

**Used by**: Service detail pages (ServiceIntro, ServiceHighlights, ServiceAdvantage)

---

### `src/content/contact.json` - Contact Page Content

**Purpose**: Content for `/contact`.

**Sections**:
- `hero` - SectionHero config
- `contactSection` - Form field definitions, CTA button
- `mapSection` - Map embed URL
- `contactDetails` - Email, phone, office (with icons, hrefs)
- `formServices` - Dropdown options for contact form

**Used by**: Contact page (ContactSection, ContactForm, MapSection)

---

## Image Directory Structure

```
public/
├── shared/                    # Globally shared assets
│   ├── logo.png              # Main logo (for OG/Twitter images)
│   ├── logo_wbg.png          # Logo with background (header, footer)
│   ├── fb.webp               # Facebook icon
│   ├── insta.webp            # Instagram icon
│   ├── x.webp                # Twitter/X icon
│   ├── linkedin.webp         # LinkedIn icon
│   ├── yt.png                # YouTube icon
│   ├── bgimage.jpeg          # About/team background
│   ├── globalbg.jpeg         # Global background
│   ├── apple-touch-icon.png  # PWA icon
│   └── favicon.ico           # Favicon
│
├── home/                      # Homepage-specific images
│   ├── client.png            # Client showcase
│   └── heart.svg             # Decorative heart
│
├── about/                     # About page images (currently empty, ready for step images)
│   └── (reserved for howWeWork step images)
│
├── contact/                   # Contact page images (currently empty)
│
└── services/                  # Service-specific images (organized by slug)
    ├── website-development/
    │   ├── hero.webp
    │   ├── features.webp
    │   ├── showcase.webp
    │   ├── business-portfolio.jpg
    │   ├── ecommerce-landing.jpg
    │   └── dashboards.jpg
    ├── mobile-application/
    │   ├── hero.webp
    │   ├── cross-platform.webp
    │   └── redesign.webp
    ├── customized-software-development/
    │   ├── hero.png
    │   ├── lead-management.webp
    │   └── automation.webp
    ├── ai-ml-solutions/
    │   ├── hero.webp
    │   ├── recommendation.webp
    │   └── integration.webp
    ├── cloud-backend-development/
    │   ├── hero.webp
    │   ├── api-auth.webp
    │   └── database-storage.webp
    ├── ui-ux-design/
    │   ├── hero.webp
    │   ├── wireframes.webp
    │   └── brand-identity.png
    ├── maintenance-support/
    │   ├── hero.webp
    │   ├── bug-fixes.webp
    │   └── performance-security.webp
    ├── digital-branding/
    │   ├── hero.webp
    │   ├── brand-kit.webp
    │   └── social-creatives.webp
    ├── seo/
    │   ├── hero.png
    │   ├── keyword-research.jpg
    │   └── speed-performance.jpg
    └── social-media-optimization/
        ├── hero.jpg
        ├── paid-ads.jpg
        └── analytics.png
```

---

## Route → Content File Mapping

| Route | Content File(s) |
|-------|----------------|
| `/` | `home.json`, `site.json` (stats, sharedCta) |
| `/about` | `about.json`, `site.json` (stats, sharedCta) |
| `/services` | `services.json`, `site.json` (sharedCta) |
| `/services/[slug]` | `services-data.json`, `services.json` (for hero), `site.json` (contact) |
| `/contact` | `contact.json`, `site.json` (contact, socialLinks, sharedCta) |
| `/careers` | `site.json` (navigation) |
| `/policies/*` | `site.json` (footer legal) |

---

## Shared Values - Single Source of Truth

The following values are defined **once** in `site.json` and referenced everywhere:

| Value | Location in `site.json` | Used In |
|-------|------------------------|---------|
| Company name | `company.name` | SEO, Header, Footer, OG images |
| Tagline | `company.tagline` | Hero, OG images, Footer |
| Phone | `contact.phone` / `contact.phoneRaw` | Header, Footer, Contact, ServiceAdvantage, SEO |
| Emails | `contact.emails` | Footer, Contact, ServiceAdvantage, SEO |
| Address | `contact.address` | Footer, Contact, SEO |
| Social links | `socialLinks` | Header, Footer, Contact |
| Stats (years, projects, clients, industries) | `stats` | Home (WhoWeAre), About, Footer |
| Navigation links | `navigation.mainLinks` | Header, Footer |
| Footer sections | `navigation.footerSections` | Footer |
| Menu sections | `navigation.menuSections` | Header (CardNav) |
| Shared CTA | `sharedCta` | Home, About, Services, Contact, Service detail |
| Footer logo | `footer.logo` | Footer |
| Legal links | `footer.legal` | Footer |

**Example**: Changing `company.experienceYears` from `"10+"` to `"11+"` in `site.json` updates the hero, WhoWeAre stats, and any other reference automatically.

---

## Updating Content

### Text & Statistics
1. Edit the appropriate JSON file in `src/content/`
2. Save - changes reflect immediately in development (`pnpm dev`)
3. Rebuild for production (`pnpm build`)

### Images
1. Place new image in the appropriate `public/` subfolder
2. Use descriptive, lowercase, kebab-case filenames (e.g., `hero.webp`, `business-portfolio.jpg`)
3. Update the `src` path in the relevant JSON file
4. Recommended: Use WebP for photos, PNG for graphics with transparency
5. Keep dimensions consistent with existing images for layout stability

### Adding a New Service
1. Add service folder under `public/services/[new-slug]/` with images
2. Add entry to `services.json` → `services[]`
3. Add full detail object to `services-data.json` under `[new-slug]`
4. Add navigation links in `site.json` → `navigation.footerSections` and `navigation.menuSections`
5. Run `pnpm build` to generate static params

---

## Validation Commands

```bash
# Lint (checks code style, unused vars, etc.)
pnpm lint

# TypeScript type-check
pnpm tsc --noEmit

# Production build (verifies all pages render, static params generate)
pnpm build
```

### Expected Results (Post-Implementation)
- **Lint**: ~100 warnings (pre-existing in third-party skills code), 0 new errors from our changes
- **TypeScript**: 0 errors
- **Build**: ✓ Compiles successfully, 24 static pages generated

---

## Remaining Hardcoded Content / Exceptions

| Location | Content | Reason |
|----------|---------|--------|
| `src/components/ui/Icons.tsx` | SVG icon components | Code-based icons, not content |
| `src/lib/util.tsx` | `highlightText`, `slugger`, `renderTextWithHighlights` | Utility functions |
| `src/lib/config.ts` | `ENABLE_PRELOADER` | Feature flag |
| `src/app/(main)/page.tsx` metadata | Title/description strings | Could be moved to JSON if needed |
| `src/app/(main)/services/page.tsx` SectionHero | Hardcoded hero content | Duplicates `services.json.hero` - could be refactored |
| `src/app/(main)/contact/page.tsx` SectionHero | Hardcoded hero content | Duplicates `contact.json.hero` - could be refactored |
| `src/app/(main)/about/page.tsx` metadata | Description string | Could use `site.json` |
| ContactForm honeypot field | `website` field name | Spam protection implementation detail |

---

## Missing Assets / Unresolved Issues

- **About page step images**: `howWeWork.steps[i].image` fields are empty strings (`""`). Place images in `public/about/how-we-work/` (e.g., `01-discover.webp`) and update JSON when available.
- **Contact page images**: No dedicated images yet; `public/contact/` folder exists for future use.
- **Team member photos**: `about.json` → `team[i].img` are empty strings.

---

## File Ownership Summary

| File | Owner | Modification Frequency |
|------|-------|------------------------|
| `site.json` | Marketing/Leadership | Rare (company info changes) |
| `home.json` | Marketing | Quarterly (campaign updates) |
| `about.json` | Marketing/HR | Yearly (team, story updates) |
| `services.json` | Sales/Marketing | Per new service launch |
| `services-data.json` | Sales/Technical | Per service detail update |
| `contact.json` | Operations | Rare (form fields, map) |
| `public/shared/*` | Design/Brand | Rare (logo, social icons) |
| `public/home/*` | Design | Per homepage redesign |
| `public/services/*` | Design/Technical | Per service launch/update |

---

## Verification Checklist (Post-Change)

- [ ] `pnpm lint` passes (only pre-existing warnings)
- [ ] `pnpm tsc --noEmit` shows 0 errors
- [ ] `pnpm build` completes successfully
- [ ] Homepage renders all sections with correct content
- [ ] About page shows story, process, team
- [ ] Services page lists all 10 services
- [ ] Each service detail page loads correct images and content
- [ ] Contact form submits, shows success/error states
- [ ] Footer navigation links work
- [ ] Header menu opens with correct categories
- [ ] Shared stats (10+ years, 250+ projects, etc.) consistent across pages
- [ ] Changing a value in `site.json` updates all references