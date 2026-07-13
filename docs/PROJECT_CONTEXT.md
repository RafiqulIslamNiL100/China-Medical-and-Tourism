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

*(Fixed conceptually in Phase 3, see `docs/03-architecture/03-backend-api-architecture.md`;
implemented as a full, linter-validated OpenAPI 3.0 spec in Phase 7 — see §16.)*

- REST, JSON, versioned under `/v1` (served from an `api.` subdomain in the spec's
  illustrative production server — revise if the eventual real deployment uses a
  path prefix like `/api/v1` on a shared domain instead).
- Authenticated routes require a bearer JWT; role scope enforced per endpoint, plus
  tenant-scoping for `hospital_staff`/`hotel_partner`/`driver`/`interpreter` roles.
- Resource naming: plural nouns (`/patients`, `/applications`, `/hospitals`), nested
  where ownership is clear (`/applications/{id}/documents`).
- Cursor-based pagination for high-growth lists; consistent `{ error: { code, message,
  details } }` error shape; `Idempotency-Key` header required for endpoints with external
  side effects (payments, invitation letters).
- Every mutating endpoint on a "case" object emits a notification event per
  FR-APP-08/FR-NOTIF-01, via the internal event bus (never direct provider calls from a
  business module).
- 84 operations across 12 modules are now fully specified — see §16 for the index.

## 9. Database Conventions

*(Fixed in Phase 3 conceptually, see `docs/03-architecture/04-database-architecture.md`;
implemented as a real, validated schema in Phase 6 — see §15. One convention below was
revised from the original Phase 3 placeholder to match what the actual schema does.)*

- PostgreSQL, single instance, accessed via Prisma; every schema change is a versioned,
  backward-compatible migration.
- Model/table names: Prisma-idiomatic PascalCase singular (`Application`, `Hospital`,
  `DocumentChecklistItem`), matching the actual Postgres identifiers Prisma generates
  by default — revised from the Phase 3 placeholder's `snake_case` plural guess, which
  the real schema doesn't follow. Prisma Client accessors are camelCase
  (`prisma.application.findMany()`).
- Every table: `id` (UUID), `createdAt`, `updatedAt`; soft-delete via `deletedAt` where
  records must be recoverable/auditable (e.g., `Application`, `DocumentChecklistItem`,
  `Invoice`, `Review`) rather than hard-deleted.
- Tables are owned by a single backend module (§5b); other modules never write directly
  into another module's tables — only through that module's service layer.
- Multi-tenancy via row-level scoping (`hospitalId` on `HospitalStaff`, `hotelPartnerId`
  on `Hotel`, etc.), not per-tenant databases/schemas.
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
| Phase 4 — Folder Structure | ✅ Complete — `apps/web` (frontend, §14), `database/` (Prisma schema + migrations + seed, §15), and `services/api` (NestJS backend, §17) all scaffolded as npm workspaces |
| Phase 5 — Module-by-module build | Frontend: all 59 screens from Phase 2 are built and navigable in `apps/web` across all 6 portals. Backend: all 12 modules from the OpenAPI spec are implemented with real persistence in `services/api` (see §17). Frontend↔backend wiring: auth, hospital directory, and the patient application flow are wired to the real API as a demonstrated vertical slice; the remaining screens still run on the mock data described in §14 (see §17 for the exact list) |
| Phase 6 — Database Design | ✅ Complete and **applied** — 40+ model Prisma schema (`database/prisma/schema.prisma`), 4 migrations run against a real local Postgres 16 instance, seed script loads realistic demo data (see §15) |
| Phase 7 — API Specification | ✅ Complete and **implemented** — 84-operation OpenAPI 3.0 spec (`api/openapi.yaml`, lint-validated); every operation is now backed by real NestJS controller/service code (see §17) |
| Phase 8 — Testing | No automated test suite yet. Every module was smoke-tested end-to-end via curl/Playwright against the real running API + database during implementation (see §17), but there is no repeatable `npm test` — this is the next real gap |
| Phase 9 — Deployment | Not started for the backend (`services/api` has no Dockerfile/CI/hosting config yet). The frontend has been manually deployed to Vercel by the user outside this workflow |

## 14. Current Implementation — `apps/web`

