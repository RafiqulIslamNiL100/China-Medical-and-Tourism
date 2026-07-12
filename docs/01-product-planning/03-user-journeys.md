# User Journeys

## Journey 1: New Patient — Discovery to Confirmed Booking

1. **Awareness** — Patient finds the platform via search, referral, or social media ad
   about affordable cardiology treatment in China.
2. **Research** — Browses hospitals filtered by specialty ("Cardiology") and city
   ("Shanghai"). Compares 2–3 hospitals: accreditations, doctor profiles, price ranges,
   reviews.
3. **Inquiry** — Submits a free, no-account-required inquiry form with basic condition
   details, or creates an account directly.
4. **Account Creation** — Registers with email, verifies via OTP/link.
5. **Application** — Fills out treatment application: personal details, medical history
   summary, uploads existing diagnostic reports (PDF/images).
6. **Hospital Review** — Hospital staff reviews the case within an SLA window (e.g., 48
   hours), responds with either (a) acceptance + treatment plan + estimated cost, (b)
   request for more information, or (c) decline with reason.
7. **Case Manager Assigned** — Once accepted, a case manager is auto-assigned and
   introduces themselves via the in-app message thread.
8. **Decision** — Patient reviews treatment plan and cost estimate, asks clarifying
   questions via messaging, decides to proceed.
9. **Deposit Payment** — Patient pays a booking deposit to confirm the slot.
10. **Visa & Documentation** — Patient uploads passport; case manager prepares and issues
    invitation letter; patient applies for medical visa at nearest consulate.
11. **Travel Booking** — Patient books hotel near hospital and airport pickup through the
    platform (or self-arranges, marked accordingly).
12. **Pre-Travel Checklist** — Platform surfaces a checklist (visa approved, flight booked,
    hotel confirmed, balance payment due) with reminders.
13. **Balance Payment** — Remaining treatment balance is paid (in full or per hospital's
    payment schedule).
14. **Arrival** — Driver meets patient at airport; interpreter accompanies to hospital as
    scheduled.
15. **Treatment** — Hospital delivers care; case manager remains available for support
    throughout.
16. **Discharge & Departure** — Patient checks out of hotel, departure transfer arranged.
17. **Post-Care Follow-up** — Platform sends a satisfaction survey and prompts a review;
    case manager checks in at defined intervals (e.g., 2 weeks, 1 month) for recovery
    follow-up where applicable.
18. **Advocacy** — Satisfied patient refers friends/family; may return for follow-up
    treatment (repeat booking).

**Key drop-off risks:** step 6 (slow hospital response), step 10 (visa complexity/anxiety),
step 9/13 (payment trust). Design and operations must specifically address these.

---

## Journey 2: Hospital Onboarding — Partner Activation

1. **Outreach/Application** — Hospital contacted by platform business development, or
   applies via a "Partner with us" form.
2. **Vetting** — Platform admin verifies accreditation documents, licensing, and
   reputation.
3. **Contract & Commercial Terms** — Commission structure and SLAs agreed and recorded.
4. **Account Provisioning** — Hospital staff account created with role-based access.
5. **Profile Setup** — Hospital staff (with platform support/import) populates hospital
   profile: departments, doctors, facility photos, accreditations, languages spoken by
   staff.
6. **Package & Pricing Setup** — Treatment packages and price ranges are configured.
7. **Go-Live Review** — Platform admin reviews and approves the listing for publication.
8. **Publication** — Hospital becomes discoverable in search/listings.
9. **Ongoing Management** — Hospital staff manage incoming applications, respond within
   SLA, update availability, and view performance reports.

---

## Journey 3: Case Manager — Daily Operations

1. **Login** — Case manager logs into the internal operations console.
2. **Queue Review** — Views a prioritized queue of active cases (new applications,
   pending documents, upcoming travel dates, overdue responses flagged in red).
3. **Case Triage** — Opens a case, reviews patient messages and document status.
4. **Coordination** — Assigns/confirms interpreter and driver for an upcoming hospital
   visit; messages hospital staff to confirm appointment slot.
5. **Escalation Handling** — For a flagged issue (e.g., delayed visa document), escalates
   to admin or contacts patient directly.
6. **Documentation** — Updates internal case notes and checklist status.
7. **Reporting** — At day's end, reviews dashboard metrics (cases handled, SLA compliance).

---

## Journey 4: Family Member Booking on Behalf of a Patient

1. Registers own account, adds a "dependent" profile (e.g., elderly parent) with the
   dependent's details and medical documents.
2. Completes the application flow on the dependent's behalf; all correspondence and
   notifications go to the account owner, with an option to add the dependent's own contact
   for on-the-ground coordination.
3. Manages payments and documents centrally while the dependent travels; can grant a
   temporary "view-only" itinerary link to the traveling family member without full account
   access.

---

## Journey 5: Returning Patient — Repeat/Follow-up Treatment

1. Logs into an existing account; dashboard shows treatment history.
2. Initiates a new application referencing prior treatment ("follow-up visit" flag), which
   pre-fills known profile/medical data and routes directly to the same hospital/doctor
   where possible.
3. Expedited review since hospital already has patient history on file.
4. Simplified re-booking of hotel/transfer using saved preferences.
