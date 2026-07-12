# Backend & API Architecture

## 1. Framework

**NestJS + TypeScript**, structured as a modular monolith (per
`01-architecture-overview.md` §1). NestJS's own module system maps directly onto the
business-domain modules (`AuthModule`, `PatientModule`, `HospitalModule`,
`BookingModule`, `VisaModule`, `HotelModule`, `TransportModule`, `PaymentModule`,
`NotificationModule`, `CmsModule`, `AdminModule`), giving the eventual extraction path a
natural seam: each Nest module could become its own deployed service with minimal
internal refactor, since it already only talks to other modules through injected service
interfaces, never through direct database access into another module's tables.

## 2. Module Boundary Rules

- A module owns its database tables exclusively; other modules read/write that data only
  through the owning module's exported service methods (enforced by code review, not just
  convention).
- Cross-module operations that must be transactional (e.g., accepting an application
  creates a case-manager assignment and triggers a notification) are coordinated by an
  explicit application-service/use-case layer, not by modules reaching into each other's
  repositories directly.
- Shared, non-domain-specific code (validation pipes, guards, decorators, the audit-log
  interceptor) lives in a `packages/common` library imported by every module — see Phase 4
  folder structure.

## 3. API Design Conventions

- **Style:** REST, JSON payloads, versioned under `/api/v1/`.
- **Resource naming:** plural nouns, nested where ownership is unambiguous:
  `/patients`, `/cases`, `/cases/:id/documents`, `/cases/:id/messages`,
  `/hospitals/:id/doctors`.
- **Pagination:** cursor-based for high-growth lists (cases, messages, audit log);
  offset-based acceptable for small/bounded lists (a hospital's own doctor roster).
- **Filtering/sorting:** query parameters (`?specialty=cardiology&city=shanghai&sort=
  rating`), validated against an explicit allow-list per endpoint (never raw pass-through
  to the database layer, to prevent injection and unintended data exposure).
- **Errors:** consistent JSON error shape (`{ "error": { "code", "message", "details" }
  }`) with standard HTTP status codes; error codes are stable identifiers (e.g.,
  `CASE_NOT_FOUND`, `DOCUMENT_TOO_LARGE`) that the frontend can branch on without parsing
  human-readable messages.
- **Idempotency:** mutating endpoints that trigger external side effects (payment
  capture, invitation-letter generation) accept an `Idempotency-Key` header to safely
  handle client retries.

## 4. API Gateway Responsibilities

A thin gateway layer in front of the NestJS application (can be a NestJS middleware
layer at launch, or a dedicated gateway service once traffic justifies it) is
responsible for:
- JWT verification and role extraction (feeding `NFR-SEC-06`'s API-layer enforcement).
- Rate limiting (per-IP for public endpoints, per-user for authenticated endpoints) to
  satisfy `NFR-SEC-05`.
- Request/response logging with a correlation/trace ID injected on every request,
  feeding `NFR-OBS-01`.
- CORS policy enforcement (only the platform's own frontend origins allowed).

## 5. Inter-Module Communication

- **Synchronous (in-process):** direct NestJS dependency-injected service calls, since
  all modules run in the same process at launch.
- **Asynchronous (event-driven):** an internal event bus (NestJS `EventEmitter2` at
  launch, replaceable by a durable queue such as Redis Streams or, later, a message
  broker if the monolith is decomposed) is used for cross-module reactions that don't
  need to block the triggering request — e.g., `case.accepted` triggers case-manager
  assignment + notification dispatch without the Booking module needing to know about
  Notification's internals.
- This event-driven seam is deliberately the same seam that would become a real message
  broker if/when a module is extracted into its own service — keeping today's
  implementation choice cheap to evolve.

## 6. Background Jobs

- A job queue (Redis-backed, e.g., BullMQ) handles asynchronous/scheduled work:
  SLA-breach detection sweeps (Business Rules §8), invitation-letter PDF generation,
  scheduled notification digests, nightly reconciliation jobs for payments/commissions.
- Jobs are idempotent and safe to retry; failures are surfaced to the Observability stack
  (`08-observability.md`) rather than failing silently.

## 7. Validation & DTOs

- Every endpoint has an explicit DTO (Data Transfer Object) with `class-validator`
  decorators; no endpoint accepts an unvalidated raw request body.
- Where feasible, DTO validation schemas are generated from or shared with the frontend's
  Zod schemas (`packages/schemas`) to keep client and server validation in sync and avoid
  duplicated, drifting rule definitions.

## 8. Multi-Tenancy (Hospital/Partner Scoping)

- Hospital Staff, Hotel Partner, Driver, and Interpreter accounts are scoped to their
  owning entity (hospital/partner ID) at the authorization layer: every query executed
  on their behalf is automatically filtered by that ID via a request-scoped context,
  not left to each endpoint handler to remember to filter — this directly enforces
  Business Rules BR-03/BR-04 structurally rather than by convention.

## 9. Traceability to Requirements

Every new endpoint's implementing PR should reference the `FR-*` requirement(s) it
satisfies (per `PROJECT_CONTEXT.md` §10) so the functional requirements doc and the API
surface stay mutually traceable as the platform grows. A full endpoint-by-endpoint API
specification is produced in Phase 7 (API Specification), building on the conventions
fixed here.
