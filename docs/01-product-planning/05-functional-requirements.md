# Functional Requirements Specification (FRS)

Each requirement is identified as `FR-<Module>-<Number>` for traceability into future
tickets and test cases.

## FR-AUTH — Authentication & Account Management

- **FR-AUTH-01**: The system shall allow a user to register using email or phone number
  plus password, or via a supported social provider (P2).
- **FR-AUTH-02**: The system shall send a verification code (OTP) or link upon
  registration and require verification before granting full account access.
- **FR-AUTH-03**: The system shall allow password reset via a time-limited, single-use
  email/SMS link.
- **FR-AUTH-04**: The system shall enforce role-based access control with the roles:
  Patient, Hospital Staff, Doctor, Case Manager, Driver, Interpreter, Hotel Partner, Admin.
- **FR-AUTH-05**: The system shall require two-factor authentication for Case Manager,
  Hospital Staff, and Admin roles.
- **FR-AUTH-06**: A Patient account shall support adding one or more linked "dependent"
  profiles with their own medical and identity data, manageable by the account owner.
- **FR-AUTH-07**: The system shall log all authentication events (login, failed login,
  password reset) for security monitoring.

## FR-HOSP — Hospital & Doctor Directory

- **FR-HOSP-01**: The system shall allow Hospital Staff to create/edit a hospital profile:
  name, description, city, address, accreditations, languages supported, photos.
- **FR-HOSP-02**: The system shall allow Hospital Staff to manage a list of departments and
  associated doctors.
- **FR-HOSP-03**: The system shall allow Hospital Staff to create/edit doctor profiles:
  name, specialty, credentials, years of experience, bio, photo, languages spoken.
- **FR-HOSP-04**: The system shall allow Hospital Staff to define treatment packages with
  a name, description, specialty tag, and price range.
- **FR-HOSP-05**: A hospital or doctor profile shall not be publicly visible until approved
  by a Platform Admin.
- **FR-HOSP-06**: Guests and Patients shall be able to search/filter hospitals by
  specialty, city, price range, language, and rating.
- **FR-HOSP-07**: The system shall display aggregate and individual verified patient
  reviews on hospital and doctor profile pages.

## FR-APP — Treatment Application & Booking

- **FR-APP-01**: The system shall provide a multi-step application wizard: (1) select
  specialty/hospital, (2) preferred dates, (3) medical history summary, (4) document
  upload, (5) review & submit.
- **FR-APP-02**: The system shall allow the Patient to upload medical records in common
  formats (PDF, JPG, PNG, DICOM in a later phase) up to a defined size limit.
- **FR-APP-03**: Upon submission, the system shall notify the relevant Hospital Staff and
  create a case record with status `Submitted`.
- **FR-APP-04**: Hospital Staff shall be able to transition a case to `Under Review`,
  `Info Requested`, `Accepted` (with cost estimate + treatment plan attached), or
  `Declined` (with a reason).
- **FR-APP-05**: When a case is `Accepted`, the system shall auto-assign a Case Manager
  and create a shared case workspace (messaging + document vault + itinerary).
- **FR-APP-06**: The Patient shall be able to view real-time case status in their
  dashboard at all times.
- **FR-APP-07**: The system shall support an in-app threaded messaging channel scoped to
  each case, visible to Patient, assigned Case Manager, and relevant Hospital Staff.
- **FR-APP-08**: The system shall send notifications (email + in-app, SMS for P1) on every
  status transition and new message.

## FR-VISA — Visa & Documentation

- **FR-VISA-01**: The system shall maintain a per-case document checklist (e.g., passport
  copy, photo, medical acceptance letter, proof of funds) configurable by Case Managers.
- **FR-VISA-02**: The system shall allow Case Managers to generate an invitation letter
  from an approved template, auto-populated with case and hospital data.
- **FR-VISA-03**: Generated invitation letters shall be stored in the case's document vault
  and made available for Patient download.
- **FR-VISA-04**: All uploaded identity/medical documents shall be stored encrypted at
  rest and access-logged.
- **FR-VISA-05**: The Patient shall be able to self-report visa application status
  (Applied, Approved, Rejected) with the Case Manager able to verify/override.

## FR-HOTEL — Hotel Booking

- **FR-HOTEL-01**: The system shall allow Patients to search hotels filtered by proximity
  to the assigned hospital, price, and rating.
- **FR-HOTEL-02**: Hotel Partners shall manage room inventory, rates, and availability
  calendars through a dedicated portal.
