# Business Rules

## 1. Account & Access Rules
- **BR-01**: A single email/phone number may be associated with only one active Patient
  account.
- **BR-02**: A Patient account owner has full read/write access to all dependent profiles
  they created; dependents do not have independent login access unless explicitly upgraded
  to their own account.
- **BR-03**: Hospital Staff accounts are scoped to a single hospital and cannot view data
  belonging to other hospitals.
- **BR-04**: Case Managers may only access cases assigned to them or explicitly shared by
  an Admin; blanket access to all cases is restricted to Admin roles.

## 2. Hospital & Listing Rules
- **BR-05**: A hospital must submit valid accreditation documentation before its profile
  can be approved for public listing.
- **BR-06**: A hospital listing that receives an average rating below a defined threshold
  (e.g., 3.0/5) over a rolling period triggers an internal quality review; it is not
  auto-removed.
- **BR-07**: Featured/sponsored hospital placements must be visually labeled "Sponsored" or
  equivalent and must not be positioned to imply a higher trust rating than organic
  results.

## 3. Application & Booking Rules
- **BR-08**: A hospital must respond to a submitted application (Accept/Decline/Request
  Info) within a defined SLA window (default: 3 business days); breaches are flagged to
  Admin.
- **BR-09**: A booking is only considered "confirmed" once the deposit payment is
  successfully captured.
- **BR-10**: An application may be declined by the hospital at any stage before deposit
  payment without penalty to the patient.
- **BR-11**: Once a Case Manager is assigned, all official communication regarding
  scheduling and documentation must occur through the in-platform messaging system to
  preserve an auditable record.

## 4. Payment, Pricing & Commission Rules
- **BR-12**: All displayed treatment prices are estimates; final pricing is confirmed in
  writing by the hospital in the treatment-plan proposal before any payment is requested.
- **BR-13**: The platform commission rate is set per hospital/partner contract and is
  never disclosed to the patient as a separate line item unless required by local
  regulation; the patient-facing invoice shows the total price they pay.
- **BR-14**: A booking deposit is non-refundable if the patient cancels within 7 days of
  the confirmed treatment date, except in case of hospital-initiated cancellation or
  documented medical emergency.
- **BR-15**: Refunds for cancellations outside the non-refundable window are processed
  back to the original payment method within a defined processing period (e.g., 10
  business days).
- **BR-16**: Currency conversion displayed to the patient uses a daily-refreshed rate;
  the rate locked at the time of payment is the rate applied to that transaction.

## 5. Visa & Documentation Rules
- **BR-17**: An invitation letter is only issued after the hospital has formally accepted
  the case and the booking deposit has been received.
- **BR-18**: The platform does not guarantee visa approval; all visa-related
  communications must include a disclaimer that final approval rests with the relevant
  immigration authority.
- **BR-19**: Identity and medical documents are retained only as long as required for the
  active case plus a defined legal retention period, after which they are eligible for
  deletion per the Privacy Policy.

## 6. Reviews & Content Rules
- **BR-20**: Only patients whose case status reached `Completed` may submit a review for
  that hospital/doctor.
- **BR-21**: Reviews are moderated before publication; reviews containing personal
  identifying information of third parties, defamatory content, or content unrelated to
  the care experience are rejected or redacted.
- **BR-22**: A patient may edit or remove their own review at any time; hospitals may
  respond publicly to reviews but may not have reviews removed solely for being negative.

## 7. Partner (Driver / Interpreter / Hotel) Rules
- **BR-23**: Drivers and Interpreters are matched/assigned manually by Case Managers at
  launch; assignment must occur no later than 48 hours before the scheduled service.
- **BR-24**: Partner payment is released only after the corresponding service (transfer,
  interpretation session, hotel stay) is marked complete and no dispute is raised within a
  defined window (e.g., 48 hours).
- **BR-25**: Hotel Partners must keep availability calendars current; a confirmed booking
  that a hotel cannot honor ("walk") obligates the hotel partner to provide equivalent or
  better accommodation at their cost, per partner agreement.

## 8. Operational SLA Rules
- **BR-26**: New patient inquiries must receive an automated acknowledgment within 5
  minutes and a substantive human/Case Manager response within 1 business day.
- **BR-27**: Document verification (visa checklist items) must be reviewed by a Case
  Manager within 2 business days of upload.
- **BR-28**: Any case flagged as urgent (e.g., oncology, time-sensitive treatment) is
  escalated to priority queue handling with a same-business-day response target.

## 9. Data Governance Rules
- **BR-29**: Access to a patient's medical documents is restricted to: the patient/account
  owner, the assigned Case Manager, and the specific hospital/doctor reviewing that case —
  never platform-wide.
- **BR-30**: All access to medical document vaults is logged with user, timestamp, and
  action for audit purposes, per NFR-SEC-07.
