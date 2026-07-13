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
| Phase 5 — Module-by-module build | ✅ Complete — all 59 screens from Phase 2 are built, navigable, and **wired to the real API** in `apps/web` across all 6 portals (patient, hospital staff, ops, admin, and the three partner roles). No screen still reads static mock data (see §14). Backend: all 12 modules from the OpenAPI spec are implemented with real persistence in `services/api`, plus a handful of cross-portal support endpoints the frontend wiring uncovered a need for (see §17) |
| Phase 6 — Database Design | ✅ Complete and **applied** — 40+ model Prisma schema (`database/prisma/schema.prisma`), migrations run against a real local Postgres 16 instance, seed script loads realistic demo data (see §15) |
| Phase 7 — API Specification | ✅ Complete and **implemented** — 90+-operation OpenAPI 3.0 spec (`api/openapi.yaml`, lint-validated); every operation is backed by real NestJS controller/service code (see §17) |
| Phase 8 — Testing | A lightweight, zero-dependency end-to-end smoke test (`services/api/test/smoke.mjs`, run via `npm test`) exercises the real HTTP API — register→OTP→verify→login→hospitals→apply→list — and runs in CI (see §17). Still no unit/integration test suite for business logic — the next real gap |
| Phase 9 — Deployment | Backend has a production `Dockerfile`, a `/health` endpoint, and has been manually deployed to Railway by the user, following `DEPLOYMENT.md`. Frontend is deployed to Vercel and points at the live backend. GitHub Actions CI (`.github/workflows/ci.yml`) runs on every push (see §17–18) |

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
`docs/02-ui-ux-design/01-style-guide.md`. The typed mock-data layers
(`apps/web/src/data/hospitals.ts`, `apps/web/src/data/patient.ts`,
`apps/web/src/data/hospitalStaff.ts`, `apps/web/src/data/opsConsole.ts`,
`apps/web/src/data/admin.ts`, `apps/web/src/data/partner.ts`) still exist in the repo
(some components — e.g. the `cities`/`hospitals` static lists used for dropdown seed
data — still reference small non-account-specific parts of them), but no screen renders
account-specific data from them anymore; every screen fetches from the real API.

**What this is:** a real, buildable, navigable, end-to-end product — the public site, a
patient's day-to-day experience, a hospital staff member's application-review workflow,
internal case-manager operations, platform administration, and every partner role's
task surface, all backed by the real database through the real API. Every one of the 59
screens specified in Phase 2 exists, renders correctly, and reads/writes real data.

**Wired to the real backend (`services/api`, §17):**
- `src/lib/api.ts` — a single typed fetch client covering every operation in
  `api/openapi.yaml` (~70 exported functions), and `src/lib/auth-client.tsx` — a
  client-side `AuthProvider`/`useAuth()` React context that stores the JWT access/
  refresh token pair in `localStorage` (a pragmatic simplification — a production build
  would use httpOnly cookies) and exposes `login`, `register`, `verifyEmail`, `logout`.
- `src/lib/portal.tsx` — shared portal helpers: `RequireRole` (client-side route guard,
  redirects anonymous visitors to `/login` and shows a clear message on a role
  mismatch — the real security boundary is still enforced server-side per request),
  plus `fmtDate`/`fmtDateTime`/`fmtMoney`/`statusLabel`/`slaRiskFor`.
- **Public site** — `/login`, `/register` (with inline OTP verification), `/hospitals`,
  `/hospitals/[slug]` all call the real `/auth/*` and `/hospitals/*` endpoints.
- **Patient Portal (`/app/*`)** — dashboard, application wizard, case list, case detail
  (documents upload/download, messages, invoices/pay, real itinerary from hotel
  bookings + transfers), dependents, hotel and transfer booking, payments, reviews,
  notifications (with mark-read), and settings (profile + notification preferences) all
  call the real API.
