<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Techverzing Development Guide

This document provides guidelines and instructions for agents working in this codebase.

## Project Overview

**Techverzing** is a digital marketing and IT solutions agency website for **Techverzing**. Built with Next.js 16, React 19, and Tailwind CSS 4.

- **Tagline:** "Where Technology Meets Business Growth."
- **Website:** https://techverzing.com
- **Contact:** contact@techverzing.com

## Build Commands

```bash
# Development
pnpm dev

# Production Build
pnpm build

# Start Production Server
pnpm start

# Linting
pnpm lint

# Type Checking
pnpm tsc --noEmit
```

## Code Style Guidelines

### TypeScript / JSX

- Use **explicit types** for all function parameters and return types
- Use `interface` for object shapes, `type` for unions and utility types
- Use `React.ReactNode` for children props, `React.CSSProperties` for inline styles
- Use `React.FormEvent<HTMLFormElement>` for form event handlers
- Prefer functional components with arrow function syntax
- Add `"use client"` directive for client-side components

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `Header.tsx`, `GButton.tsx` |
| Hooks | camelCase with `use` prefix | `useMomentumScroll.ts` |
| Utilities | camelCase | `slugger`, `highlightText` |
| Types/Interfaces | PascalCase | `ButtonProps`, `FormField` |
| JSON data files | camelCase | `home.json`, `global.json` |
| CSS classes | kebab-case | `bg-primary`, `text-dull-text` |
| Export default | PascalCase matching filename | `export default function GButton()` |

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main layout group
│   │   ├── about/
│   │   ├── contact/
│   │   ├── services/
│   │   └── page.tsx
│   └── api/               # API routes
│       └── send-email/
├── components/
│   ├── ui/               # Reusable UI components
│   ├── global/           # Header, Footer, Menu
│   ├── home/             # Home page components
│   ├── form/             # Form components
│   └── animation/        # Animation components
├── content/              # Content data (no API calls)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
└── css/                  # Global styles and animations
```

### Imports

- Use **absolute paths** with `@/` alias (`@/components/...`, `@/content/...`, `@/lib/...`)
- Group imports: 1) React, 2) external libraries, 3) internal modules, 4) assets/types
- Use named exports for utilities, default exports for components

```typescript
// Good
import React from "react";
import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import GButton from "@/components/ui/Button";
import homeData from "@/content/home.json";

// From same directory
import { slugger } from "../lib/util";
```

### Tailwind CSS

- Use **tailwind-merge** (`twMerge`) with **clsx** for conditional classes
- Use CSS custom properties for colors: `bg-primary`, `text-dull-text`, `text-cream-white`
- Use `clamp()` for responsive sizing: `px-[clamp(1rem,5vw,4rem)]`
- Use data attributes for theme switching: `data-light-bg`, `data-dark-bg`
- Use predefined spacing: `mrMx` (margin-x), `mrPy` (padding-y), `px-global`
- **Always prefer standard Tailwind scale values over arbitrary values** for every utility - sizing, spacing, colors, typography, borders, radius, shadows, etc. Use `h-10 w-12`, not `h-[2.5rem] w-[3rem]`.
- Only use arbitrary values (`h-[1px]`, `bg-[#ff0000]`, `text-[13px]`) when a standard value **cannot** express the intent (e.g. 1px hairlines, dynamic/clamped values, brand colors not in the theme).
- The standard-value rule applies to **all** utilities, not just sizing.

### JSON Data Files

- Store all static content in `src/content/*.json` files
- Import directly: `import data from "@/content/home.json"`
- Avoid API calls for static content

### Error Handling

- Use `try/catch` blocks for async operations
- Show user-friendly error messages via `react-hot-toast`
- Return proper HTTP status codes in API routes (200, 400, 500)
- Handle empty/null states gracefully

```typescript
// API Route Error Handling
export async function POST(req: Request) {
  try {
    // ... logic
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Form Error Handling
try {
  const res = await fetch("/api/send-email", { ... });
  if (res.ok) {
    toast.success("Message sent!");
  } else {
    toast.error("Failed to send. Try again.");
  }
} catch {
  toast.error("An error occurred.");
} finally {
  setIsSubmitting(false);
}
```

### Component Patterns

**Client Components:**
```typescript
"use client";
import { useState } from "react";

export default function ComponentName() {
  const [state, setState] = useState<Type>(initialValue);
  
  return <div>...</div>;
}
```

**Server Components:**
```typescript
import data from "@/content/data.json";

export default async function Page() {
  return <div>{data.content}</div>;
}
```

### Icon Usage

Use `@iconify/react` with icon names from icon sets:
```typescript
import { Icon } from "@iconify/react";

<Icon icon="mdi:email" width={20} height={20} />
<Icon icon="twemoji:telephone-receiver" width={24} />
```

### Animation Guidelines

- Use GSAP for complex animations
- Use CSS animations for simple transitions
- Add `data-cursor-hover` for magnetic cursor effects
- Use `TextIn` component for entrance animations

#### GSAP Usage
- Install: `pnpm add gsap @gsap/react`
- Use the `useGSAP` hook from `@gsap/react` for React components (client-side only). It handles cleanup automatically.
- Scope selectors with a ref (pass `scope: ref`) and use refs for targets instead of global selectors.
- All GSAP code must run client-side (use `"use client"` and lifecycle hooks like `useGSAP`/`useEffect`), never during SSR.
- If using ScrollTrigger, register plugins: `gsap.registerPlugin(ScrollTrigger)`.
- Clean up via context revert when using `gsap.context()` in `useEffect`.
- For context-safe callbacks in event handlers, use `contextSafe()` from `useGSAP`.
- Prefer transforms/opacity for performance; avoid layout thrashing.

### Environment Variables

Required in `.env`:
```
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email@example.com
EMAIL_TO=contact@techverzing.com
```

Never commit `.env` files. Use `.env.example` for template.

### Accessibility

- Use semantic HTML elements
- Add `aria-label` for icon-only buttons
- Ensure color contrast meets WCAG standards
- Use `focus:outline-none` with custom focus styles

### Performance Tips

- Use `next/image` for all images
- Use `priority` for above-the-fold images
- Lazy load components below the fold
- Use `dynamic` imports for heavy components
