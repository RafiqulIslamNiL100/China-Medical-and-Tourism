# Style Guide

A rendered, visual version of this style guide (colors, type scale, components) lives in
`docs/02-ui-ux-design/design-system-preview.html` — open it in a browser to see swatches
and live component states rather than hex codes alone.

## 1. Brand Personality

The platform sits between two emotional poles that must both be respected: **medical
trust** (calm, credible, precise — a hospital website's seriousness) and **travel
optimism** (warmth, ease, forward motion — a booking platform's confidence). The visual
language should read as *"a trusted specialist who also happens to be a great travel
concierge"* — never clinical-cold, never tourist-flashy.

Design principles:
1. **Calm clarity over decoration.** Generous whitespace, restrained color, clear
   hierarchy — patients are often anxious; the UI should lower cognitive load, not add to
   it.
2. **Evidence over adjectives.** Real accreditation badges, real numbers, real reviews are
   shown prominently — the design should have "slots" for proof, not just marketing copy.
3. **One primary action per screen.** Every screen has a single obvious next step,
   especially in the application/booking flow.
4. **Legible at a distance and in bright light.** Many users will be on mobile, in transit,
   in bright outdoor light — contrast ratios lean toward the higher end of AA.

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color-primary-600` | `#0F6E5C` | Primary brand color (deep teal-green) — primary buttons, links, active nav |
| `color-primary-700` | `#0B5548` | Primary hover/pressed state |
| `color-primary-100` | `#E3F3EF` | Primary tint — selected states, subtle backgrounds |
| `color-accent-600` | `#C77B2C` | Accent (warm amber) — secondary CTAs, highlights, "featured" badges |
| `color-accent-100` | `#FBEEDD` | Accent tint |
| `color-neutral-900` | `#111827` | Primary text |
| `color-neutral-700` | `#374151` | Secondary text |
| `color-neutral-500` | `#6B7280` | Placeholder text, disabled text |
| `color-neutral-300` | `#D1D5DB` | Borders, dividers |
| `color-neutral-100` | `#F3F4F6` | Page/section background |
| `color-neutral-0` | `#FFFFFF` | Surface / card background |
| `color-success-600` | `#15803D` | Success states, "Accepted", "Completed" status |
| `color-warning-600` | `#B45309` | Warning states, "Info Requested", SLA-risk flags |
| `color-danger-600` | `#B91C1C` | Errors, "Declined", destructive actions |
| `color-info-600` | `#1D4ED8` | Informational states, links inside body text |

**Rationale:** Teal-green reads as medical/health without the sterile blue-scrubs cliché;
it also nods to growth/renewal. Warm amber as the secondary accent adds the "travel warmth"
without competing with the primary CTA color. Status colors follow conventional semantics
so case-status chips are instantly scannable.

**Contrast rule:** Primary and status colors are validated to meet WCAG AA (4.5:1) against
their intended text/background pairing — see `design-system-preview.html` for the checked
combinations.

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| Latin-script UI & headings | **Inter** | Excellent legibility at small sizes, wide language support, free/open |
| Chinese-script UI & content | **Noto Sans SC** | Pairs cleanly with Inter, full simplified-Chinese coverage |
| Monospace (rare: IDs, reference numbers) | **JetBrains Mono** | Case reference numbers, invoice numbers |

### Type Scale (base 16px, 1.25 ratio)

| Token | Size / Line-height | Usage |
|---|---|---|
| `text-display` | 40px / 48px, weight 700 | Marketing hero headlines only |
| `text-h1` | 32px / 40px, weight 700 | Page titles |
| `text-h2` | 24px / 32px, weight 600 | Section headings |
| `text-h3` | 20px / 28px, weight 600 | Card titles, subsection headings |
| `text-body-lg` | 18px / 28px, weight 400 | Lead paragraphs |
| `text-body` | 16px / 24px, weight 400 | Default body text |
| `text-body-sm` | 14px / 20px, weight 400 | Secondary text, form helper text |
| `text-caption` | 12px / 16px, weight 500 | Labels, timestamps, badges |

## 4. Spacing & Layout

- Base unit: **4px**. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Grid: 12-column, max content width 1280px on desktop, 24px page margin on mobile, 32px on
  tablet, fluid gutter at 24px.
- Border radius: `radius-sm` 6px (inputs, chips), `radius-md` 10px (cards, buttons),
  `radius-lg` 16px (modals, feature panels).
- Elevation: 3-level shadow system (`shadow-sm` for cards at rest, `shadow-md` for
  dropdowns/popovers, `shadow-lg` for modals) — kept subtle to preserve the calm,
  clinical-trust tone.

## 5. Iconography & Imagery

- Icon set: line-style, 1.5px stroke, 24px grid (e.g., Lucide/Feather-style) — matches the
  calm, precise brand tone better than filled/glyph icons.
- Photography: real hospital facilities and real (consented, verified) patient/doctor
  photography wherever possible; generic stock imagery only for destination/city guide
  content, clearly not implying specific patient outcomes.
- Illustration (used sparingly, e.g., empty states, onboarding): flat, minimal, using the
  primary/accent palette only — avoids cartoonish tone that would undercut medical trust.

## 6. Motion

- Durations: 150ms (micro-interactions: hover, focus), 250ms (transitions: modal open,
  drawer slide), 400ms (page-level transitions, used sparingly).
- Easing: `ease-out` for entrances, `ease-in` for exits — standard, non-bouncy easing to
  keep the tone calm and professional.
- Reduced motion: all non-essential animation respects `prefers-reduced-motion`.
