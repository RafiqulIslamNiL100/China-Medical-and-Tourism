# Business Requirements Document (BRD)

## 1. Executive Summary

**Asia Health Link and Travel** (working name: "AHLT Platform") is a two-sided marketplace and
service platform that connects international patients with accredited hospitals and doctors
in China, and bundles the medical journey with the logistics of travel: visa support, hotel
booking, airport transfers, interpretation, and concierge care.

The platform's core value proposition is **"Book world-class treatment in China as easily as
booking a flight and hotel — with every step of the journey coordinated in one place."**

## 2. Business Context

### 2.1 Problem Statement

International patients seeking treatment in China (or Chinese-speaking patients from the
diaspora seeking treatment back home) face significant friction:

- No centralized way to discover and compare hospitals, specialties, and doctors.
- No transparent pricing or treatment-package information.
- Visa, invitation letters, and immigration paperwork are handled ad hoc, often through
  unlicensed "medical brokers" with no accountability.
- Travel logistics (flights, hotels, local transport, interpreters) are arranged separately
  from the medical booking, causing scheduling conflicts and higher costs.
- Patients have no single point of contact or case manager throughout the journey.
- Hospitals lack a reliable digital channel to reach international patients and manage
  inbound medical tourism demand.

### 2.2 Business Opportunity

- China's medical tourism sector is growing, driven by advanced hospital infrastructure,
  competitive pricing versus US/EU/private Asian alternatives, and government initiatives
  to attract international patients (e.g., medical visa reforms in major cities).
- A structured platform captures value at multiple points: booking commissions from
  hospitals, margin on hotel/transport bundling, visa-service fees, and premium concierge
  subscriptions.
- Being the "trusted intermediary" builds a defensible position: hospitals get a vetted
  patient pipeline, patients get a single accountable partner.

### 2.3 Business Model

| Revenue Stream | Description |
|---|---|
| Hospital referral commission | Percentage fee or flat fee per confirmed booking, paid by partner hospitals. |
| Travel/hotel margin | Markup on hotel bookings and airport transfers arranged through the platform. |
| Visa & documentation service fee | Flat fee for invitation letter processing and visa application support. |
| Concierge / VIP packages | Premium tier bundling private interpreter, dedicated case manager, luxury accommodation. |
| Advertising / featured placement | Hospitals or clinics may pay for featured listing placement (must remain clearly labeled to preserve trust). |

## 3. Strategic Goals

1. Launch with a curated network of accredited partner hospitals in 2–3 major Chinese
   cities (e.g., Beijing, Shanghai, Guangzhou) within the first operating year.
2. Achieve a fully digital, self-service patient booking flow requiring minimal manual
   intervention by internal staff, backed by a human case-manager escalation path.
3. Build trust through transparency: verified hospital credentials, published pricing
   ranges, verified patient reviews.
4. Establish repeatable, auditable operational workflows for visa/invitation-letter
   processing, since this is a regulated, error-sensitive process.
5. Design the platform to scale to additional countries/regions and additional service
   categories (e.g., wellness tourism, dental tourism, elective/cosmetic tourism) without
   re-architecture.

## 4. Stakeholders

| Stakeholder | Interest |
|---|---|
| Founder / Product Owner | Overall product success, revenue, brand trust |
| International Patients | Safe, transparent, affordable, well-coordinated medical care |
| Partner Hospitals & Doctors | Qualified patient pipeline, minimal admin overhead, brand reputation |
| Internal Operations / Case Managers | Tools to manage applications, communicate with patients and hospitals |
| Hotel & Transport Partners | Booking volume, reliable payment |
| Interpreters / Drivers (Gig Partners) | Assignment visibility, payment, schedule management |
| Regulators / Immigration Authorities | Compliant handling of visa and invitation-letter processes |
| Platform Admins | Content moderation, dispute resolution, financial oversight |

## 5. Target Markets (Initial Launch)

- **Primary patient markets:** Africa (Nigeria, Kenya, Ethiopia, Tanzania), South & Southeast
  Asia (Bangladesh, Pakistan, Indonesia), Middle East, Central Asia/CIS.
- **Primary destination cities:** Beijing, Shanghai, Guangzhou (expandable to Chengdu,
  Shenzhen, Hangzhou in later phases).
- **Primary treatment categories at launch:** Oncology, cardiology, orthopedics,
  fertility/IVF, general health screening (checkup packages), traditional Chinese medicine
  (TCM) wellness programs.

## 6. Success Metrics (Business KPIs)

| KPI | Target (Year 1) |
|---|---|
| Verified partner hospitals onboarded | 15–25 |
| Completed patient bookings | 500+ |
| Average time from inquiry to confirmed booking | < 5 business days |
| Visa application approval rate (platform-assisted) | > 90% |
| Patient satisfaction (post-treatment survey, CSAT) | > 4.5 / 5 |
| Repeat/referral bookings | > 15% of total bookings |
| Hospital partner retention (year over year) | > 80% |

## 7. Constraints & Assumptions

- The platform does not provide medical advice or diagnosis; it facilitates discovery,
  scheduling, and logistics. Medical decisions remain between patient and hospital/doctor.
- Visa issuance is controlled by Chinese immigration authorities; the platform can only
  prepare and submit supporting documentation (e.g., invitation letters), not guarantee
  approval.
- Payment processing must support international cards and, where feasible, regional
  payment rails relevant to target markets.
- All patient health data must be handled under strict privacy and data-protection
  standards given its sensitivity (see Non-Functional Requirements — Security & Compliance).
- Multi-language support is required from day one (minimum: English, Chinese; expandable to
  French, Arabic, Bengali, Russian in later phases).

## 8. Out of Scope (Phase 1 Launch)

- Direct telemedicine / video consultation booking (candidate for a later phase).
- Insurance claim processing and integration with international insurers.
- In-app real-time medical record exchange with hospital EMR systems (initially, document
  upload/download only).
- Marketplace for medications or pharmacy delivery.
