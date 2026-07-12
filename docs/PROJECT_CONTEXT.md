# PROJECT_CONTEXT.md

> Load this file at the start of every development session. It is the single source of
> truth for what this product is, how it's built, and the conventions every module must
> follow. Detailed artifacts it summarizes live under `docs/01-product-planning/`,
> `docs/02-ui-ux-design/`, and `docs/03-architecture/`. Folder structure, database, and
> API specs (Phases 4, 6, 7) will be added here as those phases are completed — this file
> will be kept up to date as the authoritative index.

## 1. Business Overview

**China Medical and Tourism** is a two-sided marketplace and coordination platform
connecting international patients with accredited hospitals in China, bundling the
medical journey with visa support, hotel booking, airport transfers, and interpretation —
so a patient can book world-class treatment as coordinated as booking a flight and hotel.

Full detail: `docs/01-product-planning/01-business-requirements.md`

## 2. Vision

Become the trusted, single point of accountability for international medical travel to
China — replacing fragmented, unlicensed "medical broker" arrangements with a transparent,
digitally coordinated, auditable service, starting with a curated hospital network in
Beijing, Shanghai, and Guangzhou.

## 3. Target Users

| Role | Summary |
|---|---|
| Patient | International patient (or family member booking on their behalf) seeking treatment in China |
| Hospital Staff | Partner hospital representative managing listings, doctors, and applications |
| Case Manager | Internal ops staff coordinating each patient's end-to-end journey |
| Driver / Interpreter | Gig-style logistics partners fulfilling assigned trips/appointments |
| Hotel Partner | Partner hotel managing inventory and bookings sold through the platform |
| Platform Admin | Internal super-user: users, finance, content moderation, analytics |

Full detail: `docs/01-product-planning/02-user-stories.md`,
`docs/01-product-planning/03-user-journeys.md`

## 4. Requirements Index

- Feature list (prioritized P0/P1/P2): `docs/01-product-planning/04-feature-list.md`
- Functional requirements (FR-*, traceable IDs): `docs/01-product-planning/05-functional-requirements.md`
- Non-functional requirements (NFR-*: performance, security, compliance):
  `docs/01-product-planning/06-non-functional-requirements.md`
- Business rules (BR-*: SLAs, commissions, cancellation policy):
  `docs/01-product-planning/07-business-rules.md`
- Privacy Policy (draft — needs legal review before publish):
  `docs/01-product-planning/08-privacy-policy.md`
- Terms of Service (draft — needs legal review before publish):
  `docs/01-product-planning/09-terms-of-service.md`
- Sitemap, navigation, information architecture:
  `docs/01-product-planning/10-sitemap-navigation-ia.md`

## 5. Tech Stack (confirmed in Phase 3 — System Architecture)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, two apps (`apps/web`, `apps/admin`) sharing a `packages/ui` component library |
| Backend | NestJS + TypeScript, modular monolith (one module per business domain, see §5b) |
| Database | PostgreSQL (single instance, module-owned schemas, row-level multi-tenancy) |
| ORM | Prisma |
| Authentication | Auth.js or Better Auth, short-lived JWT + rotating refresh token, mandatory 2FA for staff/admin roles |
| Storage | S3-compatible object storage — separate private `documents` bucket (signed URLs) and public `media` bucket (CDN) |
| Caching | Redis (cache + BullMQ background job queue) |
| Search | Postgres full-text search at launch; dedicated search index (e.g., Meilisearch) if/when volume outgrows it |
| Payments | Stripe (international) + region-specific rails as needed per target market |
| Email | Resend |
| SMS / OTP | Twilio or regional provider |
| Deployment | Docker + Terraform (IaC) + CI/CD pipeline, staging auto-deploy / production manual-approval gate |

This stack is architecturally defined but not yet implemented in this repository —
Phase 4 (Folder Structure) translates it into an actual repo layout before module code
is written.

## 5b. System Architecture Index (Phase 3)

- Overview, component diagram, request-flow diagram, environments:
  `docs/03-architecture/01-architecture-overview.md`
- Frontend architecture (rendering strategy, state, i18n, testing):
  `docs/03-architecture/02-frontend-architecture.md`
- Backend & API architecture (module boundaries, API conventions, events, background
  jobs): `docs/03-architecture/03-backend-api-architecture.md`
- Database architecture (schema ownership, multi-tenancy, backup/DR):
  `docs/03-architecture/04-database-architecture.md`
- Authentication, authorization & security architecture:
  `docs/03-architecture/05-auth-security-architecture.md`
- Storage, caching & search architecture:
  `docs/03-architecture/06-storage-caching-search.md`
- Notification architecture (event-driven dispatch, channels, templates):
  `docs/03-architecture/07-notification-architecture.md`
- Observability (logging, metrics, tracing, alerting):
  `docs/03-architecture/08-observability.md`
- Deployment, CI/CD & infrastructure:
  `docs/03-architecture/09-deployment-cicd-infrastructure.md`

## 6. UI Design System