A working Next.js (App Router, TypeScript, Tailwind v4) implementation lives in
`apps/web/`. **All 59 screens from Phase 2 are built and navigable**, split across six
route groups so each surface gets the right chrome:

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
- **`admin/` route group (`/admin/*`)** — the Admin Console, 8 screens from
  `docs/02-ui-ux-design/05-screens-admin-ops-hospital.md`: platform analytics dashboard
  (KPIs, conversion funnel, hospital leaderboard), user &amp; role management, hospital
  listing moderation, review moderation, finance (commission rates + transaction
  ledger), CMS (article publish status), audit log (read-only, immutable per BR-30), and
  platform settings (locales, SLA thresholds, templates). Uses its own sidebar chrome
  (`AdminSidebar.tsx` + `AdminTopBar.tsx`).
- **`partner/` route group (`/partner/*`)** — the three Partner Portals, 5 screens from
  `docs/02-ui-ux-design/06-screens-partner-portals.md`: Hotel Partner (dashboard,
  inventory & rates, bookings with confirm/reject) with its own sidebar chrome
  (`HotelPartnerSidebar.tsx` + `HotelPartnerTopBar.tsx`), and Driver ("My Trips") /
  Interpreter ("My Appointments") — both deliberately single-screen, mobile-first apps
  using a lightweight shared `SimplePartnerHeader.tsx` rather than a full sidebar, per
  the design spec's emphasis on one-handed, on-the-go use for those roles.

All six surfaces use the exact color/type tokens from
`docs/02-ui-ux-design/01-style-guide.md`. Most screens still read from the typed
mock-data layers (`apps/web/src/data/hospitals.ts`, `apps/web/src/data/patient.ts`,
`apps/web/src/data/hospitalStaff.ts`, `apps/web/src/data/opsConsole.ts`,
`apps/web/src/data/admin.ts`, `apps/web/src/data/partner.ts`); a specific subset (below)
now reads from the real backend instead.

**What this is:** a real, buildable, navigable product demonstrating the design system
and full information architecture end to end — the public site, a patient's day-to-day
experience, a hospital staff member's application-review workflow, internal
case-manager operations, platform administration, and every partner role's task
surface. Every one of the 59 screens specified in Phase 2 exists and renders correctly.

**Wired to the real backend (`services/api`, §17), as of this update:**
- `src/lib/api.ts` — a typed fetch client for the real API, and `src/lib/auth-client.tsx`
  — a client-side `AuthProvider`/`useAuth()` React context that stores the JWT access/
  refresh token pair in `localStorage` (a pragmatic simplification for this vertical
  slice — a production build would use httpOnly cookies) and exposes `login`,
  `register`, `verifyEmail`, `logout`.
- `/login` and `/register` (with an inline OTP-verification step) call the real
  `/auth/*` endpoints and store real tokens on success.
- `/hospitals` and `/hospitals/[slug]` are server components that fetch the real,
  seeded hospital/doctor/package/review data from `GET /hospitals`,
  `GET /hospitals/{id}/{doctors,packages,reviews}` — no more static hospital list.
- The Patient Portal's `/app/apply` wizard (`ApplicationWizard.tsx`) fetches real,
  specialty-filtered hospitals for its dropdown and submits via a real
  `POST /applications` call using the logged-in patient's access token.
- `/app/cases` (My Applications) is a client component that calls the real
  `GET /applications` and renders the logged-in patient's actual cases, correctly
  split across the Active/Completed/Declined tabs.
- All of the above was verified with a real Playwright browser session against the
  seeded `amara.nwosu@example.com` account (see §17) — not just a build check.

**Still on mock data — deliberately out of scope for this pass:** every other screen
across all six portals (hospital staff, ops console, admin console, all three partner
portals, and the rest of the patient portal — dependents, documents, messages,
itinerary, payments, notifications, reviews). This was an explicit scoping decision
("a demonstrated vertical slice," not "wire all 59 screens") — the backend already
implements every one of these screens' endpoints (§17), so wiring the remaining screens
is now a mechanical repeat of the same pattern (`src/lib/api.ts` call + real
`accessToken` from `useAuth()`), not new backend work.

Run locally: `cd apps/web && npm install && npm run dev` (also start `services/api`,
see §17, and set `NEXT_PUBLIC_API_BASE_URL` per `apps/web/.env.example`).