- **Hospital Portal (`/hospital/*`)** — dashboard, applications queue, application
  detail (real Accept/RequestInfo/Decline decisions with treatment plan and cost
  estimate), doctors and packages (list + add), profile (submits a moderation change
  request, doesn't apply instantly — matches the real BR-03 approval workflow), and
  reports.
- **Ops Console (`/ops/*`)** — case queue (My Cases/Urgent/Unassigned/All, via the
  `view` query param), case detail (internal notes, reassign to another case manager,
  per-case driver/interpreter assignment), and a cross-case assignment board.
- **Admin Console (`/admin/*`)** — platform dashboard (real KPIs + top-rated
  hospitals), users & roles (invite, activate/deactivate), hospital listing moderation
  (approve/reject), review moderation (approve/redact/reject), finance (commission
  rates + transaction ledger), CMS (all articles including drafts, publish/unpublish),
  audit log (with CSV export), and platform settings (key/value editor over the real
  `PlatformSetting` table).
- **Partner Portals (`/partner/*`)** — Hotel Partner (dashboard, inventory & rates,
  bookings with confirm/reject), Driver "My Trips" (assigned transfers with
  mark-complete and call-patient), Interpreter "My Appointments" (assigned hospital
  visits with mark-complete). All three now have a `RequireRole` gate, which they
  didn't before.
- Verified end to end: `npx tsc --noEmit` and `npx next build` both pass clean for the
  whole app; the backend endpoints these screens depend on were exercised directly
  (curl, against a locally running server with real seeded accounts for every role) as
  each portal was wired, not just build-checked.

**Cross-portal backend endpoints added while wiring the frontend** (i.e., gaps the
Phase 7 spec didn't anticipate until a real screen needed them — see §17 for the full
list): `GET /hospitals/mine`, `GET /hotels/mine`, `GET /hotel-bookings/me`,
`GET /drivers`, `GET /interpreters`, `GET /applications/case-managers`,
`GET /assignment-board`, `GET /admin/articles`, plus `patientName`/`patientCountry` on
`GET /applications/{id}` and denormalized patient/hospital context on
`GET /drivers/me/trips` and `GET /interpreters/me/appointments` (both roles can't call
`GET /applications/{id}` directly, so the case context is pre-joined server-side).

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
document — 90+ operations across the 12 modules from §5b/§15 (the original 84 plus a
handful of cross-portal support endpoints added during frontend wiring, see §14/§17),
request/response schemas mirroring the Prisma models, and every operation traced back
to the `FR-*`/`BR-*`/Screen it implements. Lint-validated with Redocly
(`npx @redocly/cli lint api/openapi.yaml`) — 0 errors; the 73 remaining warnings are
documented, deliberate non-fixes (see `docs/07-api-specification/01-api-overview.md`
§4), not oversights.

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

**Security hardening (production-grade, not deferred):**
- `helmet()` on every response, `app.set("trust proxy", 1)` for correct client IPs
  behind a PaaS reverse proxy.
- `@nestjs/throttler` — global rate limit (100 req/min per IP) via `APP_GUARD`, plus a
  stricter override on `/auth/*` (10 req/min) since those are the highest-value targets
  for brute-force/credential-stuffing.
- CORS allowlist via the `CORS_ORIGINS` env var (comma-separated exact origins);
  defaults to allow-all only when unset, so local dev isn't broken by default but
  production deploys are expected to lock it down (see `DEPLOYMENT.md`).
- Demo account passwords now come from `SEED_DEMO_PASSWORD` (falls back to the
  documented `Passw0rd!23` default) — `database/prisma/rotate-demo-passwords.js` is a
  standalone script to re-hash all demo passwords and revoke their sessions in one
  transaction, for use before treating any deployed database as real.

**Real adapters, credential-gated (not mocked when configured):**
- `EmailService` — real transactional email via Resend (`resend` npm package) when
  `RESEND_API_KEY` is set; falls back to the original console-log behavior when it
  isn't, so nothing breaks if the key is absent. `NotificationService` resolves the
  recipient's real email from the `User` table before sending.
- `StorageService` — S3-compatible storage (AWS SDK v3, `@aws-sdk/client-s3` +
  `s3-request-presigner`) when all four `S3_*` env vars are set (works with AWS S3,
  Cloudflare R2, Railway Buckets, or MinIO via `S3_ENDPOINT`), including presigned
  15-minute download URLs; falls back to the original local-disk adapter when unset.
  Neither this repo nor this environment has real S3/R2 credentials, so this remains
  unexercised against a real bucket — the code path is written and build-verified, not
  live-verified.
- `MockPaymentProcessor` — unchanged from Phase 5; still the only payment path (no
  Stripe account exists to integrate against). The token `"tok_decline"` is a
  documented test hook that simulates a processor decline (exercising the real `402`
  path); any other token "succeeds." No real card data ever flows through this — the
  spec's `paymentMethodToken` field is designed to only ever carry an opaque tokenized
  reference from a real client-side SDK in production.
- Payment receipts (`GET /invoices/{id}/receipt`) are still served as plain text, not
  PDF — no PDF-rendering library is available in this environment. The response is
  honestly labeled as a development placeholder rather than mislabeled as
  `application/pdf`.

**Testing & CI:**
- `services/api/test/smoke.mjs` — a zero-dependency (no test framework) end-to-end
  smoke test. Spawns the built server against a real Postgres, polls `/health`, then
  drives register→OTP(captured from the email dispatch log)→verify→`/me`→bad-login-401→
  hospitals→create-application→list-applications, cleaning up what it created. Run via
  `npm test` from `services/api`. 9/9 checks pass.
- `.github/workflows/ci.yml` — two jobs on every push/PR: `web` (typecheck + build for
  `apps/web`) and `api` (spins up a real Postgres 16 service container, runs
  `prisma migrate deploy`, seeds, builds, and runs the smoke test above for
  `services/api`).
- Still no unit/integration test suite for individual business-logic functions — the
  smoke test is a real but shallow end-to-end check, not a substitute for one. This
  remains the most significant testing gap.
- `npm audit` on `services/api` shows vulnerabilities confined to dev-only build
  tooling (`@nestjs/cli`'s transitive deps — webpack, inquirer, tmp), not runtime
  dependencies; fixing requires a `@nestjs/cli` v10→v11 major bump, deliberately
  deferred rather than done reflexively.

**Deployment:** a production `Dockerfile` (`services/api/Dockerfile`, multi-stage,
workspace-aware) and `GET /health` (`{status, timestamp}`, checks DB connectivity,
excluded from the `/v1` prefix) exist and have been used for a real deployment — the
user deployed `services/api` to Railway and `apps/web` to Vercel following
`DEPLOYMENT.md`, confirmed via a live `/health` check and a real login attempt against
the deployed backend. See `DEPLOYMENT.md` for the exact steps and the honest list of
what's still gated on missing credentials (S3/R2 bucket, Stripe account).

**Cross-portal endpoints added during frontend wiring** (Phase 5, once every screen —
not just the original vertical slice — needed real data; see §14 for which screens use
each):
- `GET /hospitals/mine`, `GET /hotels/mine`, `GET /hotel-bookings/me` — "my own X"
  endpoints for hospital staff, hotel partners, and patients respectively, scoped
  server-side to the caller's own hospital/hotel/account (route-ordering note: each was
  registered before its sibling `:id` route so the literal `mine`/`me` segment isn't
  captured as a path parameter).
- `GET /drivers`, `GET /interpreters` — directory endpoints (case_manager/admin only)
  for the ops assignment board and reassign pickers.
- `GET /applications/case-managers` — active case-manager directory for the ops
  console's reassign picker (case_manager/admin only).
- `GET /assignment-board` — all open transfers and interpreter sessions across every
  case (not just one), for the ops console's cross-case assignment board
  (case_manager/admin only).
- `GET /admin/articles` — all CMS articles including drafts (admin only); the existing
  public `GET /articles` intentionally excludes drafts, so the admin CMS console needed
  its own listing.
- `GET /applications/{id}` now also returns `patientName`/`patientCountry` (resolved
  from the patient or dependent record) — hospital staff and case managers reviewing a
  case need to know who they're reviewing, which the bare `Application` record (only a
  `patientId`) didn't expose.