- Style guide (color, type, spacing, motion): `docs/02-ui-ux-design/01-style-guide.md`
- Component library spec: `docs/02-ui-ux-design/02-design-system-components.md`
- Screen specs (54 screens across public site, patient/hospital/ops/admin/partner
  portals): `docs/02-ui-ux-design/03-*.md` through `06-*.md`
- Responsive/mobile guidelines: `docs/02-ui-ux-design/07-responsive-mobile-desktop.md`
- **Live visual reference (colors, type, components):**
  `docs/02-ui-ux-design/design-system-preview.html`

Brand tone: "a trusted specialist who also happens to be a great travel concierge" — calm
clarity over decoration, evidence over adjectives, one primary action per screen.

## 7. Security & Compliance Rules (non-negotiable)

- Never store raw payment card data — delegate to a PCI-DSS Level 1 processor.
- Encrypt medical documents and passport scans at rest (AES-256) and in transit (TLS 1.2+).
- Enforce role-based access control at the API layer on every request, not just in the UI.
- Log and access-control every read of a patient's medical document vault (audit trail).
- Capture explicit, separate consent before processing medical data (never bundled with
  general ToS acceptance).
- Handle cross-border data transfer per PIPL (China) and GDPR-equivalent principles for
  other target markets.
- Full detail: `docs/01-product-planning/06-non-functional-requirements.md` §3–4.

## 8. API Conventions

*(Fixed in Phase 3, see `docs/03-architecture/03-backend-api-architecture.md`; a full
endpoint-by-endpoint specification is still produced in Phase 7.)*

- REST, JSON, versioned under `/api/v1/`.
- Authenticated routes require a bearer JWT; role scope enforced per endpoint, plus
  tenant-scoping for `hospital_staff`/`hotel_partner`/`driver`/`interpreter` roles.
- Resource naming: plural nouns (`/patients`, `/cases`, `/hospitals`), nested where
  ownership is clear (`/cases/:id/documents`).
- Cursor-based pagination for high-growth lists; consistent `{ error: { code, message,
  details } }` error shape; `Idempotency-Key` header required for endpoints with external
  side effects (payments, invitation letters).
- Every mutating endpoint on a "case" object emits a notification event per
  FR-APP-08/FR-NOTIF-01, via the internal event bus (never direct provider calls from a
  business module).

## 9. Database Conventions

*(Fixed in Phase 3, see `docs/03-architecture/04-database-architecture.md`; full
entity-relationship schema is produced in Phase 6.)*

- PostgreSQL, single instance, accessed via Prisma; every schema change is a versioned,
  backward-compatible migration.
- Table names: `snake_case`, plural (`patients`, `applications`, `hospitals`).
- Every table: `id` (UUID), `created_at`, `updated_at`; soft-delete via `deleted_at` where
  records must be recoverable/auditable (e.g., cases, documents) rather than hard-deleted.
- Tables are owned by a single backend module (§5b); other modules never write directly
  into another module's tables — only through that module's service layer.
- Multi-tenancy via row-level scoping (`hospital_id`/`partner_id` columns), not
  per-tenant databases/schemas.
- Foreign keys explicit and indexed; no implicit joins across service boundaries — see
  the service-oriented folder structure to be defined in Phase 4.

## 10. Naming Conventions

- Case status vocabulary is fixed and shared across all portals: `Submitted`,
  `Under Review`, `Info Requested`, `Accepted`, `Declined`, `Completed` — never introduce
  ad hoc status strings; extend this enum deliberately if a new state is required.
- Role identifiers: `patient`, `hospital_staff`, `doctor`, `case_manager`, `driver`,
  `interpreter`, `hotel_partner`, `admin` — used consistently across code, database, and
  route prefixes (`/app`, `/hospital`, `/ops`, `/partner`, `/admin`).
- Requirement IDs (`FR-*`, `NFR-*`, `BR-*`) should be referenced in commit messages and PR
  descriptions when a change implements or modifies a specific requirement, to keep
  planning docs and code traceable to each other.

## 11. Definition of Done

A module/feature is done when:
1. It implements the specific `FR-*` requirement(s) it targets, per
   `05-functional-requirements.md`.
2. It respects applicable `NFR-*` (security, accessibility, performance) and `BR-*`
   (business rule) constraints.
3. UI matches the relevant screen spec and uses only components/tokens defined in the
   Design System (no one-off styles).
4. It has automated test coverage for its business logic (unit + integration per
   NFR-MAINT-02).
5. It is responsive per `07-responsive-mobile-desktop.md` and passes a basic
   accessibility check (keyboard nav, screen-reader spot check, WCAG AA contrast).
6. Sensitive actions are audit-logged where required (NFR-SEC-07).
7. Documentation (this file and/or module README) is updated if conventions changed.

## 12. Working Session Pattern

Per session, give a single focused task referencing this file plus the specific
requirement/screen IDs involved, e.g.:

> "Implement the patient registration and OTP verification flow (FR-AUTH-01 through
> FR-AUTH-03, Screens 18–20). Follow PROJECT_CONTEXT.md conventions."

