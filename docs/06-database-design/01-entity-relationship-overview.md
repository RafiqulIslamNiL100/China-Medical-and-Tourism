# Entity-Relationship Overview

Implements the Prisma schema at `database/prisma/schema.prisma` (validated against
Prisma 6 — see that file's header comment). This document groups the 40 models into the
same module ownership defined in `docs/03-architecture/04-database-architecture.md` §3,
since a single all-tables diagram would be unreadable. Field-by-field detail and
FR-*/BR-* traceability is in `02-schema-reference.md`.

## 1. Core case-centric hub

Every module ultimately hangs off `Application` (the "case") — this is the object every
portal (Patient, Hospital, Ops) views through a different lens, per
`docs/01-product-planning/10-sitemap-navigation-ia.md` §5 ("case-centric structure").

```mermaid
erDiagram
    PATIENT ||--o{ APPLICATION : submits
    DEPENDENT }o--o{ APPLICATION : "on behalf of"
    HOSPITAL ||--o{ APPLICATION : receives
    DOCTOR o|--o{ APPLICATION : "assigned to"
    USER ||--o{ APPLICATION : "manages (case manager)"
    APPLICATION ||--o{ CASE_STATUS_HISTORY : has
    APPLICATION ||--o{ CASE_MESSAGE : has
    APPLICATION ||--o{ CASE_INTERNAL_NOTE : has
    APPLICATION ||--o{ DOCUMENT_CHECKLIST_ITEM : requires
    APPLICATION ||--o{ INVITATION_LETTER : has
    APPLICATION ||--o{ HOTEL_BOOKING : includes
    APPLICATION ||--o{ TRANSFER_REQUEST : includes
    APPLICATION ||--o{ INTERPRETER_ASSIGNMENT : includes
    APPLICATION ||--o{ INVOICE : bills
    APPLICATION ||--o| REVIEW : "may receive"
```

## 2. Auth & identity

Every operational role is a `User` row with a role-specific profile table — this keeps
authentication/authorization uniform (one `users` table, one login flow) while letting
each role carry its own fields without a wide, mostly-null `users` table.

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o| PATIENT : "is a"
    USER ||--o| HOSPITAL_STAFF : "is a"
    USER ||--o| DRIVER : "is a"
    USER ||--o| INTERPRETER : "is a"
    USER ||--o| HOTEL_PARTNER : "is a"
    HOSPITAL_STAFF }o--|| HOSPITAL : "works at"
    HOTEL_PARTNER ||--o{ HOTEL : owns
```

## 3. Hospital & catalog

`City` and `Specialty` are small, admin-editable lookup tables (per NFR-SCALE-01 — new
cities/specialties are data, not code) that both the Hospital directory and the
Doctor/TreatmentPackage catalog key off of.

```mermaid
erDiagram
    CITY ||--o{ HOSPITAL : "located in"
    HOSPITAL ||--o{ DEPARTMENT : has
    HOSPITAL ||--o{ DOCTOR : employs
    HOSPITAL ||--o{ TREATMENT_PACKAGE : offers
    HOSPITAL ||--o{ HOSPITAL_MODERATION_ITEM : "pending changes"
    SPECIALTY ||--o{ DOCTOR : "specializes in"
    SPECIALTY ||--o{ TREATMENT_PACKAGE : categorizes
```

## 4. Visa & documents

`DocumentChecklistItem.fileStorageKey` and `InvitationLetter.fileStorageKey` are
references into the private object-storage `documents` bucket
(`docs/03-architecture/06-storage-caching-search.md` §1) — the database never stores
file bytes, only access-controlled pointers to them.

```mermaid
erDiagram
    APPLICATION ||--o{ DOCUMENT_CHECKLIST_ITEM : requires
    APPLICATION ||--o{ INVITATION_LETTER : has
    USER ||--o{ DOCUMENT_CHECKLIST_ITEM : verifies
    USER ||--o{ INVITATION_LETTER : issues
```

## 5. Hotel & transport

```mermaid
erDiagram
    HOTEL_PARTNER ||--o{ HOTEL : owns
    CITY ||--o{ HOTEL : "located in"
    HOTEL ||--o{ HOTEL_ROOM_TYPE : offers
    HOTEL_ROOM_TYPE ||--o{ HOTEL_BOOKING : "booked as"
    APPLICATION ||--o{ HOTEL_BOOKING : includes
    DRIVER ||--o{ TRANSFER_REQUEST : fulfills
    APPLICATION ||--o{ TRANSFER_REQUEST : includes
    INTERPRETER ||--o{ INTERPRETER_ASSIGNMENT : fulfills
    APPLICATION ||--o{ INTERPRETER_ASSIGNMENT : includes
```

## 6. Payments & commissions

`CommissionRate` references either `hospitalId` or `hotelId` (never both) rather than a
single polymorphic foreign key, since Prisma/Postgres don't support true polymorphic
relations cleanly — the `partnerType` enum disambiguates which side is populated.

```mermaid
erDiagram
    APPLICATION ||--o{ INVOICE : bills
    INVOICE ||--o{ PAYMENT : "paid via"
    PAYMENT ||--o{ REFUND : "may have"
    USER ||--o{ REFUND : processes
    HOSPITAL ||--o{ COMMISSION_RATE : "rated at"
    HOTEL ||--o{ COMMISSION_RATE : "rated at"
```

## 7. Reviews, notifications, CMS, admin

```mermaid
erDiagram
    APPLICATION ||--o| REVIEW : "may receive"
    PATIENT ||--o{ REVIEW : writes
    HOSPITAL ||--o{ REVIEW : "reviewed on"
    USER ||--o{ REVIEW : moderates
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ NOTIFICATION_PREFERENCE : configures
    USER ||--o{ ARTICLE : authors
    USER ||--o{ AUDIT_LOG : "acts (logged)"
```

## Design notes carried over from the architecture doc

- **Soft deletes** (`deletedAt`) on `Application`, `DocumentChecklistItem`,
  `HotelBooking`, `TransferRequest`, `InterpreterAssignment`, `Invoice`,
  `CommissionRate`, and `Review` — anything that must remain recoverable/auditable per
  `docs/03-architecture/04-database-architecture.md` §5. Everything else uses normal
  deletion since it carries no compliance/dispute weight.
- **`AuditLog` is append-only** — no `deletedAt`, no `updatedAt`; the application layer
  must never issue `UPDATE`/`DELETE` against it, enforced by code review and, longer
  term, a database-level trigger or restricted role grant.
- **No cross-module direct writes.** Every foreign key crossing a module boundary
  (e.g., `Application.hospitalId → Hospital.id`) is a read reference; writes to a
  module's own tables happen only through that module's service layer, per
  `docs/03-architecture/03-backend-api-architecture.md` §2.
- **Row-level multi-tenancy**, not schema-per-tenant: `HospitalStaff.hospitalId`,
  `HotelPartner`→`Hotel.hotelPartnerId`, `Driver`/`Interpreter`→`userId` are the scoping
  columns a request-scoped context filters every query by (§8 of the backend
  architecture doc) — there is no per-tenant database or schema.
