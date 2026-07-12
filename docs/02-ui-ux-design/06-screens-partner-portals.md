# Screen Specifications — Partner Portals (Hotel / Driver / Interpreter)

These are lightweight, task-focused portals — partners need speed and clarity, not rich
dashboards. Mobile-first, since Drivers and Interpreters will primarily use phones.

---

### Screen 55 — Hotel Partner Dashboard (`/partner/hotel/dashboard`)
**Sections:** Upcoming check-ins/check-outs list (next 7 days), pending booking requests
needing confirmation (with countdown to auto-expire), occupancy snapshot.

### Screen 56 — Hotel Inventory & Rates (`/partner/hotel/inventory`)
**Sections:** Room-type list (name, count, base rate), calendar-based availability/rate
editor (block dates, set seasonal rates), bulk-edit tool.

### Screen 57 — Hotel Bookings (`/partner/hotel/bookings`)
**Sections:** Table of bookings (guest name, dates, room type, status), booking detail
drawer with Confirm/Reject actions and guest contact info (only revealed once confirmed,
to respect patient privacy pre-confirmation).

---

### Screen 58 — Driver: My Trips (`/partner/driver/trips`)
**Purpose:** Single-screen, mobile-optimized — this is the driver's entire app surface.
**Sections:** Today's trips list (time, pickup type Arrival/Departure, patient name,
flight number, pickup location — tap to open in maps app), upcoming trips (next 7 days),
"Mark Trip Complete" button per trip (with optional note field for issues), trip history.
**Mobile-first:** Large tap targets, minimal text entry, click-to-call patient contact.

---

### Screen 59 — Interpreter: My Appointments (`/partner/interpreter/appointments`)
**Sections:** Today's appointments (time, hospital, patient name, language pair,
department), upcoming appointments, "Mark Complete" action, appointment detail (any notes
from Case Manager, e.g., "Patient uses a wheelchair, meet at main lobby").

---

## Cross-Portal Booking Flow Specs (Reference)

These flows span multiple screens across Patient, Ops, and Partner portals — documented
here as end-to-end flows since no single screen owns them.

### Flow A — Hotel Booking (Patient-initiated)
`Screen 31 (Patient: search/book)` → creates a `Pending` booking → `Screen 57 (Hotel
Partner: confirm/reject)` → on confirm, Patient's `Screen 28 (Itinerary)` updates and a
notification fires → on reject, Patient is prompted to pick an alternative hotel.

### Flow B — Airport Transfer (Patient request → Ops assign → Driver execute)
`Screen 32 (Patient: request transfer)` → appears in `Screen 46 (Ops: Assignment Board)`
as unassigned → Case Manager assigns a Driver → appears in `Screen 58 (Driver: My Trips)`
→ Driver marks complete → Patient's itinerary and payment-eligibility for the driver both
update.

### Flow C — Interpreter Assignment (tied to a confirmed hospital appointment)
Hospital confirms an appointment date via `Screen 42` → Case Manager requests an
interpreter from `Screen 45 (Ops Case Detail → Assignments)` → assignment appears in
`Screen 59 (Interpreter: My Appointments)` → Interpreter marks complete → patient can rate
(P1) from `Screen 25`.

Each flow above should be built so that every state transition is visible to all relevant
parties in near-real-time (notification + status update), since coordination failures at
these handoff points are the platform's highest operational risk (see Business Rules
§7–8).
