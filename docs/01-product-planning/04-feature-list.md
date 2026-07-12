# Feature List

Organized by module. `P0` = launch-critical, `P1` = fast-follow, `P2` = future phase.

## 1. Public Website / Marketing
- P0 — Landing page with value proposition, featured hospitals, testimonials, CTA
- P0 — Hospital directory with search & filters (specialty, city, price range, language)
- P0 — Hospital detail page (profile, doctors, accreditations, packages, reviews)
- P0 — Doctor detail page (bio, specialty, hospital affiliation, patient reviews)
- P0 — Treatment/specialty landing pages (e.g., "Oncology in China")
- P0 — Static pages: About, How It Works, FAQ, Contact, Privacy Policy, Terms of Service
- P1 — Blog / destination guides (CMS-driven)
- P1 — Multi-language site switcher
- P2 — Live chat widget for guest inquiries

## 2. Authentication & Account Management
- P0 — Registration (email/phone), login, logout
- P0 — Email/phone verification (OTP)
- P0 — Password reset
- P0 — Role-based access control (Patient, Hospital Staff, Case Manager, Driver,
  Interpreter, Hotel Partner, Admin)
- P0 — Profile management (contact info, passport info, preferred language)
- P1 — Dependent/family-member profile management
- P1 — Two-factor authentication (2FA) for staff/admin roles
- P2 — Social login (Google, Apple)

## 3. Patient Dashboard
- P0 — Application status tracker (submitted → reviewed → accepted → scheduled →
  completed)
- P0 — Document upload/download (medical records, passport, visa docs)
- P0 — Messaging thread with case manager / hospital
- P0 — Itinerary view (appointments, hotel, transfers)
- P0 — Payment & invoice history
- P1 — Notification preferences center
- P1 — Treatment history (for returning patients)
- P2 — Recovery/follow-up check-in log

## 4. Application & Booking Flow
- P0 — Multi-step treatment application wizard (specialty, hospital, dates, medical
  history, document upload)
- P0 — Cost estimate / treatment plan proposal delivery
- P0 — Accept/decline/request-more-info workflow (hospital side)
- P0 — Booking deposit & balance payment scheduling
- P1 — Package comparison tool (compare 2–3 hospitals side by side)
- P2 — AI-assisted specialty/hospital recommendation based on condition input

## 5. Visa & Documentation
- P0 — Document checklist per patient case
- P0 — Invitation letter generation (templated, case-manager issued)
- P0 — Secure document vault (encrypted storage, access-controlled)
- P1 — Visa application status tracker (patient self-reported + case-manager verified)
- P2 — Integration with e-visa portals where available

## 6. Hospital Management (Hospital Staff Portal)
- P0 — Hospital profile & department management
- P0 — Doctor roster management
- P0 — Treatment package & pricing management
- P0 — Appointment availability calendar
- P0 — Incoming application review & response
- P1 — Hospital-side reporting (bookings, revenue, conversion)
- P2 — Direct messaging broadcast to case managers for scheduling changes

## 7. Hotel Booking
- P0 — Hotel search near hospital (by proximity, price, rating)
- P0 — Room booking with date range
- P0 — Hotel partner portal: inventory & rate management, booking confirmation
- P1 — Package deals (hospital + hotel bundle discount)
- P2 — Real-time channel-manager integration with external hotel systems

## 8. Airport Pickup / Local Transport
- P0 — Transfer request (arrival/departure) tied to flight info
- P0 — Driver assignment (manual by case manager at launch)
- P0 — Driver mobile view: assigned trips, patient contact, trip completion
- P1 — Real-time driver location sharing with patient
- P2 — Automated driver-matching algorithm

## 9. Interpreter Services
- P0 — Interpreter request tied to hospital appointment
- P0 — Interpreter assignment (manual by case manager at launch)
- P0 — Interpreter view: assigned appointments
- P1 — Interpreter ratings/reviews from patients
- P2 — Video-call interpretation for remote consultations

## 10. Payments & Invoicing
- P0 — Secure card payment (international cards)
- P0 — Itemized invoice generation (treatment, hotel, transfer, visa fee, platform fee)
- P0 — Deposit + balance payment scheduling
- P0 — Refund/cancellation processing per policy
- P1 — Regional payment method support (market-specific rails)
- P1 — Multi-currency display (settlement in a base currency)
- P2 — Installment/payment-plan options

## 11. Notifications
- P0 — Email notifications (transactional: booking confirmed, document needed, payment due)
- P0 — In-app notification center
- P1 — SMS notifications for time-sensitive events (visa ready, transfer confirmed)
- P2 — Push notifications (if/when a mobile app ships)

## 12. Operations Console (Case Manager / Admin)
- P0 — Unified case queue with SLA/priority indicators
- P0 — Case detail view (all patient info, documents, messages, itinerary in one place)
- P0 — Interpreter/driver assignment tools
- P0 — User & role management (admin)
- P0 — Content moderation (hospital listings, reviews)
- P1 — Commission/fee configuration per partner
- P1 — Platform analytics dashboard (funnel, revenue, hospital performance)
- P1 — Audit log of sensitive actions
- P2 — Automated SLA breach alerts

## 13. Reviews & Trust
- P0 — Post-treatment review submission (rating + text)
- P0 — Review moderation queue (admin)
- P1 — Verified-patient badge on reviews (only bookings that completed treatment can
  review)
- P2 — Photo/video testimonials

## 14. Content Management System (CMS)
- P1 — Blog/article authoring and publishing
- P1 — Destination/city guide pages
- P2 — Landing-page builder for campaigns

## 15. Analytics & Reporting
- P1 — Admin analytics dashboard (bookings, revenue, conversion funnel)
- P1 — Hospital performance reports
- P2 — Cohort/retention analysis, marketing attribution
