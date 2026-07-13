# Endpoint Reference

Auto-generated summary of every operation in `api/openapi.yaml` (84 operations across
12 modules), grouped by tag for quick scanning. The OpenAPI spec is the source of
truth — this table exists so a reader doesn't need to open a YAML file to see what
exists. FR-\*/BR-\*/Screen references in each summary trace back to
`docs/01-product-planning/05-functional-requirements.md` and
`docs/02-ui-ux-design/`. "Access" is `Public` only when the operation explicitly
overrides the spec's global bearer-JWT requirement (`security: []`) — every other row
requires authentication, with the specific role/tenant constraint noted in the summary
where relevant.

## Auth

Registration, login, session management (FR-AUTH-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new patient account (FR-AUTH-01) | Public |
| POST | `/auth/verify` | Verify email/phone via OTP (FR-AUTH-02) | Public |
| POST | `/auth/login` | Log in with email/phone and password | Public |
| POST | `/auth/2fa/verify` | Complete login with a TOTP code (FR-AUTH-05) | Public |
| POST | `/auth/refresh` | Rotate the refresh token for a new access token (docs/03-architecture/05-auth-security-architecture.md §1) | Public |
| POST | `/auth/logout` | Revoke the current session | Auth required |
| POST | `/auth/forgot-password` | Request a password reset link (FR-AUTH-03) | Public |
| POST | `/auth/reset-password` | Complete a password reset (FR-AUTH-03) | Public |
| GET | `/me` | Get the authenticated user's own profile | Auth required |

## Patients

Patient profile and dependents (FR-AUTH-06)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/patients/me` | Get the current patient's profile | Auth required |
| PATCH | `/patients/me` | Update the current patient's profile | Auth required |
| GET | `/patients/me/dependents` | List the current patient's dependents (FR-AUTH-06) | Auth required |
| POST | `/patients/me/dependents` | Add a dependent | Auth required |
| PATCH | `/patients/me/dependents/{dependentId}` | Update a dependent | Auth required |
| DELETE | `/patients/me/dependents/{dependentId}` | Remove a dependent | Auth required |

## Hospitals

Hospital/doctor/package directory and management (FR-HOSP-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/hospitals` | Search/browse published hospitals (FR-HOSP-06) | Public |
| GET | `/hospitals/{hospitalId}` | Get hospital detail (public if status=Published) | Public |
| PATCH | `/hospitals/{hospitalId}` | Update hospital profile (hospital_staff only, scoped to own hospital per BR-03; submits a HospitalModerationItem rather than a live edit, per FR-HOSP-05) | Auth required |
| GET | `/hospitals/{hospitalId}/doctors` | List a hospital's doctors | Public |
| POST | `/hospitals/{hospitalId}/doctors` | Add a doctor (hospital_staff, own hospital) (FR-HOSP-03) | Auth required |
| GET | `/hospitals/{hospitalId}/doctors/{doctorId}` | Get doctor detail | Public |
| GET | `/hospitals/{hospitalId}/packages` | List a hospital's treatment packages (FR-HOSP-04) | Public |
| POST | `/hospitals/{hospitalId}/packages` | Create a treatment package (hospital_staff, own hospital) | Auth required |
| GET | `/hospitals/{hospitalId}/reports` | Hospital-scoped booking/revenue/conversion report (FR-ANALYTICS-02, Screen 43) | Auth required |

## Applications

Treatment applications ("cases") and messaging (FR-APP-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/applications` | List applications. Scope depends on caller role: a patient sees their own cases; hospital_staff see their hospital's queue (BR-03); case_manager/admin see the cross-hospital Ops queue (Screen 44), filterable via `view`. | Auth required |
| POST | `/applications` | Submit a treatment application (FR-APP-01, FR-APP-03) | Auth required |
| GET | `/applications/{applicationId}` | Get case detail (FR-APP-06) | Auth required |
| POST | `/applications/{applicationId}/decision` | Accept / request info / decline an application (hospital_staff only) (FR-APP-04) | Auth required |
| POST | `/applications/{applicationId}/reassign` | Reassign the case manager (case_manager/admin only, Screen 45) | Auth required |
| GET | `/applications/{applicationId}/messages` | List messages on a case (FR-APP-07) | Auth required |
| POST | `/applications/{applicationId}/messages` | Send a message on a case | Auth required |
| GET | `/applications/{applicationId}/internal-notes` | List internal notes (case_manager/admin only — never returned to patient or hospital-scoped callers, Screen 45) | Auth required |
| POST | `/applications/{applicationId}/internal-notes` | Add an internal note (case_manager/admin only) | Auth required |

## Documents

Visa document checklist and invitation letters (FR-VISA-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/applications/{applicationId}/documents` | Get the document checklist for a case (FR-VISA-01) | Auth required |
| POST | `/applications/{applicationId}/documents/{documentId}/upload` | Upload a file for a checklist item (FR-VISA-01). Multipart upload; the backend validates format/size, encrypts at rest, and stores an access-controlled object-storage reference per docs/03-architecture/06-storage-caching-search.md §1 — never a public URL. | Auth required |
| POST | `/applications/{applicationId}/documents/{documentId}/verify` | Verify or reject an uploaded document (case_manager only) (FR-VISA-01) | Auth required |
| POST | `/applications/{applicationId}/invitation-letter` | Generate the invitation letter (case_manager only) (FR-VISA-02, BR-17) | Auth required |

## Hotels

Hotel search, booking, and partner inventory (FR-HOTEL-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/hotels` | Search hotels (FR-HOTEL-01) | Auth required |
| GET | `/hotels/{hotelId}/room-types` | List room types and availability | Auth required |
| POST | `/hotels/{hotelId}/room-types` | Add a room type (hotel_partner, own hotel) (Screen 56) | Auth required |
| GET | `/hotels/{hotelId}/bookings` | List bookings for a hotel (hotel_partner, own hotel) (Screen 57) | Auth required |
| POST | `/hotels/{hotelId}/bookings` | Request a hotel booking (patient) (FR-HOTEL-03) | Auth required |
| POST | `/hotel-bookings/{bookingId}/confirm` | Confirm a pending booking (hotel_partner only) | Auth required |
| POST | `/hotel-bookings/{bookingId}/reject` | Reject a pending booking (hotel_partner only) | Auth required |

## Transport

Airport transfers and interpreter assignments (FR-XFER-*, FR-INTERP-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/applications/{applicationId}/transfers` | List transfer requests for a case | Auth required |
| POST | `/applications/{applicationId}/transfers` | Request an airport transfer (patient) (FR-XFER-01) | Auth required |
| POST | `/transfers/{transferId}/assign` | Assign a driver (case_manager/admin only) (FR-XFER-02, BR-23) | Auth required |
| POST | `/transfers/{transferId}/complete` | Mark a transfer complete (driver only, own assignment) (FR-XFER-04) | Auth required |
| GET | `/drivers/me/trips` | List the authenticated driver's assigned trips (FR-XFER-03, Screen 58) | Auth required |
| GET | `/applications/{applicationId}/interpreter-sessions` | List interpreter sessions for a case | Auth required |
| POST | `/applications/{applicationId}/interpreter-sessions` | Request an interpreter session (case_manager only) (FR-INTERP-01) | Auth required |
| POST | `/interpreter-sessions/{sessionId}/assign` | Assign an interpreter (case_manager/admin only) | Auth required |
| POST | `/interpreter-sessions/{sessionId}/complete` | Mark an interpreter session complete (interpreter only, own assignment) | Auth required |
| GET | `/interpreters/me/appointments` | List the authenticated interpreter's assigned appointments (FR-INTERP-02, Screen 59) | Auth required |

## Payments

Invoices, payments, refunds, commission rates (FR-PAY-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/applications/{applicationId}/invoices` | List invoices for a case (FR-PAY-03) | Auth required |
| POST | `/invoices/{invoiceId}/pay` | Pay an invoice (patient) (FR-PAY-01, FR-PAY-02) | Auth required |
| GET | `/invoices/{invoiceId}/receipt` | Download a PDF receipt/invoice (FR-PAY-05) | Auth required |
| POST | `/payments/{paymentId}/refund` | Process a refund (admin only) (FR-PAY-04) | Auth required |
| GET | `/payments/me` | Cross-case payment history for the current patient (Screen 33) | Auth required |
| GET | `/admin/commission-rates` | List commission rates (admin only) (FR-PAY-06, Screen 51) | Auth required |
| POST | `/admin/commission-rates` | Set a commission rate (admin only) | Auth required |
| GET | `/admin/transactions` | Platform-wide transaction ledger (admin only) (Screen 51) | Auth required |

## Reviews

Patient reviews and moderation (FR-REVIEW-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| POST | `/reviews` | Submit a review for a completed case (patient) (FR-REVIEW-01, BR-20) | Auth required |
| GET | `/hospitals/{hospitalId}/reviews` | List approved reviews for a hospital (public) | Public |
| GET | `/admin/reviews` | List reviews pending moderation (admin only) (Screen 50) | Auth required |
| POST | `/admin/reviews/{reviewId}/moderate` | Approve, redact, or reject a review (admin only) (FR-REVIEW-02, BR-21) | Auth required |

## Notifications

In-app notifications and channel preferences (FR-NOTIF-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/notifications` | List the current user's notifications (FR-NOTIF-02) | Auth required |
| POST | `/notifications/{notificationId}/read` | Mark a notification as read | Auth required |
| POST | `/notifications/read-all` | Mark all notifications as read | Auth required |
| GET | `/notifications/preferences` | Get channel preferences per category (FR-NOTIF-04) | Auth required |
| PUT | `/notifications/preferences` | Update channel preferences | Auth required |

## CMS

Blog articles and destination guides (FR-CMS-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/articles` | List published articles (public) | Public |
| POST | `/articles` | Create an article (admin only) (FR-CMS-01, Screen 52) | Auth required |
| GET | `/articles/{slug}` | Get an article by slug (public if Published) | Public |
| PATCH | `/articles/{slug}` | Update/publish an article (admin only) | Auth required |

## Admin

User/role management, audit log, platform settings, analytics (FR-OPS-*, FR-ANALYTICS-*)

| Method | Path | Summary | Access |
|---|---|---|---|
| GET | `/admin/dashboard` | Platform-wide analytics (admin only) (FR-ANALYTICS-01, Screen 47) | Auth required |
| GET | `/admin/users` | List/search platform users (admin only) (FR-OPS-03, Screen 48) | Auth required |
| POST | `/admin/users` | Invite a staff user (admin only) | Auth required |
| PATCH | `/admin/users/{userId}` | Change a user's role or status (admin only) (FR-OPS-03) | Auth required |
| GET | `/admin/hospitals/moderation-queue` | List pending hospital listing changes (admin only) (FR-OPS-04, Screen 49) | Auth required |
| POST | `/admin/hospitals/moderation-queue/{itemId}/resolve` | Approve or reject a pending hospital listing change (admin only) (FR-HOSP-05) | Auth required |
| GET | `/admin/audit-log` | Read the append-only audit log (admin only) (NFR-SEC-07, BR-30, Screen 53) | Auth required |
| GET | `/admin/settings` | Get platform settings (admin only) (Screen 54) | Auth required |
| PUT | `/admin/settings` | Update a platform setting (admin only) | Auth required |