- **FR-HOTEL-03**: The system shall allow a Patient to request a booking for specific
  dates; the Hotel Partner (or auto-confirmation, if enabled) confirms availability.
- **FR-HOTEL-04**: Confirmed hotel bookings shall appear in the Patient's consolidated
  itinerary.
- **FR-HOTEL-05**: The system shall support cancellation/modification of hotel bookings
  subject to the hotel's cancellation policy.

## FR-XFER — Airport Transfer & Local Transport

- **FR-XFER-01**: The system shall allow Patients to request an arrival and/or departure
  transfer, capturing flight number, date, and time.
- **FR-XFER-02**: Case Managers shall assign a Driver to each transfer request.
- **FR-XFER-03**: Assigned Drivers shall see trip details (patient name, contact, flight
  info, pickup location) in a dedicated driver view.
- **FR-XFER-04**: A Driver shall be able to mark a trip `Completed`, triggering payment
  eligibility.

## FR-INTERP — Interpreter Services

- **FR-INTERP-01**: The system shall allow a Case Manager to request/assign an Interpreter
  to a specific hospital appointment.
- **FR-INTERP-02**: Assigned Interpreters shall see their appointment schedule (patient,
  hospital, time, language pair) in a dedicated view.
- **FR-INTERP-03**: Patients shall be able to rate the Interpreter after the appointment
  (P1).

## FR-PAY — Payments & Invoicing

- **FR-PAY-01**: The system shall support secure payment via major international credit
  and debit cards through a PCI-DSS-compliant payment processor.
- **FR-PAY-02**: The system shall support a deposit + balance payment schedule per case,
  configurable by the hospital's terms.
- **FR-PAY-03**: The system shall generate an itemized invoice for every payment covering
  treatment, accommodation, transfers, visa service fee, and platform fee lines.
- **FR-PAY-04**: The system shall process refunds according to the applicable cancellation
  policy and record the refund against the original transaction.
- **FR-PAY-05**: Patients shall be able to download invoices/receipts as PDF at any time.
- **FR-PAY-06**: The system shall calculate and record commission owed to hospitals/
  partners per completed transaction, configurable per-partner by Admin.

## FR-NOTIF — Notifications

- **FR-NOTIF-01**: The system shall send transactional email notifications for: account
  verification, application status changes, new messages, payment confirmations, document
  requests, and booking confirmations.
- **FR-NOTIF-02**: The system shall maintain an in-app notification center showing unread/
  read state.
- **FR-NOTIF-03**: The system shall support SMS notifications for time-sensitive events
  (transfer confirmed, visa document ready) (P1).
- **FR-NOTIF-04**: Users shall be able to configure notification channel preferences per
  category (P1).

## FR-OPS — Operations Console

- **FR-OPS-01**: The system shall provide Case Managers a queue view of all assigned cases,
  sortable/filterable by status, SLA risk, and travel date proximity.
- **FR-OPS-02**: The system shall provide a unified case detail view aggregating patient
  info, documents, messages, itinerary, and payment status.
- **FR-OPS-03**: Admins shall be able to create, edit, deactivate, and reassign roles for
  any user account.
- **FR-OPS-04**: Admins shall be able to approve/reject/unpublish hospital and doctor
  listings and moderate reviews.
- **FR-OPS-05**: The system shall maintain an immutable audit log of sensitive actions:
  role changes, document access, payment adjustments, listing approvals.
- **FR-OPS-06**: Admins shall be able to configure commission rates and fee structures per
  hospital/partner.

## FR-REVIEW — Reviews & Trust

- **FR-REVIEW-01**: A Patient shall be able to submit a review (rating + text) only after
  their case status reaches `Completed`.
- **FR-REVIEW-02**: Submitted reviews shall enter a moderation queue before becoming
  publicly visible.
- **FR-REVIEW-03**: Reviews shall display a "Verified Patient" badge when linked to a
  completed booking.

## FR-CMS — Content Management

- **FR-CMS-01**: Admins/marketing users shall be able to author, edit, and publish blog
  articles and destination guide pages via a CMS interface.
- **FR-CMS-02**: Published content shall support SEO metadata fields (title, description,
  slug, OG image).

## FR-ANALYTICS — Analytics & Reporting

- **FR-ANALYTICS-01**: The system shall provide an Admin dashboard showing booking volume,
  revenue, conversion funnel (inquiry → application → accepted → paid → completed), and
  hospital-level performance.
- **FR-ANALYTICS-02**: Hospital Staff shall see a scoped view of their own hospital's
  booking and revenue metrics only.
