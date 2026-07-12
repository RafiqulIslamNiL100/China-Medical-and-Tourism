# Screen Specifications — Patient Portal

---

### Screen 22 — Patient Dashboard (`/app/dashboard`)
**Purpose:** Single-glance overview of everything active.
**Sections:** Welcome header with name; "Next Action Needed" banner if any case requires
action (e.g., "Upload your passport"); Active Cases widget (Case Summary Cards, max 3 +
"View all"); Upcoming Itinerary widget (next 2-3 events: flight, hospital visit, transfer);
Recent Messages widget (last 3 unread); quick links (New Application, Manage Dependents).
**Empty state (new user):** Hero prompt "Start your first application" with 3-step
explainer.
**Mobile:** Widgets stack vertically in priority order (Next Action → Cases → Itinerary →
Messages); bottom tab bar for primary nav.

---

### Screen 23 — Application Wizard (`/app/apply`)
**Purpose:** Guided, low-anxiety data collection for a new case.
**Steps (wizard layout per Design System §2):**
1. **Specialty & Hospital** — select specialty, optionally pre-select hospital/doctor
   (skippable — "Not sure, help me choose" routes to a short condition questionnaire).
2. **Preferred Dates** — date-range picker, flexibility toggle ("flexible ± 2 weeks").
3. **Medical History** — structured short-answer fields (condition summary, current
   medications, allergies) + free-text notes.
4. **Document Upload** — Dropzone component for diagnostic reports/records, with a list of
   suggested document types (non-blocking — can submit without all documents).
5. **Review & Submit** — summary of all entered data with per-section "Edit" links,
   consent checkbox (medical-data processing consent per NFR-COMP-02), submit button.
6. **Confirmation** — "Application submitted" state with expected response-time messaging
   and a link back to the new Case Detail screen.
**Primary CTA:** "Continue" (footer, sticky) advancing each step; "Submit Application" on
step 5.

---

### Screen 24 — My Applications / Cases List (`/app/cases`)
**Purpose:** All cases at a glance, including past/completed.
**Sections:** Tab filter (Active / Completed / Declined), Case Summary Card list, empty
state per filter.

---

### Screen 25 — Case Detail — Overview Tab (`/app/cases/[id]`)
**Purpose:** Status and next steps for one case.
**Sections:** Header (hospital/doctor, specialty, status chip, case reference number);
Status Timeline component; Treatment Plan & Cost Estimate panel (once available, shown as
a structured summary with a "Download PDF" action); Assigned Case Manager card (photo,
name, "Message" button); Next Steps checklist.

---

### Screen 26 — Case Detail — Documents Tab
**Purpose:** Central vault for the case.
**Sections:** Document checklist (per Visa & Documentation FR) with status per item
(Not uploaded / Uploaded / Verified / Rejected — with reason), Dropzone for new uploads,
categorized list (Medical Records / Identity Documents / Visa Documents — including
generated Invitation Letter), access-log note ("Only you, your case manager, and Beijing
United Family Hospital can view these files").

---

### Screen 27 — Case Detail — Messages Tab
**Purpose:** Case-scoped communication.
**Sections:** Threaded Messaging component (per Design System), participant list at top
(Case Manager, Hospital contact), file-attachment support, message composer with a note
that hospital replies may take up to the SLA window.

---

### Screen 28 — Case Detail — Itinerary Tab
**Purpose:** Consolidated trip view for this case.
**Sections:** Agenda/calendar component (Design System §1) combining hospital
appointments, hotel stay dates, airport transfers; "Add Hotel Booking" / "Request Airport
Transfer" CTAs if not yet booked; downloadable itinerary PDF/ICS export.

---

### Screen 29 — Case Detail — Payments Tab
**Purpose:** Financial transparency per case.
**Sections:** Itemized cost breakdown (treatment, hotel, transfer, visa fee, platform
fee), payment schedule (deposit paid / balance due date), "Pay Now" CTA when a payment is
due, downloadable invoice list.

---

### Screen 30 — Manage Dependents (`/app/dependents`)
**Purpose:** Family-member profile management.
**Sections:** List of dependent profiles (name, relationship, linked cases count), "Add
Dependent" CTA opening a form (name, DOB, relationship, passport info), per-dependent
detail/edit view.

---

### Screen 31 — Hotel Booking Flow (`/app/bookings/hotels`)
**Purpose:** Standalone or case-linked hotel booking.
**Sections:** Hotel search (filters: proximity to hospital, price, rating) → Hotel Detail
(photos, amenities, room types, cancellation policy) → Booking form (dates, room type,
guest count) → Confirmation.

---

### Screen 32 — Airport Transfer Request (`/app/bookings/transfers`)
**Purpose:** Request pickup/drop-off.
**Sections:** Simple form — direction (arrival/departure), flight number, date/time,
pickup/drop-off address (hotel auto-filled if booked), passenger count, notes; confirmation
state shows "Pending assignment" then updates to "Driver assigned: [name], [contact]" once
a Case Manager assigns a driver.

---

### Screen 33 — Payments Overview (`/app/payments`)
**Purpose:** Cross-case financial history.
**Sections:** Table of all transactions (date, case, description, amount, status),
downloadable receipts, saved payment method management.

---

### Screen 34 — Reviews (`/app/reviews`)
**Purpose:** Post-treatment feedback loop.
**Sections:** List of completed cases eligible for review with "Write a Review" CTA;
review form (star rating, text, optional photo); list of previously submitted reviews with
edit/delete.

---

### Screen 35 — Notifications Center (`/app/notifications`)
**Purpose:** Chronological activity feed.
**Sections:** Filterable list (All / Unread), grouped by day, each item deep-links to the
relevant case/screen, "Mark all as read" action.

---

### Screen 36 — Account Settings (`/app/settings`)
**Purpose:** Profile & preferences management.
**Sections (sub-tabs):** **Profile** (name, contact, passport info), **Security**
(password change, 2FA setup), **Language & Region**, **Notification Preferences**
(per-category channel toggles), **Privacy** (data export/delete request per NFR-COMP-03).
