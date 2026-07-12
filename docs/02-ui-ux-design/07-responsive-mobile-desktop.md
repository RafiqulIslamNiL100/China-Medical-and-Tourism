# Responsive & Mobile-First Design Guidelines

## 1. Breakpoints

| Token | Width | Primary devices |
|---|---|---|
| `xs` | 360px – 639px | Mobile phones |
| `sm` | 640px – 767px | Large phones / small tablets (portrait) |
| `md` | 768px – 1023px | Tablets |
| `lg` | 1024px – 1279px | Small laptops |
| `xl` | 1280px+ | Desktops |

Design and build **mobile-first**: base styles target `xs`, with `min-width` media
queries progressively enhancing layout at each breakpoint up.

## 2. Layout Adaptation Rules

- **Public marketing pages:** single-column stacked sections on `xs`/`sm`; multi-column
  grids (hospital cards, feature grids) activate at `md`+; hero sections keep CTA above the
  fold at every breakpoint.
- **Authenticated dashboards (Patient):** bottom tab bar navigation on `xs`/`sm`
  (replacing the sidebar entirely, not just hiding it); left sidebar reappears at `md`+;
  widget grids go from 1-column (`xs`) to 2-column (`md`) to 3-column (`lg`+).
- **Internal consoles (Hospital/Ops/Admin):** these are primarily desktop tools given data-
  density needs (tables, queues), but must remain usable at `md` (tablet) for on-the-go
  case managers — tables switch to a card-per-row layout below `md` rather than horizontal
  scroll wherever the row has more than 4 data points.
- **Partner portals (Driver/Interpreter):** designed `xs`-first and optimized for one-
  handed use; desktop view is a secondary, lightly-adapted experience, not a separate
  design.

## 3. Component-Specific Responsive Behavior

| Component | Mobile (`xs`/`sm`) | Desktop (`lg`+) |
|---|---|---|
| Top navigation | Hamburger drawer, logo + menu icon only | Full horizontal nav with dropdowns |
| Application Wizard | Full-screen step, sticky bottom action bar | Centered card, max-width 640px, footer action bar |
| Hospital Directory filters | Bottom-sheet drawer triggered by "Filters" button | Persistent left sidebar |
| Case Detail tabs | Horizontal scroll tab bar | Full tab bar, no scroll needed |
| Tables (Admin/Ops) | Card-per-row stacked layout | Full data table |
| Messaging | Full-screen thread view (back button to case) | Split view: case detail + message panel side-by-side |
| Modals | Full-screen sheet (slides up from bottom) | Centered modal, max-width 560px |
| Itinerary/Calendar | Agenda list view only | Toggle between agenda and month-grid view |

## 4. Touch & Input

- Minimum touch target 44×44px (per NFR-UX-04/Component A11y rules).
- Form inputs use appropriate mobile keyboard types (`inputmode="numeric"` for phone/OTP,
  `type="email"`, date pickers use native mobile date input where feasible).
- File upload on mobile supports both camera capture (for photographing physical documents)
  and gallery/file picker.

## 5. Performance Considerations for Mobile

- Given target markets include regions with variable mobile bandwidth (per NFR-PERF-04),
  images are served responsively (`srcset`) and lazy-loaded below the fold.
- Critical path CSS/JS kept minimal on marketing pages to hit the LCP target
  (NFR-PERF-01) on simulated 4G.
- Offline/poor-connectivity states are handled gracefully: form data is preserved locally
  (not lost) if a submission fails due to connectivity, with a retry prompt.

## 6. Testing Matrix

Minimum device/viewport testing set before shipping any screen:
- 360×800 (small Android phone)
- 390×844 (iPhone-class)
- 768×1024 (iPad portrait)
- 1280×800 (small laptop)
- 1920×1080 (desktop)

Both light conditions (as noted in the Style Guide's "legible in bright light" principle)
and screen-reader pass (VoiceOver/TalkBack spot check) are part of the definition of done
for any new screen, per NFR-UX-01.
