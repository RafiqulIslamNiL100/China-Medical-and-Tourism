# Schema Reference

Field-by-field reference for `database/prisma/schema.prisma`, grouped by module
ownership. Every table maps to a functional requirement (`FR-*`) or business rule
(`BR-*`) from Phase 1 — this doc cross-references them so the schema and the
requirements stay mutually traceable as the platform grows, per
`docs/PROJECT_CONTEXT.md` §10.

## Auth module

### `User`
The single identity table for every role (`docs/03-architecture/05-auth-security-architecture.md`
§1–2). `passwordHash` uses Argon2id (NFR-SEC-04); `twoFactorSecret` is populated only
for roles where 2FA is mandatory (`hospital_staff`, `case_manager`, `admin`, per
FR-AUTH-05). Exactly one of the `*Profile` back-relations is populated, matching `role`
— enforced at the application layer, not the database (Prisma/Postgres can't express
"exactly one of these relations exists" as a constraint).

### `Session`
Refresh-token rotation (`05-auth-security-architecture.md` §1) — `refreshTokenHash` is
unique so token reuse after rotation is detectable and the session set revocable.

## Patient module

### `Patient` / `Dependent`
FR-AUTH-06 (dependent profiles). `passportNumberEncrypted` holds an application-layer
envelope-encrypted value, not plaintext (NFR-SEC-02) — the database column is just
opaque ciphertext.

## Hospital module

### `City` / `Specialty`
Small reference tables, not enums, specifically so Admins can add a new destination
city or specialty as a data change (Screen 54, Platform Settings) without a code
deploy — satisfying NFR-SCALE-01.

