# Authentication, Authorization & Security Architecture

## 1. Authentication

- **Library:** Auth.js (NextAuth) or Better Auth integrated with the NestJS backend
  issuing/validating tokens — final choice confirmed at Phase 5 build-out; both satisfy
  the requirements below.
- **Credentials:** email/phone + password (Argon2id hashed, per NFR-SEC-04) as the
  baseline; social login (P2) added later as an additional provider, not a replacement.
- **Session model:** short-lived JWT access token (~15 min) + longer-lived, rotating
  refresh token (httpOnly cookie). Refresh-token rotation invalidates the previous token
  on use, so a leaked-and-replayed refresh token is detectable (reuse triggers full
  session revocation).
- **OTP verification:** required at registration (email/SMS code, per FR-AUTH-02);
  time-limited (10 min) and rate-limited to prevent brute force.
- **2FA:** mandatory for `hospital_staff`, `case_manager`, and `admin` roles (FR-AUTH-05,
  NFR-SEC-09), TOTP-based (authenticator app) rather than SMS-only, since SMS is
  phishable and some target markets have unreliable SMS delivery.

## 2. Authorization (RBAC)

- Roles are fixed, platform-defined enum values (§10 of `PROJECT_CONTEXT.md`): `patient`,
  `hospital_staff`, `doctor`, `case_manager`, `driver`, `interpreter`, `hotel_partner`,
  `admin`.
- Authorization is enforced via a NestJS guard evaluated on every request, using the
  JWT's embedded role claim plus (for scoped roles) the tenant-scoping context described
  in `03-backend-api-architecture.md` §8 — never inferred from the frontend route the
  request happened to come from.
- Fine-grained permission checks beyond role (e.g., "this case manager may only view
  cases assigned to them, not all cases") are implemented as explicit ownership checks
  in the relevant module's service layer, not left to the guard alone.

## 3. Encryption

| Data | At rest | In transit |
|---|---|---|
| Database (Postgres) | Provider-managed disk encryption (AES-256) | TLS to application layer |
| Object storage (documents) | Server-side encryption (SSE, AES-256) + application-layer envelope encryption for the most sensitive fields | TLS for upload/download |
| Application-level sensitive fields (passport numbers, etc.) | Encrypted before write using a KMS-managed data-encryption key | N/A |
| All external traffic | N/A | TLS 1.2+ enforced (NFR-SEC-01) |

- Encryption keys are managed via a cloud KMS (not embedded in application config or
  source control); key rotation policy defined before production launch.

## 4. Secrets Management

- No secrets (API keys, database credentials, signing keys) in source control or plain
  `.env` files committed to the repo — managed via the deployment platform's secrets
  store (see `09-deployment-cicd-infrastructure.md`) and injected at runtime.
- Local development uses a `.env.example` template with placeholder values; real local
  secrets stay in a gitignored `.env.local`.

## 5. API & Application-Layer Security

- Rate limiting and brute-force protection on authentication endpoints (NFR-SEC-05),
  implemented at the gateway layer.
- Input validation on every endpoint via DTOs (`03-backend-api-architecture.md` §7) —
  the primary defense against injection-class vulnerabilities alongside Prisma's
  parameterized queries (no raw SQL string concatenation).
- Output encoding/escaping handled by the frontend framework by default (React/Next.js
  auto-escapes); any place that renders raw HTML (e.g., CMS article bodies) sanitizes
  input server-side before storage, not just at render time, to prevent stored XSS.
- CSRF protection: since auth relies on httpOnly cookies for the browser clients,
  state-changing endpoints require either a same-site cookie policy plus an
  anti-CSRF token, or a custom-header check that CSRF cannot forge cross-origin.

## 6. Document/Medical-Data Access Control

- Every read of a patient's document vault entry is authorization-checked against: is
  the requester the patient/account-owner, their assigned case manager, or the specific
  hospital reviewing that exact case — never a blanket "any staff member" check
  (Business Rules BR-29).
- Every such access is written to the audit log (actor, document ID, timestamp, action)
  synchronously with the access, not batched/best-effort, satisfying NFR-SEC-07/BR-30.
- Anomaly detection (P1): scheduled job flags unusual access patterns (e.g., a case
  manager account reading an unusually high number of documents in a short window) for
  admin review.

## 7. Consent & Compliance Hooks

- Medical-data processing consent is a distinct, explicitly-tracked consent record
  (timestamp, consent text version, user ID) — separate from general Terms of Service
  acceptance, satisfying NFR-COMP-02.
- Data export and deletion requests (NFR-COMP-03) are handled via an admin-triggered
  workflow that respects legal retention holds (e.g., financial records under active
  retention are excluded from deletion with a clear reason surfaced to the requester).

## 8. Security Testing & Review

- Dependency vulnerability scanning runs in CI on every build (e.g., `npm audit` /
  Snyk-equivalent), blocking merges on high/critical findings.
- A third-party penetration test is scheduled before the first public production launch
  and at least annually thereafter, per NFR-SEC-08.
- A responsible-disclosure security contact/policy is published on the platform before
  launch.
