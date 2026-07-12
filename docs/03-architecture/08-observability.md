# Observability — Logging, Monitoring & Alerting

## 1. Structured Logging

- All backend services emit structured (JSON) logs, never free-text `console.log`.
- Every log line carries a correlation/trace ID that originates at the API Gateway and
  propagates through every downstream module call and background job triggered by that
  request, satisfying NFR-OBS-01 and making it possible to reconstruct a full request's
  path across module boundaries even inside the monolith.
- Log levels are used deliberately: `error` (needs attention), `warn` (degraded but
  handled), `info` (business-significant events — case status changes, payments),
  `debug` (verbose, disabled in production by default).
- **PHI/PII is never logged.** Log statements reference record IDs, not the sensitive
  field values themselves (e.g., log `document_id`, never the document content or a
  patient's medical history text) — this is a hard rule given the platform's data
  sensitivity, not a style preference.

## 2. Metrics

- **Infrastructure metrics:** CPU, memory, request latency, error rate per service/
  module, database connection pool utilization, queue depth.
- **Business metrics:** applications submitted, bookings confirmed, payment success/
  failure rate, SLA compliance rate, notification delivery success rate — surfaced on
  the Admin Analytics Dashboard (Screen 47) and also fed into the alerting system below,
  since a drop in booking volume or a spike in payment failures is as operationally
  important as a server-error spike.
- Metrics are exposed via a standard scrape endpoint per service (e.g., Prometheus-
  compatible `/metrics`) and visualized on dashboards (e.g., Grafana or the hosting
  platform's built-in equivalent).

## 3. Distributed Tracing

- Even within the modular monolith, request tracing (e.g., OpenTelemetry
  instrumentation) captures the timing breakdown of a request across module boundaries
  and external calls (Stripe, S3, email provider) — this is what makes the eventual
  service-extraction path safe: teams can already see which "module" is slow before it's
  ever split into its own deployable service.

## 4. Health Checks

- Every deployable service exposes a `/health` endpoint (NFR-OBS-02) checked by the
  deployment platform's load balancer/orchestrator to determine readiness and liveness,
  distinguishing "process is up" from "process is up and its dependencies (database,
  Redis) are reachable."

## 5. Alerting

| Signal | Alert threshold (indicative) | Recipient |
|---|---|---|
| API error rate | > 2% over 5 min | On-call engineer |
| P95 API latency | > 1s sustained over 10 min | On-call engineer |
| Payment failure rate | > 5% over 1 hour | On-call engineer + Admin |
| Notification delivery failure rate | > 10% over 1 hour | On-call engineer |
| SLA breach risk (hospital response overdue) | Any case past threshold | Case Manager + Admin (in-app/email, not paging) |
| Database connection saturation | > 80% pool utilization | On-call engineer |
| Backup job failure | Any failure | On-call engineer (high priority — see NFR-AVAIL-03) |

Paging-worthy alerts (infrastructure/error-rate/payment) are separated from
business-workflow alerts (SLA risk) which route to operational staff through normal
in-app/email channels, not an on-call pager, since they're operationally important but
not an incident.

## 6. Audit Log vs. Application Log

The `audit_logs` table (`04-database-architecture.md` §3/§5) is a distinct,
compliance-grade record of sensitive actions (document access, role changes, payment
adjustments) — it is not the same system as operational application logging described
above, is never sampled or dropped under load, and is retained per the compliance
retention period rather than the shorter operational-log retention window.
