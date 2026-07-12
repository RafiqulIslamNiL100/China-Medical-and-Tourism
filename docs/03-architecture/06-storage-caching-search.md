# Storage, Caching & Search Architecture

## 1. Object Storage (Documents & Media)

- **S3-compatible object storage** (e.g., AWS S3 or equivalent) for two distinct buckets
  with different access profiles:
  - **`documents` bucket (private):** medical records, passport scans, invitation
    letters, invoices. Never publicly readable; access only via short-lived signed URLs
    issued after the application layer's authorization check (per
    `05-auth-security-architecture.md` §6). Server-side encryption enabled.
  - **`media` bucket (public/CDN-fronted):** hospital photos, doctor photos, blog images,
    marketing assets. Publicly readable via CDN, no signed URLs needed.
- Uploads flow through the backend (not direct browser-to-S3 for the `documents` bucket)
  so that virus/format validation and access-control metadata are attached before the
  file is persisted; the `media` bucket may use direct presigned-upload for staff
  convenience since it holds no sensitive data.
- Lifecycle policy: `documents` bucket objects are retained per the case's applicable
  legal retention period (Business Rules BR-19) and then eligible for deletion via a
  scheduled job — not indefinite retention by default.

## 2. Caching Strategy (Redis)

| Use case | Pattern |
|---|---|
| Session/refresh-token metadata | Key-value, TTL-bound |
| Hospital directory search results (unauthenticated, filter-based) | Short-TTL cache (e.g., 60s) keyed by normalized filter query, to absorb read load on the public directory without serving stale data for long |
| Rate-limiting counters | Sliding-window counters per IP/user |
| Background job queue | BullMQ-backed queue (see `03-backend-api-architecture.md` §6) |
| Rarely-changing reference data (specialties list, supported locales) | Long-TTL cache with explicit invalidation on admin update |

Cache invalidation is explicit (event-driven: a hospital-profile update invalidates that
hospital's cached directory entries) rather than relying solely on TTL expiry for data
where staleness would be user-visible and confusing (e.g., a hospital's own edits should
appear promptly).

## 3. Search

- **Launch scope:** Postgres full-text search (`tsvector`/`tsquery`) with trigram
  indexes for the hospital/doctor directory's specialty, city, and name search — this
  covers the P0 search/filter requirements (FR-HOSP-06) without introducing a separate
  search infrastructure component before it's proven necessary.
- **Growth path:** if search relevance or query volume outgrows Postgres full-text
  search (e.g., fuzzy multi-language matching becomes a real product need, or search
  load starts competing with transactional database load), introduce a dedicated search
  index (e.g., Meilisearch or OpenSearch) fed by the same event-driven pattern used for
  cache invalidation — hospital/doctor writes emit an event that updates the search
  index asynchronously, keeping the write path from taking a hard dependency on the
  search engine's availability.
- CMS content (blog/destination guides) search, if needed, follows the same launch-scope
  approach (Postgres full-text) given its lower query volume.

## 4. CDN

- Static assets (JS/CSS bundles, public marketing images, `media` bucket content) are
  served through a CDN in front of the origin, both for performance (NFR-PERF-01) and to
  absorb traffic spikes on public pages without load reaching the application tier.
- The CDN layer also provides a natural point for basic bot/DDoS mitigation ahead of the
  application (see `09-deployment-cicd-infrastructure.md` for the broader infrastructure
  security posture).
