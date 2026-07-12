# User Stories

Format: `As a [role], I want to [action], so that [benefit].`
Each story includes acceptance criteria at a high level; detailed Given/When/Then criteria
live with each module's implementation ticket.

## Actor / Role Definitions

| Role | Description |
|---|---|
| Guest | Unauthenticated visitor browsing the public site |
| Patient | Registered user seeking treatment (may act on behalf of a dependent/family member) |
| Hospital Staff | Representative of a partner hospital managing listings, appointments, availability |
| Doctor | Individual physician profile, may be managed by Hospital Staff or self-managed |
| Case Manager (Internal Ops) | Platform employee coordinating a patient's end-to-end journey |
| Driver | Airport transfer / local transport partner |
| Interpreter | Language-support partner assigned to patient visits |
| Hotel Partner | Hotel account managing room inventory and bookings sold through the platform |
| Platform Admin | Internal super-user managing the platform, users, content, and finances |

---

## Epic: Discovery & Research (Guest / Patient)

- As a **guest**, I want to browse hospitals by specialty and city, so that I can find
  providers relevant to my condition.
- As a **guest**, I want to view a hospital's accreditations, doctor roster, and patient
  reviews, so that I can assess trustworthiness before contacting them.
- As a **guest**, I want to see estimated price ranges for common treatment packages, so
  that I can budget before committing.
- As a **guest**, I want to read verified patient testimonials and success stories, so that
  I can build confidence in the platform.
- As a **guest**, I want to use the site in my own language, so that I can understand
  medical and logistical information clearly.
- As a **guest**, I want to submit a general inquiry without creating an account, so that I
  can get quick answers before committing to sign up.

## Epic: Account & Authentication (Patient)

- As a **patient**, I want to register with email or phone number, so that I can create a
  secure account.
- As a **patient**, I want to verify my email/phone, so that the platform can confirm my
  identity for medical-record handling.
- As a **patient**, I want to reset my password securely, so that I regain access if I
  forget it.
- As a **patient**, I want to add a dependent (e.g., child, parent) to my account, so that I
  can manage their treatment booking under my profile.
- As a **patient**, I want to manage my profile (contact info, passport details, emergency
  contact), so that hospital and visa paperwork stays accurate.

## Epic: Application & Booking (Patient)

- As a **patient**, I want to start a treatment application by selecting a hospital,
  specialty, and preferred dates, so that I can request a booking.
- As a **patient**, I want to upload medical records and diagnostic reports securely, so
  that the hospital can review my case before confirming.
- As a **patient**, I want to receive a cost estimate and treatment plan proposal from the
  hospital, so that I can decide whether to proceed.
- As a **patient**, I want to track my application status (submitted, under review,
  accepted, scheduled, completed) in a single dashboard, so that I always know where things
  stand.
- As a **patient**, I want to message my assigned case manager, so that I can ask questions
  at any stage.
- As a **patient**, I want to receive notifications (email/SMS/push) at key milestones, so
  that I don't miss required actions.

## Epic: Visa & Documentation (Patient / Case Manager)

- As a **patient**, I want to request an invitation letter once my treatment is confirmed,
  so that I can apply for a medical visa.
- As a **patient**, I want to upload passport and required identity documents securely, so
  that the visa application can be prepared.
- As a **patient**, I want to track the status of my visa document preparation, so that I
  can plan my travel dates.
- As a **case manager**, I want to review and validate uploaded documents against a
  checklist, so that incomplete applications are caught early.
- As a **case manager**, I want to generate and issue invitation letters from a template,
  so that the process is consistent and auditable.

## Epic: Travel & Accommodation (Patient)

- As a **patient**, I want to book a hotel near my treatment hospital, so that I minimize
  travel time during recovery.
- As a **patient**, I want to book an airport pickup/drop-off, so that I have reliable
  transport on arrival and departure.
- As a **patient**, I want to request an interpreter for hospital visits, so that I can
  communicate clearly with medical staff.
- As a **patient**, I want to see a consolidated itinerary (flights, hotel, hospital
  appointments, transfers) in one calendar view, so that I have full visibility of my trip.

## Epic: Payments (Patient)

- As a **patient**, I want to pay securely by credit/debit card or supported regional
  payment method, so that I can complete bookings with confidence.
- As a **patient**, I want to see an itemized invoice (treatment, hotel, transfer, visa fee,
  platform fee), so that I understand exactly what I'm paying for.
- As a **patient**, I want to request a refund according to the cancellation policy, so
  that I have recourse if plans change.
- As a **patient**, I want to download receipts/invoices for my records or insurance
  claims, so that I can use them outside the platform.

## Epic: Hospital & Doctor Management (Hospital Staff)

- As **hospital staff**, I want to create and manage our hospital profile, departments, and
  doctor roster, so that patients see accurate information.
- As **hospital staff**, I want to set available appointment slots and treatment packages
  with pricing, so that patients can book accurately.
- As **hospital staff**, I want to review incoming patient applications and medical
  records, so that I can accept, request more info, or decline.
- As **hospital staff**, I want to communicate with the patient's case manager, so that
  scheduling and requirements are coordinated.
- As **hospital staff**, I want to view booking and revenue reports for our hospital, so
  that we can track platform-driven volume.

## Epic: Operations Console (Case Manager / Admin)

- As a **case manager**, I want a unified queue of active patient cases, so that I can
  prioritize and act on what's urgent.
- As a **case manager**, I want to assign interpreters and drivers to a patient's
  itinerary, so that logistics are covered.
- As a **platform admin**, I want to manage user accounts and roles, so that access is
  controlled appropriately.
- As a **platform admin**, I want to moderate hospital listings, reviews, and content, so
  that the platform maintains quality and trust.
- As a **platform admin**, I want to view platform-wide analytics (bookings, revenue,
  conversion funnel, hospital performance), so that I can make data-driven decisions.
- As a **platform admin**, I want to configure commission rates and fee structures per
  hospital/partner, so that financial terms are flexible and centrally managed.
- As a **platform admin**, I want an audit log of sensitive actions (document access, role
  changes, payment adjustments), so that the platform is auditable and compliant.

## Epic: Partner Operations (Driver / Interpreter / Hotel)

- As a **driver**, I want to see my assigned pickups/drop-offs with patient contact and
  flight info, so that I can plan my schedule.
- As a **driver**, I want to mark a trip as completed, so that payment can be processed.
- As an **interpreter**, I want to see my assigned hospital-visit appointments, so that I
  know where and when to show up.
- As a **hotel partner**, I want to manage room inventory and rates visible to the
  platform, so that bookings reflect real availability.
- As a **hotel partner**, I want to confirm or reject a booking request, so that I control
  occupancy accurately.

## Epic: Content & Trust (Marketing / Admin)

- As a **platform admin**, I want to publish blog articles and destination guides via a
  CMS, so that we can support SEO and patient education.
- As a **patient**, I want to leave a review after completed treatment, so that I can share
  my experience with future patients.
- As a **platform admin**, I want to moderate reviews before publishing, so that we prevent
  spam or defamatory content while preserving authenticity.
