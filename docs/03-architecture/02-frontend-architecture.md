# Frontend Architecture

## 1. Framework & Rendering Strategy

**Next.js (App Router) + TypeScript.** Rendering mode is chosen per route group, not
uniformly:

| Route group | Rendering | Rationale |
|---|---|---|
| Public marketing (`/`, `/hospitals`, `/specialties`, `/blog`, ...) | SSG with Incremental Static Regeneration (ISR) | SEO-critical, content changes infrequently (hospital profiles, articles) — ISR revalidates without a full rebuild |
| Search/filter results (`/hospitals` with query params) | SSR | Filtered results must reflect current data and be crawlable for common filter combinations |
| Authenticated portals (`/app`, `/hospital`, `/ops`, `/admin`, `/partner`) | Client-rendered (CSR) behind auth, with a minimal SSR shell | No SEO need; prioritizes interactivity and avoids re-fetching on every navigation |

## 2. Application Structure

Two logically separate Next.js applications sharing a component/design-system package
(per the `apps/web` + `apps/admin` split anticipated in Phase 4's folder structure):

- **`apps/web`** — public marketing site + Patient portal + Partner portals (all
  patient/partner-facing, one deployable).
- **`apps/admin`** — Hospital portal + Ops console + Admin console (all internal/staff-
  facing, separately deployable so it can sit behind stricter network/access controls if
  needed later, e.g., VPN or IP allowlisting for admin financial screens).

Both consume a shared `packages/ui` component library implementing the Design System
(`docs/02-ui-ux-design/02-design-system-components.md`) so visual/behavioral consistency
is enforced at the code level, not just by convention.

## 3. State Management

- **Server state** (data fetched from the API — cases, hospitals, bookings): TanStack
  Query (React Query). Handles caching, refetching, optimistic updates for mutations
  (e.g., marking a message read) without a global store.
- **Client/UI state** (wizard step, modal open/closed, filter panel state): local
  component state or React Context for state shared across a small subtree (e.g., the
  Application Wizard's multi-step form state). No global client-state library (Redux/
  Zustand) is introduced unless a genuine cross-cutting client-only state need emerges —
  avoids unnecessary complexity per the "no premature abstraction" principle.
- **Forms:** React Hook Form + Zod schema validation, with the same Zod schemas shared
  with the backend DTO validation where feasible (via a shared `packages/schemas`
  package) to avoid validation-rule drift between client and server.

## 4. Styling & Components

- Tailwind CSS utility classes + shadcn/ui (Radix primitives) as the component
  foundation, themed via the CSS custom properties defined in
  `docs/02-ui-ux-design/01-style-guide.md`.
- Design tokens (colors, spacing, radius, type scale) live in a single
  `packages/ui/tokens.css` (or Tailwind config extension) — components never hardcode
  raw hex values or pixel sizes outside that token layer.

## 5. Internationalization (i18n)

- `next-intl` (or equivalent App-Router-compatible i18n library) for locale routing
  (`/en/...`, `/zh/...`) and message catalogs.
- Minimum locales at launch: English (`en`), Simplified Chinese (`zh-CN`) per
  NFR-UX-02; message catalogs structured so additional locales are pure data additions,
  no code changes.
- Locale-aware formatting (dates, numbers, currency display) via the `Intl` API,
  respecting NFR-LOC-01/02.

## 6. Authentication on the Frontend

- JWT access token (short-lived) stored in an `httpOnly`, `Secure`, `SameSite=Strict`
  cookie — never in `localStorage`, to reduce XSS token-theft risk.
- Refresh token rotation handled via a dedicated `/api/v1/auth/refresh` call triggered by
  a request-interceptor on 401 responses.
- Route-level auth guards (middleware) redirect unauthenticated users to `/login` and
  enforce role-based route access (e.g., a `patient`-role user cannot load `/admin/*`)
  as a UX convenience — the authoritative check always happens server-side per
  NFR-SEC-06.

## 7. Performance Practices

- Route-based code splitting is automatic via the App Router; heavy components (rich
  text editor in CMS, calendar/itinerary view) are additionally dynamically imported
  (`next/dynamic`) to keep initial bundle size down.
- Images served via `next/image` with responsive `srcset`, satisfying NFR-PERF-04.
- Critical public pages (landing, hospital directory) are budgeted against
  NFR-PERF-01 (LCP < 2.5s on simulated 4G) in CI via Lighthouse CI on every PR touching
  those routes.

## 8. Testing

- **Unit/component:** Vitest + React Testing Library for component logic and rendering.
- **End-to-end:** Playwright, covering the critical paths defined per module (e.g., full
  Application Wizard submission, login/OTP flow, payment flow in Stripe test mode).
- **Visual regression (P1):** Playwright screenshot comparison for the core Design
  System components, to catch unintended visual drift.

## 9. Accessibility Tooling

- `eslint-plugin-jsx-a11y` enforced in CI.
- Automated axe-core checks run against key pages in the Playwright E2E suite as a
  baseline; manual screen-reader spot checks remain part of the Definition of Done
  (`PROJECT_CONTEXT.md` §11) since automated tools don't catch everything.