- `GET /drivers/me/trips` and `GET /interpreters/me/appointments` now return
  denormalized `refNumber`/`patientName`/(`patientPhone`|`hospitalName`) per record —
  drivers and interpreters aren't authorized to call `GET /applications/{id}` directly
  (that endpoint is scoped to patient/hospital_staff/case_manager/admin), so the case
  context they need for their own assigned work is pre-joined server-side instead.
- `GET /hotels` (search) now includes each hotel's `roomTypes` in the response, so the
  patient booking flow can show room options without an extra round trip per hotel.

Run locally: `cd database && npm run seed` (after `npm run migrate:dev` — see
`database/README.md`), then `cd services/api && npm install && npm run start:dev`. The
API listens on `http://localhost:3001/v1`.

## 18. Production Readiness Checklist

Everything below is either done, or the exact remaining step and why it hasn't been
done in this environment — not a vague "needs more work."

**Done:**
- [x] All 59 screens across all 6 portals wired to the real API (§14).
- [x] Real authentication (argon2, JWT, refresh rotation, OTP email verification).
- [x] Real authorization (role guards + service-layer row-level scoping, not just UI).
- [x] Rate limiting, CORS allowlist, helmet security headers.
- [x] Real transactional email via Resend (credential-gated, degrades gracefully).
- [x] Real S3-compatible storage adapter written and build-verified (credential-gated).
- [x] Append-only audit log for sensitive actions.
- [x] Idempotent payment/refund endpoints (`Idempotency-Key` header).
- [x] Production Dockerfile, `/health` endpoint, and a real deployment (Railway +
      Vercel) that the user has verified live.
