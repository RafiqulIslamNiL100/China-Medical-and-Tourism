# Design System — Component Library Specification

Component library target implementation: **shadcn/ui primitives on Radix + Tailwind CSS**
(see Architecture doc), themed with the tokens in `01-style-guide.md`. This document
specifies behavior and variants; visual reference is in `design-system-preview.html`.

## 1. Foundational Components

### Button
- Variants: `primary` (filled, primary-600), `secondary` (outline, neutral border),
  `accent` (filled, accent-600 — used for a single competing CTA at most per screen),
  `ghost` (text-only, for tertiary actions), `destructive` (filled, danger-600).
- Sizes: `sm` (32px height), `md` (40px, default), `lg` (48px, marketing CTAs).
- States: default, hover, focus-visible (2px ring, primary-600 offset), active/pressed,
  disabled (50% opacity, no pointer events), loading (spinner replaces label, width
  preserved to avoid layout shift).

### Input / Textarea / Select
- Label always visible above field (no placeholder-as-label anti-pattern).
- Helper text and error text share one slot below the field; error state swaps border to
  `danger-600` and shows an inline error icon + message.
- Required fields marked with a subtle asterisk plus `aria-required`.

### Form Patterns
- **File Upload (Dropzone):** drag-and-drop + click-to-browse, shows file name, size,
  upload progress bar, and a virus/format validation state before accepting (used for
  medical documents and passport uploads).
- **Multi-step Wizard:** horizontal step indicator on desktop (numbered circles + labels,
  current step filled primary-600, completed steps show checkmark), collapses to a
  "Step 2 of 5" text + progress bar on mobile.

### Card
- Base card: white surface, `shadow-sm`, `radius-md`, 24px padding.
- **Hospital Card** (directory grid): image (16:9), hospital name, city + specialty tags,
  star rating + review count, price-range chip, "Verified" accreditation badge, CTA
  "View Hospital".
- **Doctor Card:** photo (circular), name, specialty, hospital affiliation, years of
  experience, languages spoken (flag/text chips).
- **Case Summary Card** (dashboard): status chip, hospital/specialty, next action prompt
  ("Upload your passport to continue"), progress bar reflecting case-stage.

### Status / Badge Chips
- Rounded-full, `text-caption`, colored per semantic state:
  - `Submitted` — neutral-500 bg / neutral-900 text
  - `Under Review` — info-600 tint
  - `Info Requested` — warning-600 tint
  - `Accepted` / `Confirmed` — success-600 tint
  - `Declined` / `Cancelled` — danger-600 tint
  - `Completed` — primary-600 tint
- "Verified Patient" and "Verified Hospital" badges use a distinct checkmark-shield icon
  in primary-600 to visually differentiate trust badges from status chips.

### Navigation
- **Top Nav (public):** sticky, elevates with `shadow-sm` on scroll, collapses to hamburger
  drawer < 1024px.
- **Sidebar (authenticated consoles):** collapsible to icon-only rail (64px) on tablet,
  fully hidden behind a menu button on mobile with bottom-tab replacement for the primary
  portal (Patient).
- **Breadcrumbs:** used in all authenticated consoles below the top bar for wayfinding
  inside nested case views.

### Data Display
- **Table** (Admin/Ops/Hospital lists): sticky header, sortable columns, row-hover
  highlight, row-click opens detail (with an explicit "View" action for accessibility —
  never click-only rows), pagination or infinite scroll depending on list length.
- **Timeline** (Case detail — status history): vertical timeline with timestamped
  entries, icon per event type (document uploaded, message sent, status changed, payment
  received).
- **Empty States:** icon/illustration + one-sentence explanation + primary action (e.g.,
  no cases yet → "Start your first application").

### Feedback & Overlays
- **Toast notifications:** top-right (desktop) / top (mobile), auto-dismiss 5s for
  success/info, persistent until dismissed for errors.
- **Modal:** centered, `radius-lg`, `shadow-lg`, backdrop blur+dim, focus-trapped, closes
  on Escape/backdrop click except for destructive-confirmation modals (require explicit
  button click, per NFR-UX-04).
- **Inline confirmation for destructive actions:** two-step (button → "Are you sure?"
  inline state) preferred over modal for lower-stakes actions (e.g., remove a document);
  modal reserved for high-stakes actions (cancel booking, delete account).

### Messaging Component
- Threaded message list grouped by day, sender avatar + role label (e.g., "Case Manager —
  Li Wei"), file-attachment support inline, read-receipt indicator, typing indicator
  (P1).

### Calendar / Itinerary
- Combined agenda view: vertical day-by-day list (mobile-friendly default) with a toggle
  to month-grid view (desktop), color-coded by event type (hospital visit = primary,
  hotel = accent, transfer = neutral-700).

## 2. Composition Patterns

- **Dashboard layout:** left sidebar (nav) + top bar (search/notifications/account) + main
  content area using a 12-col grid; widgets (case summary cards, itinerary snippet,
  notifications) arranged in a responsive card grid.
- **Detail-with-tabs layout:** used for Hospital Detail (public) and Case Detail
  (authenticated) — hero/header block with key facts, then horizontal tabs (`Overview`,
  `Doctors`, `Packages`, `Reviews` / `Overview`, `Documents`, `Messages`, `Itinerary`,
  `Payments`).
- **Wizard layout:** centered single-column content (max 640px) with persistent step
  indicator and sticky footer action bar (`Back` / `Continue`) — minimizes distraction
  during the sensitive application flow.

## 3. Accessibility Requirements (applies to all components)

- All interactive components are keyboard-operable and expose correct ARIA roles/states.
- Color is never the only signal of state — status chips and form errors always pair color
  with an icon or text label.
- Focus order follows visual/reading order; focus-visible outline never suppressed.
- Minimum touch target: 44×44px on mobile.
