# Screen Specifications — Hospital Portal, Operations Console, Admin Console

## Hospital Portal

### Screen 37 — Hospital Dashboard (`/hospital/dashboard`)
**Sections:** Incoming applications needing response (SLA countdown badge), booking
volume snapshot (this month vs. last), quick links (Manage Doctors, Manage Packages).

### Screen 38 — Hospital Profile & Departments (`/hospital/profile`)
**Sections:** Editable profile form (name, description, address, photos, accreditation
document upload), department list management (add/edit/remove departments), publish-
status indicator ("Pending Admin Approval" / "Published").

### Screen 39 — Doctor Roster (`/hospital/doctors`)
**Sections:** Table/grid of doctors with edit/deactivate actions, "Add Doctor" form
(name, specialty, credentials, bio, photo, languages).

### Screen 40 — Treatment Packages (`/hospital/packages`)
**Sections:** List of packages with price range, specialty tag, status (active/draft),
"Add Package" form (name, description, specialty, price range, what's included).

### Screen 41 — Applications Queue (`/hospital/applications`)
**Purpose:** Hospital-side triage — mirrors Ops queue but scoped to this hospital.
**Sections:** Table (patient name/ref, specialty, submitted date, SLA countdown, status),
row click → Application Detail.

### Screen 42 — Application Detail (`/hospital/applications/[id]`)
**Sections:** Patient medical summary + uploaded documents (view-only, access-logged),
decision panel with three actions — **Accept** (opens Treatment Plan & Cost Estimate
form), **Request Info** (message composer), **Decline** (reason dropdown + notes);
messaging thread with patient/case manager.

### Screen 43 — Hospital Reports (`/hospital/reports`)
**Sections:** Booking volume chart (by month), revenue/commission summary, conversion
funnel (applications received → accepted → completed) scoped to this hospital only (per
FR-ANALYTICS-02).

---

## Operations Console (Case Manager)

### Screen 44 — Case Queue (`/ops/queue`)
**Purpose:** The Case Manager's primary workspace.
**Sections:** Filterable/sortable table — patient, hospital, status, SLA-risk indicator
(red/amber/green dot per Business Rules §8), travel-date proximity; saved filter views
("My Cases", "Urgent", "Awaiting My Response"); bulk-select for reassignment (admin-
delegated action).

### Screen 45 — Ops Case Detail (`/ops/cases/[id]`)
**Purpose:** Unified internal view — superset of the Patient Case Detail.
**Sections:** All patient-facing tabs (Overview, Documents, Messages, Itinerary,
Payments) PLUS an **Internal Notes** tab (private, not visible to patient/hospital) and an
**Assignments** panel (assign/reassign interpreter, driver, with schedule conflict
warnings).

### Screen 46 — Assignment Board (`/ops/assignments`)
**Purpose:** Cross-case scheduling view for drivers/interpreters.
**Sections:** Calendar/board view (by day) showing all scheduled transfers and
interpreter sessions, drag-and-drop reassignment, unassigned-items alert panel.

---

## Admin Console

### Screen 47 — Admin Analytics Dashboard (`/admin/dashboard`)
**Purpose:** Platform-wide business visibility.
**Sections:** KPI tiles (bookings this month, revenue, active cases, avg. SLA compliance);
conversion funnel chart (inquiry → application → accepted → paid → completed); hospital
performance leaderboard table; date-range filter.

### Screen 48 — User & Role Management (`/admin/users`)
**Sections:** Searchable/filterable user table (name, role, status, last login),
user-detail drawer (edit role, deactivate, reset access), "Invite User" flow for staff
roles (Case Manager, Hospital Staff, Admin).

### Screen 49 — Hospital Listing Moderation (`/admin/hospitals`)
**Sections:** Queue of pending hospital/doctor profile changes awaiting approval,
side-by-side diff view (what changed), Approve/Reject actions with required rejection
reason.

### Screen 50 — Review Moderation (`/admin/reviews`)
**Sections:** Queue of pending reviews, full review content + linked case reference,
Approve/Reject/Redact actions.

### Screen 51 — Finance & Commission Configuration (`/admin/finance`)
**Sections:** Per-hospital/partner commission-rate table (editable), transaction ledger
(searchable/exportable), payout status per partner, refund-request queue.

### Screen 52 — CMS — Content Management (`/admin/cms`)
**Sections:** Article/guide list with publish status, rich-text editor with SEO metadata
fields (title, slug, meta description, OG image), preview mode.

### Screen 53 — Audit Log (`/admin/audit-log`)
**Sections:** Chronological, filterable log (actor, action type, target object,
timestamp) per NFR-SEC-07/BR-30 — read-only, exportable for compliance review.

### Screen 54 — Platform Settings (`/admin/settings`)
**Sections:** Global configuration — supported languages/locales, SLA thresholds,
document-checklist templates, invitation-letter templates, notification templates.