### `Hospital`
`status` (`Draft` → `PendingApproval` → `Published`) implements FR-HOSP-05 ("not
publicly visible until approved"). `accreditations`, `languages`, `facilities` are
native Postgres string arrays rather than join tables — deliberately under-normalized
since these are small, hospital-authored lists with no independent identity or query
need of their own (no "find all hospitals sharing an accreditation" feature exists).

### `HospitalStaff`
The tenant-scoping row for BR-03 ("Hospital Staff accounts are scoped to a single
hospital") — every hospital-portal query filters by this row's `hospitalId` via the
request-scoped context described in `03-backend-api-architecture.md` §8.

### `Department`, `Doctor`, `TreatmentPackage`
FR-HOSP-02/03/04. `Doctor.slug` is unique per hospital (`@@unique([hospitalId, slug])`),
not globally, since two different hospitals may reasonably both employ a "Dr. Li Wei."

### `HospitalModerationItem`
Screen 49 (Hospital Listing Moderation) — a pending-change queue rather than a full
diff/versioning system; `changeSummary` is a human-readable description an Admin
approves or rejects. A production implementation may later store a structured before/
after diff instead of prose.

## Booking module

### `Application`
The case-centric hub (§1 of the ERD doc). `refNumber` is the human-facing
`CMT-YYYY-NNNN` identifier shown throughout the UI; `id` (UUID) is the internal key.
`status` is the fixed six-value enum from `docs/PROJECT_CONTEXT.md` §10 — extend it
deliberately, never introduce ad hoc values. `caseManagerUserId` is nullable because a
case has no assigned case manager until FR-APP-05's auto-assignment fires on
acceptance.

### `CaseStatusHistory`
The audit trail backing the Status Timeline component (Design System §1) — one row per
transition, distinct from the append-only `AuditLog` (that one is compliance-wide;
this one is case-specific and patient-visible).

### `CaseMessage`
FR-APP-07 (in-app messaging). `readAt` supports unread-count badges without a separate
read-receipts table.

### `CaseInternalNote`
Screen 45 (Ops Case Detail) — explicitly never joined into any patient- or
hospital-facing query. This is a schema-level expression of "internal notes are never
shown to the patient or hospital" (the UI copy on that screen): the table is simply
absent from every non-Ops query path.

## Visa module

### `DocumentChecklistItem`
FR-VISA-01/04. `fileStorageKey` (not a URL) is a reference the backend resolves to a
short-lived signed URL at request time (`06-storage-caching-search.md` §1) — never a
long-lived direct link stored in the database.

### `InvitationLetter`
FR-VISA-02/03. `templateVersion` records which invitation-letter template generated
the document, so a later template correction doesn't retroactively misrepresent
already-issued letters.

## Hotel module

### `HotelPartner` / `Hotel` / `HotelRoomType` / `HotelBooking`
FR-HOTEL-01 through 05. A `HotelPartner` (the login/tenant) can own multiple `Hotel`
properties — modeling a partner that manages several hotels under one account, not
just a 1:1 partner-to-hotel assumption. `HotelBooking.applicationId` is nullable
because a hotel can theoretically take bookings unrelated to a CMT case in a full
multi-sided marketplace, though the current product only exposes case-linked booking.

## Transport module

### `Driver` / `Interpreter` / `TransferRequest` / `InterpreterAssignment`
FR-XFER-01 through 04, FR-INTERP-01 through 03. Both assignment tables share the same
`ServiceAssignmentStatus` enum (`Requested → Assigned → Completed`/`Cancelled`) since
they're structurally the same workflow (Business Rules §7) — a driver/interpreter is
optionally assigned by a Case Manager, then marks their own work complete.

## Payment module

### `Invoice` / `Payment` / `Refund`
FR-PAY-01 through 05. `Payment.providerRef` plus the `@@unique([provider, providerRef])`
constraint is the idempotency mechanism referenced in
`03-backend-api-architecture.md` §3 — a retried payment webhook can't double-record a
charge. `Invoice` and `Payment` are separate (not merged) because BR-14/BR-15's
deposit-then-balance schedule means one invoice can be satisfied by zero, one, or more
payments over time.

### `CommissionRate`
FR-PAY-06/BR-13. Modeled with nullable `hospitalId`/`hotelId` plus a `partnerType`
discriminator rather than a single polymorphic partner reference, since Prisma has no
native polymorphic-relation support — the discriminator plus a `CHECK`-style
application-layer invariant ("exactly one of hospitalId/hotelId is set per
partnerType") stands in for it.

## CMS module

### `Article` / `DestinationGuide`
FR-CMS-01/02. `Article.status` (`Draft`/`Published`) plus `publishedAt` supports the
CMS moderation-free-but-staff-only-visible workflow described in Screen 52.

## Reviews & Trust

### `Review`
FR-REVIEW-01 through 03, BR-20/21/22. `applicationId` is `@unique` — enforcing
"one review per completed case" at the schema level, not just in application logic,
directly implementing BR-20. `status` (`Pending → Approved`/`Rejected`/`Redacted`)
implements the moderation queue (Screen 50).

## Notification module

### `Notification` / `NotificationPreference`
FR-NOTIF-01 through 04. `NotificationPreference` is keyed `@@unique([userId, category])`
so each user has at most one preference row per notification category (e.g.,
"Messages", "Payment Reminders") — matching the per-category channel toggle UI on
Screen 36/Settings.

## Admin module

### `AuditLog`
NFR-SEC-07, BR-30. Deliberately denormalized (`actorLabel`, `targetLabel` alongside the
FK IDs) so a log entry remains meaningful even if the referenced user or record is
later deleted — an audit trail that goes blank when its subject is removed defeats the
purpose. This table is append-only by convention; enforcing that at the database level
(e.g., a restricted grant or trigger) is a Phase 9 (Deployment) hardening step, not yet
implemented here.

### `PlatformSetting`
Screen 54. A simple key/JSON-value store for SLA thresholds, supported locales, and
template configuration — deliberately schemaless per-setting since these are
admin-editable, low-volume, and heterogeneous in shape (a locale list vs. an SLA
duration vs. a template body don't share a useful common column layout).

## What Phase 6 does not yet cover

- **Full-text/trigram search indexes** for the hospital directory (FR-HOSP-06) —
  `06-storage-caching-search.md` §3 specifies Postgres full-text search at launch, but
  the actual `tsvector` columns and GIN indexes aren't in this schema yet; add them
  when the search implementation is built, not speculatively now.
- **Actual database migrations** — no `prisma migrate dev` has been run against a real
  Postgres instance yet (see `database/README.md`); this schema is validated for
  syntax/relational correctness but not yet applied to a live database.
- **Row-level security policies** — the multi-tenancy model (§ design notes,
  `01-entity-relationship-overview.md`) is enforced by the application's request-scoped
  query context today; Postgres RLS policies as defense-in-depth are a candidate
  hardening step for Phase 9, not implemented here.
