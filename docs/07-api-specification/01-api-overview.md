# API Overview

Companion to `api/openapi.yaml` — the machine-readable spec is the source of truth for
request/response shapes; this document explains the conventions and decisions behind
it. View the spec rendered interactively with `npx @redocly/cli preview-docs
api/openapi.yaml` from the repo root, or paste it into https://editor.swagger.io.

## 1. Scope

This spec covers exactly the endpoints needed to power the 59 screens already built in
`apps/web` (Phase 5) — it is scoped to demonstrated need, not a speculative superset.
84 operations across 12 tags (modules), matching the module boundaries fixed in
`docs/03-architecture/03-backend-api-architecture.md` and implemented in
`database/prisma/schema.prisma` (Phase 6).

## 2. Conventions (recap of `docs/PROJECT_CONTEXT.md` §8)

- REST, JSON, versioned under `/v1` (servers in the spec show the full
  `/v1`-prefixed base URL).
- Bearer JWT auth (`security: bearerAuth` globally); endpoints that don't require
  auth — public hospital directory, login, register — explicitly override with
  `security: []`.
- Resource naming: plural nouns, nested where ownership is unambiguous
  (`/applications/{applicationId}/documents`).
- Cursor-based pagination (`cursor`/`limit` params, `meta.nextCursor`/`meta.hasMore`
  in the response) on every high-growth list endpoint — hospital search, applications,
  notifications, payments, audit log.
- Consistent error shape everywhere: `{ error: { code, message, details? } }`. Stable
  `code` values (e.g. `CASE_NOT_FOUND`) are what clients branch on, never the
  human-readable `message`.
- `Idempotency-Key` header required on endpoints with external side effects: paying an
  invoice, processing a refund, generating an invitation letter — a retried request
  can't double-execute.

## 3. Authorization model reflected in the spec

Every operation's `summary` states which role(s) may call it and any tenant-scoping
constraint (e.g., "hospital_staff, own hospital"). This isn't just documentation — it's
the same authorization rule the backend must enforce server-side per NFR-SEC-06 (never
trust the frontend route the request came from). A few structural examples:

- `PATCH /hospitals/{hospitalId}` doesn't apply the edit directly — it creates a
  `HospitalModerationItem` and returns `202 Accepted`, because FR-HOSP-05 requires
  Admin approval before a listing change goes live. The endpoint shape itself enforces
  the business rule, not just a comment.
- `GET /applications/{applicationId}/internal-notes` is `case_manager`/`admin`-only and
  simply doesn't exist as a code path reachable by a `patient` or `hospital_staff`
  token — matching how `CaseInternalNote` is a separate table from the patient-visible
  `CaseStatusHistory` in the database schema (defense in depth: even a backend bug in
  one layer doesn't leak the data, because the other layer also excludes it).
- `GET /admin/audit-log` has no corresponding write or delete operation anywhere in the
  spec — the audit log is append-only by construction (NFR-SEC-07, BR-30), not by a
  permission check that could be misconfigured.

## 4. Decisions worth flagging explicitly

- **Deliberately not exhaustive on 4xx responses.** The spec's linter (Redocly, strict
  "recommended" ruleset) flags every operation that doesn't restate a `4XX` response.
  We only added explicit 401/403/404/409/422 responses where they carry real
  information (e.g., `409` on `/applications/{id}/invitation-letter` explaining BR-17's
  precondition). Restating "this could also 401" on all 84 operations when it's already
  implied by the global `security` requirement is ceremony, not information — 63 of the
  spec's 65 remaining lint warnings are this one rule, treated as accepted.
- **File uploads are `multipart/form-data`, not base64-in-JSON.** Medical documents can
  be tens of megabytes; base64 inflates payload size ~33% and forces the whole file
  into memory as a string. `POST
  /applications/{applicationId}/documents/{documentId}/upload` takes a real multipart
  body.
- **Payments never touch raw card data.** `CreatePaymentRequest.paymentMethodToken` is
  a token from the client-side payment provider SDK (e.g., Stripe Elements) — the
  backend never sees a card number, satisfying NFR-SEC-03.
- **The local dev server URL is intentional**, not an oversight — the linter's
  "no-server-example.com" rule flags `http://localhost:3001/v1` as a style concern, but
  showing the actual local development URL is more useful to an implementer than
  omitting it.

## 5. What Phase 7 does not cover

- **Backend implementation.** This is a specification, not code — no NestJS
  controllers, no route handlers, exist yet.
- **Webhook endpoints** (e.g., a Stripe payment-confirmation webhook) — the spec covers
  the synchronous, client-facing API surface; async provider callbacks are an
  implementation detail of the Payment module's eventual build-out, not yet specified
  here.
- **Rate-limit and pagination-default documentation per endpoint** beyond what's in the
  shared `CursorParam`/`LimitParam` components — exact limits are an operational
  tuning decision for Phase 9 (Deployment), not fixed at spec time.
- **GraphQL or gRPC alternatives** — REST was fixed as the API style in Phase 3 and
  this spec follows that decision; it isn't re-litigated here.
