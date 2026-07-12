# Non-Functional Requirements (NFR)

## 1. Performance
- **NFR-PERF-01**: Public pages (landing, hospital directory, hospital detail) shall
  achieve a Largest Contentful Paint (LCP) under 2.5s on a simulated 4G connection.
- **NFR-PERF-02**: API endpoints serving dashboard/list views shall respond within 300ms
  at the 95th percentile under normal load.
- **NFR-PERF-03**: The system shall support at least 5,000 concurrent authenticated
  sessions at launch scale, horizontally scalable beyond that via stateless application
  services.
- **NFR-PERF-04**: File uploads (medical documents) up to 25MB shall be supported with
  resumable/chunked upload for connections in target markets with variable bandwidth.

## 2. Availability & Reliability
- **NFR-AVAIL-01**: The platform shall target 99.9% uptime for core booking and messaging
  functionality (excluding scheduled maintenance windows).
- **NFR-AVAIL-02**: Scheduled maintenance shall be announced at least 48 hours in advance
  and performed during low-traffic windows.
- **NFR-AVAIL-03**: The system shall have automated daily backups of the primary database
  with point-in-time recovery capability, tested quarterly via restore drills.
- **NFR-AVAIL-04**: Payment and document-storage subsystems shall have documented failover
  procedures given their criticality.

## 3. Security
- **NFR-SEC-01**: All traffic shall be encrypted in transit via TLS 1.2+.
- **NFR-SEC-02**: Sensitive data at rest (medical documents, passport scans, payment
  metadata) shall be encrypted using industry-standard algorithms (e.g., AES-256).
- **NFR-SEC-03**: The system shall never store raw payment card data; all card processing
  shall be delegated to a PCI-DSS Level 1 compliant payment processor (tokenization only).
- **NFR-SEC-04**: Passwords shall be hashed using a modern adaptive hashing algorithm
  (e.g., bcrypt/argon2) — never stored in plaintext or reversibly encrypted.
- **NFR-SEC-05**: The system shall implement rate limiting and brute-force protection on
  authentication endpoints.
- **NFR-SEC-06**: Role-based access control shall be enforced at the API layer, not solely
  in the UI, on every request.
- **NFR-SEC-07**: The system shall log and alert on anomalous access patterns to medical
  document vaults (e.g., bulk downloads, access outside assigned case scope).
- **NFR-SEC-08**: A responsible-disclosure / security-contact process shall be published
  and a periodic third-party penetration test shall be conducted before major public
  launches.
- **NFR-SEC-09**: Staff and admin accounts shall require 2FA; session tokens shall expire
  and require re-authentication after a defined inactivity period.

## 4. Privacy & Regulatory Compliance
- **NFR-COMP-01**: The system shall handle personal health information (PHI) in line with
  applicable data-protection regulations in operating markets (e.g., GDPR-equivalent
  principles: purpose limitation, data minimization, right to access/erasure) and China's
  Personal Information Protection Law (PIPL) for data processed or stored in China.
- **NFR-COMP-02**: Explicit, granular consent shall be captured before collecting and
  processing medical records, distinct from general account terms acceptance.
- **NFR-COMP-03**: Patients shall be able to request export or deletion of their personal
  data, subject to legal/record-retention obligations (e.g., financial records retention).
- **NFR-COMP-04**: Cross-border data transfer (e.g., patient data collected outside China,
  processed on servers in/related to China) shall follow a documented data-transfer
  mechanism compliant with PIPL and destination-market regulations.
- **NFR-COMP-05**: The invitation-letter and visa-documentation workflow shall follow
  current Chinese immigration authority requirements; content templates shall be reviewed
  and updated whenever official requirements change.
- **NFR-COMP-06**: The system shall NOT present itself as providing medical diagnosis or
  advice; all treatment-plan content is understood to originate from the licensed
  hospital/doctor, not the platform.

## 5. Scalability & Extensibility
- **NFR-SCALE-01**: The system architecture shall support adding new destination cities,
  countries, and treatment specialties via configuration/data, not code changes.
- **NFR-SCALE-02**: Services shall be modular (per the service-oriented folder structure
  in the Architecture doc) so that individual modules (e.g., Hotel Booking) can be scaled
  or replaced independently.
- **NFR-SCALE-03**: The database schema shall support multi-tenancy at the hospital/
  partner level without structural redesign.

## 6. Usability & Accessibility
- **NFR-UX-01**: The public site and patient dashboard shall conform to WCAG 2.1 Level AA
  accessibility guidelines.
- **NFR-UX-02**: The platform shall support a minimum of English and Chinese at launch,
  with an i18n architecture allowing additional locales to be added without code changes
  to templates.
- **NFR-UX-03**: All patient-facing flows shall be mobile-first responsive, tested on
  viewport widths from 360px to 1920px.
- **NFR-UX-04**: Critical actions (payment, document submission, cancellation) shall
  include explicit confirmation steps to prevent accidental submission.

## 7. Maintainability
- **NFR-MAINT-01**: Code shall follow the conventions defined in `PROJECT_CONTEXT.md` and
  pass automated linting/type-checking in CI before merge.
- **NFR-MAINT-02**: Each service/module shall maintain its own automated test suite with a
  minimum coverage threshold (target: 70%+ for business logic).
- **NFR-MAINT-03**: All infrastructure shall be defined as code (IaC) to ensure
  reproducible environments across dev/staging/production.

## 8. Observability
- **NFR-OBS-01**: All services shall emit structured logs correlated by a request/trace
  ID spanning the full request lifecycle across services.
- **NFR-OBS-02**: The system shall expose health-check endpoints per service for uptime
  monitoring.
- **NFR-OBS-03**: Error rates, latency, and key business metrics (bookings, payments)
  shall be visible on a monitoring dashboard with alerting thresholds configured.

## 9. Localization & Currency
- **NFR-LOC-01**: Prices shall be displayable in the patient's preferred currency
  (converted display only; settlement occurs in a defined base currency) with clear
  disclosure that displayed amounts are estimates subject to conversion-rate change.
- **NFR-LOC-02**: Dates, number formats, and time zones shall be localized based on user
  locale and the relevant hospital's local time zone for scheduling.

## 10. Legal & Financial Controls
- **NFR-FIN-01**: All financial transactions shall be recorded in an auditable ledger
  sufficient for reconciliation and regulatory reporting.
- **NFR-FIN-02**: Commission calculations shall be deterministic and reproducible from
  stored transaction and rate-configuration data for dispute resolution.
