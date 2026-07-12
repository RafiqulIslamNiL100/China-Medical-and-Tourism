# Database Architecture

*(Full entity-relationship schema and field-level design is produced in Phase 6 —
Database Design. This document fixes the platform/topology decisions Phase 6 builds on.)*

## 1. Engine

**PostgreSQL** (managed instance — e.g., RDS/Cloud SQL-equivalent — not self-managed at
launch, to offload backup, patching, and failover to the provider).

Rationale: the domain is heavily relational and transactional (a single "case" spans
patient, hospital, visa, hotel, transfer, and payment records that must stay
consistent); Postgres's maturity, JSONB support (for flexible fields like structured
medical-history answers), and strong ecosystem (Prisma support, extensions) fit better
than a NoSQL primary store here.

## 2. ORM & Migrations

- **Prisma** as the ORM/query layer and migration tool.
- Every schema change ships as a versioned Prisma migration, applied automatically in CI/
  CD to staging and, after approval, to production — never a manual/ad hoc schema change
  against production.
- Migrations are additive/backward-compatible where possible (add-column-then-backfill-
  then-drop-old-column across releases) to support zero-downtime deploys.

## 3. Schema Ownership (Module Boundaries)

Per the backend architecture's module-boundary rule, tables are logically grouped and
owned by a single module, even though they live in one physical database:

| Module | Owns tables (indicative — finalized in Phase 6) |
|---|---|
| Auth | `users`, `roles`, `permissions`, `sessions` |
| Patient | `patients`, `dependents` |
| Hospital | `hospitals`, `departments`, `doctors`, `treatment_packages` |
| Booking | `applications` (cases), `case_status_history`, `case_messages` |
| Visa | `documents`, `document_checklist_items`, `invitation_letters` |
| Hotel | `hotels`, `hotel_rooms`, `hotel_bookings` |
| Transport | `transfer_requests`, `drivers`, `interpreter_assignments`, `interpreters` |
| Payment | `payments`, `invoices`, `refunds`, `commission_rates` |
| CMS | `articles`, `destination_guides` |
| Admin | `audit_logs`, `platform_settings` |

No cross-module foreign key is treated as an excuse to bypass the owning module's
service layer for writes; foreign keys exist for referential integrity, not as a license
for other modules' code to write directly into another module's tables.

## 4. Multi-Tenancy Model

Row-level scoping (a `hospital_id` / `partner_id` column on the relevant tables,
indexed and enforced by the request-scoped context described in the Backend
Architecture doc §8) — not separate databases or schemas per tenant. This keeps
operational complexity low at launch scale while still satisfying NFR-SCALE-03; a
migration to schema-per-tenant remains possible later if a specific large hospital
partner requires stronger isolation.

## 5. Auditability & Soft Deletes

- Every table includes `id` (UUID), `created_at`, `updated_at`.
- Tables holding data that must be recoverable/auditable for compliance or dispute
  resolution (`applications`, `documents`, `payments`, `commission_rates`) use
  `deleted_at` soft-deletes rather than hard `DELETE`, per `PROJECT_CONTEXT.md` §9.
- `audit_logs` is append-only (no updates or deletes permitted at the application layer)
  to satisfy NFR-SEC-07/BR-30.

## 6. Backup & Disaster Recovery

- Automated daily full backups plus continuous WAL archiving for point-in-time recovery,
  per NFR-AVAIL-03.
- Quarterly restore drills into an isolated environment to verify backup integrity and
  recovery-time expectations, not just backup existence.
- Cross-region backup replication for production, given the sensitivity and
  irreplaceability of medical-case data.

## 7. Read Scaling Strategy (Future)

At launch scale, a single primary instance is sufficient. The architecture anticipates
(but does not implement at launch) a read-replica for reporting/analytics queries
(Admin analytics dashboard, hospital performance reports) once those workloads start
competing with transactional traffic — analytics queries are written from day one to be
replica-safe (no reliance on read-your-write consistency) to make that migration a
configuration change, not a rewrite.

## 8. Sensitive Data Handling

- Columns holding medical/identity data reference encrypted document blobs in object
  storage (see `06-storage-caching-search.md`) rather than storing large sensitive
  payloads directly in Postgres; structured fields that are themselves sensitive
  (e.g., a passport number) are encrypted at the application layer before write
  (envelope encryption), not relied upon to be protected by disk-level encryption alone.
- Access to tables containing PHI/PII is restricted by database role, separate from the
  general application database user, for any direct/administrative access path (e.g.,
  BI tooling, ad hoc support queries) — enforcing least privilege beyond the application
  layer's own RBAC.