## 15. Database — `database/`

Phase 6 (Database Design) is complete: a full, Prisma-validated schema lives at
`database/prisma/schema.prisma` — 40 models covering every module identified in
`docs/03-architecture/04-database-architecture.md` §3 (Auth, Patient, Hospital,
Booking, Visa, Hotel, Transport, Payment, CMS, Reviews, Notification, Admin).

- ERD (grouped by module, since one all-tables diagram isn't readable):
  `docs/06-database-design/01-entity-relationship-overview.md`
- Field-by-field reference with FR-\*/BR-\* traceability:
  `docs/06-database-design/02-schema-reference.md`
- Setup/usage: `database/README.md`

**Validated and applied.** `npx prisma validate` passes (Prisma 6 — see the note in §9
about Prisma 7's breaking config change), and the schema has been migrated onto a real
local Postgres 16 instance via 4 migrations in `database/prisma/migrations/`
(the Phase 6 baseline plus 3 evolutions made during backend implementation: OTP/
password-reset storage, `Refund.idempotencyKey`). `@prisma/client` is generated into
the shared workspace `node_modules` and consumed directly by `services/api` (§17).

**Demo data:** `database/prisma/seed.js` (`npm run seed` from `database/`, or
`node prisma/seed.js`) seeds realistic data that mirrors the frontend's mock content —
the same 3 hospitals, doctors, and treatment packages as
`apps/web/src/data/hospitals.ts`, the same patient (Amara Nwosu, with 3 cases in
different statuses matching `apps/web/src/data/patient.ts`) plus 3 more patients, a
hotel, a driver, an interpreter, published articles, commission rates, and platform
settings — so the two layers describe the same demo world even before every screen is
wired up. All demo accounts share the password `Passw0rd!23`; the script is idempotent
(skips if a `Hospital` row already exists) and prints the full account list on success.

## 16. API Specification — `api/`

Phase 7 (API Specification) is complete: `api/openapi.yaml` is a full OpenAPI 3.0.3
document — 84 operations across the 12 modules from §5b/§15, request/response schemas
mirroring the Prisma models, and every operation traced back to the `FR-*`/`BR-*`/
Screen it implements. Lint-validated with Redocly (`npx @redocly/cli lint
api/openapi.yaml`) — 0 errors; the 65 remaining warnings are documented, deliberate
non-fixes (see `docs/07-api-specification/01-api-overview.md` §4), not oversights.

- Overview, conventions, and explicitly-flagged design decisions:
  `docs/07-api-specification/01-api-overview.md`
- Full endpoint table by module (auto-generated from the spec, so it can't drift out
  of sync the way a hand-maintained table would):
  `docs/07-api-specification/02-endpoint-reference.md`
- Preview interactively: `npx @redocly/cli preview-docs api/openapi.yaml` from the
  repo root.

**Specified and implemented.** Every operation in this spec is now served by real
NestJS code in `services/api` — see §17 for what "real" means module by module, and
which pieces are deliberately adapter/stand-in implementations pending real
credentials (payment processor, S3, email/SMS provider).

## 17. Backend Implementation — `services/api`

A NestJS 10 service implementing the full `api/openapi.yaml` spec against the Phase 6
Prisma schema, running on a real local Postgres 16 instance (no Docker — this sandbox
has no daemon, but Postgres ships as a system package and works directly). All 12
OpenAPI modules are implemented as NestJS modules with real database-backed services,
not stubs: Auth, Patients, Hospitals, Applications, Documents, Hotels, Transport,
Payments, Reviews, Notifications, CMS, Admin.

**Real, not mocked:**
- **Auth** — argon2 password hashing, email-OTP verification (`otplib` for the actual
  2FA TOTP path), JWT access tokens (15 min) + rotating refresh tokens (30 days,
  SHA-256-hashed in a `Session` table) with reuse detection (a replayed refresh token
  revokes the session), and password reset. Verified end-to-end via curl including the
  negative case (a reused refresh token is correctly rejected).
- **Authorization** — a global `JwtAuthGuard` (default-deny, `@Public()` opt-out) and
  `RolesGuard` (`@Roles()`), plus role-scoped data access enforced in the *service*
  layer, not just route guards — e.g. a patient can only see their own cases, hospital
  staff are scoped to their own hospital via their `HospitalStaff` row, case managers/
  admins see cross-hospital data. Verified with real negative-permission tests (e.g. a
  patient calling an endpoint that requires `case_manager` correctly gets 403).
- **Business rules enforced in code, not just spec text** — BR-14 (accepting a case
  auto-creates a booking-deposit invoice), BR-17 (an invitation letter can't be
  generated until the case is Accepted *and* the deposit is Paid — checked explicitly,
  not assumed), BR-20 (one review per completed case, enforced via a DB unique
  constraint plus a service-level check), BR-23 (only case_manager/admin can assign a
  driver), idempotent payments and refunds via a required `Idempotency-Key` header
  (real replay-safe behavior verified: the same key returns the same Payment/Refund
  instead of double-charging or double-refunding).
- **Cross-module workflows**, not isolated CRUD — accepting an application creates the
  visa document checklist and the deposit invoice in the same transaction; paying an
  invoice notifies the assigned case manager and updates the admin dashboard's revenue
  figure live; moderating a review notifies the patient and makes it visible on the
  public hospital page.
- **Append-only audit log** (`AuditLog`, NFR-SEC-07/BR-30) — `AuditService` only ever
  `INSERT`s; there is deliberately no update/delete method, matching that no
  write/delete endpoint for it exists in the OpenAPI spec.

**Real adapters standing in for infrastructure this sandbox doesn't have credentials
for** — each is a single small class behind the interface the rest of the code calls,
documented in-code as swappable for the real thing without touching any caller:
- `StorageService` — saves uploaded files to local disk (`.data/documents/`) instead of
  S3; `resolveDownloadUrl()` returns an API path instead of a signed URL.
- `NotificationService` — always writes the real, queryable in-app `Notification` row
  (this part is not mocked), and console-logs an "email" instead of calling
  Resend/Twilio. Now also checks `NotificationPreference` before sending (FR-NOTIF-04),
  defaulting to enabled when no preference row exists.
- `MockPaymentProcessor` — the token `"tok_decline"` is a documented test hook that
  simulates a processor decline (exercising the real `402` path); any other token
  "succeeds." No real card data ever flows through this — the spec's
  `paymentMethodToken` field is designed to only ever carry an opaque tokenized
  reference from a real client-side SDK in production.
- Payment receipts (`GET /invoices/{id}/receipt`) are served as plain text, not PDF —
  no PDF-rendering library is available in this environment. The response is honestly
  labeled as a development placeholder rather than mislabeled as `application/pdf`.

**Known, accepted gaps:**
- No automated test suite (`npm test`) — verification so far is thorough manual/curl/
  Playwright smoke testing across every module (documented per-module above), not a
  repeatable CI-gated suite.
- `npm audit` on `services/api` shows 24 vulnerabilities, all in dev-only build tooling
  (`@nestjs/cli`'s transitive deps — webpack, inquirer, tmp), not runtime dependencies;
  fixing requires a `@nestjs/cli` v10→v11 major bump, deliberately deferred rather than
  done reflexively.
- No CI pipeline yet. A production `Dockerfile` (`services/api/Dockerfile`) and a real
  `GET /health` endpoint (`{status, timestamp}`, checks DB connectivity, excluded from
  the `/v1` prefix so it matches most hosts' default health-check path) now exist and
  were verified locally by running the exact commands the container runs — `npm run
  build --workspace=services/api`, `prisma migrate deploy` (confirmed idempotent), and
  `node services/api/dist/main.js` from the repo root — but the image itself has not
  been Docker-built or deployed anywhere (no Docker daemon in this sandbox). See
  `DEPLOYMENT.md` at the repo root for the actual deploy steps (Railway or equivalent)
  and the honest list of what's still mocked once it's live (ephemeral local-disk
  storage, mock payment processor).
- Frontend wiring is a deliberately scoped vertical slice (auth + hospitals +
  application flow), not all 59 screens — see §14 for the exact list of what's wired
  versus still on mock data.

Run locally: `cd database && npm run seed` (after `npm run migrate:dev` — see
`database/README.md`), then `cd services/api && npm install && npm run start:dev`. The
API listens on `http://localhost:3001/v1`.