- [x] End-to-end smoke test + GitHub Actions CI on every push.
- [x] Demo-password rotation script, ready to run against a production database.

**Requires a real credential this environment cannot obtain — code is ready, activation
is a config change, not a rewrite:**
- [ ] **Real payment processing.** Needs a live Stripe (or equivalent) account.
      `MockPaymentProcessor` implements the same interface a real one would — swapping
      it in means implementing `charge()`/`refund()` against the real SDK and setting
      the resulting API keys as env vars, not restructuring the payments module.
- [ ] **Persistent file storage.** Needs a real S3/R2/MinIO bucket + access keys.
      `StorageService` already supports this — set the four `S3_*` env vars documented
      in `DEPLOYMENT.md` and it activates with no code changes.

**Operational steps for whoever runs the production deployment (not code changes):**
- [ ] Run `database/prisma/rotate-demo-passwords.js` against the production database,
      or delete the seeded demo accounts, before treating it as holding real patient
      data.
- [ ] Set `CORS_ORIGINS` on the production backend to the exact frontend domain(s)
      once the deployment is stable (left unset = allow-all, fine for initial setup
      only).
- [ ] Rotate `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` to values generated with
      `openssl rand -hex 32` if the deployment ever used the repo's dev placeholders.
- [ ] Decide on a real PDF-generation approach for payment receipts (currently plain
      text) if that's a real product requirement, not just a demo gap.

**Deliberately out of scope for this project as an AI-built demonstration, regardless
of environment:**
- A real business entity, medical-licensing compliance review, and legal review of the
  privacy policy / terms of service (both are explicitly marked draft — see §4).
- SMS/OTP via a real provider (Twilio or similar) — email OTP is fully real; SMS was
  never implemented, only specified in the architecture docs (§5).
