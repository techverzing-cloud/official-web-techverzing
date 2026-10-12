# Vendored Skills Catalog

Canonical index of every skill vendored at `.opencode/skills/`. Load a skill via the `skill` tool by its `name`; its full instructions live in `.opencode/skills/<name>/SKILL.md`.

## Critical workflows (MUST)

- **Impeccable design work** - design, redesign, audit, critique, polish, or any `impeccable` command (`/impeccable init`, `shape`, `audit`, etc.) MUST load `impeccable` and follow its framework and reference guides.
- **Code reviews** - PRs, diffs, changesets, or any code review request MUST load `code-review-skill` and follow its framework and reference guides.
- **UI work** - creating, building, reshaping, restyling, auditing, or fixing any UI (web UIs, frontend components, design tokens, palettes, spacing, hierarchy, typography, theming, "my UI looks off", "fix the design") MUST load BOTH skills in sequence:
  1. `frontend-design` first - aesthetic direction (identity, typeface pairing, palette as a point of view, signature element).
  2. `refactoring-ui` second - execution (grayscale-first hierarchy, 4/8/16/24/32/48/64 spacing scale, modular type scale, systematic color, WCAG contrast, shadow/elevation). Run its Quick Diagnostic and state the score out of 10.
  - Reconcile conflicts by rule: `frontend-design` owns palette, typeface, and the signature element; `refactoring-ui` owns spacing, hierarchy, contrast, and depth.

## Design

| Skill | Purpose / when to load |
|---|---|
| `impeccable` | Design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or improve any frontend surface. UX review, visual hierarchy, IA, cognitive load, a11y, theming, typography, motion, design systems. |
| `frontend-design` | Distinctive, intentional visual direction for new or reshaped UI. Aesthetic direction, typeface pairing, palette as a point of view. |
| `refactoring-ui` | Fix visual hierarchy, spacing, color, depth; "my UI looks off", "fix the design", design tokens, dark mode, launch polish. |
| `web-typography` | Typeface selection/pairing, type scale, measure, line height, hierarchy, web font loading (FOUT/FOIT), variable fonts, zoom resilience. Load for typography/readability-focused work ("the text is hard to read", "fix the typography") to supplement `refactoring-ui`'s typography section and the `frontend-design` type direction. |
| `design-taste-frontend` | Anti-slop direction for landing pages, portfolios, redesigns. Reads the brief and ships non-templated interfaces. |

## Animation / motion

| Skill | Purpose / when to load |
|---|---|
| `animate` | Build motion from scratch: whether/what/tool/properties/curve/interrupt/exit. |
| `improve-animations` | Audit a whole codebase's motion and produce prioritized implementation plans (read-only). |
| `review-animations` | Review motion code against a high craft bar. Default to flagging. |
| `find-animation-opportunities` | Find places that don't animate but should; propose exact values (read-only). |
| `microinteractions` | Design the tiny high-frequency moments (triggers, rules, feedback, loops & modes) - button/loading states, toggles, form-validation responses, state transitions. "the interface feels dead", "add polish to interactions". |

## Libraries & components

| Skill | Purpose / when to load |
|---|---|
| `prototype` | Build divergent UI variants behind a live visual picker. |

## Knowledge

| Skill | Purpose / when to load |
|---|---|
| `graphify` | Questions about this codebase, architecture, and file relationships. Treat `graphify query "<question>"` as the first step before scanning code. |