This keeps each session's output consistent and traceable without re-explaining the whole
product each time.

## 13. Status of This Document

| Phase | Status |
|---|---|
| Phase 1 — Product Planning | ✅ Complete |
| Phase 2 — UI/UX Design | ✅ Complete (54 screens specified + visual token reference) |
| Phase 3 — System Architecture | ✅ Complete (9 docs: overview/diagrams, frontend, backend/API, database, auth/security, storage/caching/search, notifications, observability, deployment/CI-CD) |
| Phase 4 — Folder Structure | Partial — `apps/web` scaffolded (see §14); services/packages layout not yet defined |
| Phase 5 — Module-by-module build | Partial — public marketing site + Patient/Hospital/Ops portals live in `apps/web` (43 screens, mock data); Admin console and Partner (Driver/Interpreter/Hotel) portals not started, no real backend/auth/database wired up yet |
| Phase 6 — Database Design | Not started (placeholder conventions only, §9) |
| Phase 7 — API Specification | Not started (placeholder conventions only, §8) |
| Phase 8 — Testing | Not started (no automated tests yet — build/lint pass) |
| Phase 9 — Deployment | Not started |

## 14. Current Implementation — `apps/web`

A working Next.js (App Router, TypeScript, Tailwind v4) implementation lives in
`apps/web/`, using two route groups so each surface gets the right chrome:

- **`(marketing)` route group** — the public site, all 21 screens from
  `docs/02-ui-ux-design/03-screens-marketing-public.md`: home, hospital directory,
  hospital/doctor detail, specialties, destinations, how-it-works, pricing, reviews,
  blog, about, partner-with-us, FAQ, contact, privacy policy, terms of service, login,
  register. Uses the public `Header`/`Footer` chrome.
- **`app/` route group (`/app/*`)** — the Patient Portal, all 12 screens from
  `docs/02-ui-ux-design/04-screens-patient-dashboard.md`: dashboard, multi-step
  application wizard, case list, case detail (overview/documents/messages/itinerary/
  payments tabs), dependents, hotel and airport-transfer booking, payments, reviews,
  notifications, and settings. Uses a sidebar-navigation chrome
  (`components/portal/PortalSidebar.tsx` + `PortalTopBar.tsx`) per the design system,
  and renders as if already logged in as a demo patient (visibly labeled "Demo mode" in
  the top bar) — there is no real authentication yet, see below.
- **`hospital/` route group (`/hospital/*`)** — the Hospital Portal, 7 screens from
  `docs/02-ui-ux-design/05-screens-admin-ops-hospital.md`: dashboard (SLA-flagged
  incoming applications, booking/revenue snapshot), hospital profile, doctor roster,
  treatment packages, applications queue, application detail (with an
  accept/request-info/decline decision panel), and reports (conversion funnel). Uses its
  own sidebar chrome (`HospitalSidebar.tsx` + `HospitalTopBar.tsx`), scoped to a single
  demo hospital (Beijing United Family Hospital) — matching Business Rule BR-03's
  hospital-scoped access model, though the scoping itself is not yet enforced by any real
  backend.
- **`ops/` route group (`/ops/*`)** — the Operations Console, 3 screens from
  `docs/02-ui-ux-design/05-screens-admin-ops-hospital.md`: case queue (cross-hospital,
  filterable by My Cases/Urgent/Unassigned, SLA color-coded), ops case detail (internal
  notes not visible to patient/hospital, plus a driver/interpreter assignment panel), and
  the assignment board (unassigned-items alert, assign-from-dropdown). Uses its own
  sidebar chrome (`OpsSidebar.tsx` + `OpsTopBar.tsx`).

All four surfaces use the exact color/type tokens from
`docs/02-ui-ux-design/01-style-guide.md` and typed mock-data layers
(`apps/web/src/data/hospitals.ts`, `apps/web/src/data/patient.ts`,
`apps/web/src/data/hospitalStaff.ts`, `apps/web/src/data/opsConsole.ts`) standing in for
the backend.

**What this is:** a real, buildable, navigable product demonstrating the design system
and information architecture end to end for the public site, a patient's day-to-day
experience, a hospital staff member's application-review workflow, and internal
case-manager operations — good for stakeholder review and as the frontend shell to wire
up to a real backend.

**What this is not yet:** connected to any of the backend/database/auth architecture
described in `docs/03-architecture/`. Login/register are static UI only, the Application
Wizard and forms don't persist anywhere, the hospital Accept/Request-Info/Decline and ops
assignment dropdowns don't change any state, and the Admin console and Partner
(Driver/Interpreter/Hotel) portals (screens 47–59) are not built. Wiring the built
portals to a real backend and building the remaining ones is Phase 5's remaining scope,
and depends on Phase 4 (full folder structure) and Phase 6/7 (database/API) being
completed first per `docs/03-architecture/`.

Run locally: `cd apps/web && npm install && npm run dev`.
