# Sitemap, Navigation & Information Architecture

## 1. Site Map (Full Platform)

```
Asia Health Link & Travel
│
├── Public / Marketing Site (unauthenticated)
│   ├── / (Landing / Home)
│   ├── /hospitals (Hospital Directory)
│   │   └── /hospitals/[slug] (Hospital Detail)
│   │       └── /hospitals/[slug]/doctors/[doctor-slug] (Doctor Detail)
│   ├── /specialties (Specialty index: Oncology, Cardiology, Orthopedics, Fertility, Health
│   │   Screening, TCM Wellness, ...)
│   │   └── /specialties/[slug] (Specialty landing page)
│   ├── /destinations (City guides: Beijing, Shanghai, Guangzhou, ...)
│   │   └── /destinations/[city-slug]
│   ├── /how-it-works
│   ├── /pricing (Illustrative pricing / package examples)
│   ├── /reviews (Aggregate testimonials)
│   ├── /blog
│   │   └── /blog/[slug]
│   ├── /about
│   ├── /partner-with-us (Hospital/hotel partner acquisition page)
│   ├── /faq
│   ├── /contact
│   ├── /privacy-policy
│   ├── /terms-of-service
│   ├── /login
│   ├── /register
│   └── /forgot-password
│
├── Patient Portal (authenticated: role = Patient)
│   ├── /app/dashboard (Overview: active cases, itinerary snapshot, notifications)
│   ├── /app/apply (New treatment application wizard)
│   ├── /app/cases (List of applications/cases)
│   │   └── /app/cases/[id]
│   │       ├── Overview (status, treatment plan, cost estimate)
│   │       ├── Documents (medical records, visa documents, invitation letter)
│   │       ├── Messages (thread with case manager / hospital)
│   │       ├── Itinerary (hospital visits, hotel, transfers)
│   │       └── Payments (invoices, deposit/balance status)
│   ├── /app/dependents (Manage family member profiles)
│   ├── /app/bookings/hotels
│   ├── /app/bookings/transfers
│   ├── /app/payments (Payment history across all cases)
│   ├── /app/reviews (Submit/manage reviews for completed cases)
│   ├── /app/notifications
│   └── /app/settings (Profile, security, language, notification preferences)
│
├── Hospital Portal (authenticated: role = Hospital Staff)
│   ├── /hospital/dashboard
│   ├── /hospital/profile (Hospital & department management)
│   ├── /hospital/doctors (Doctor roster management)
│   ├── /hospital/packages (Treatment packages & pricing)
│   ├── /hospital/applications (Incoming applications queue)
│   │   └── /hospital/applications/[id]
│   ├── /hospital/reports (Bookings, revenue, conversion)
│   └── /hospital/settings
│
├── Partner Portals (authenticated: role = Hotel Partner / Driver / Interpreter)
│   ├── /partner/hotel/dashboard, /inventory, /bookings
│   ├── /partner/driver/trips (assigned transfers)
│   └── /partner/interpreter/appointments (assigned sessions)
│
├── Operations Console (authenticated: role = Case Manager)
│   ├── /ops/queue (Case queue, SLA/priority view)
│   ├── /ops/cases/[id] (Unified case detail — mirrors patient case view + internal notes)
│   ├── /ops/assignments (Interpreter/driver assignment tools)
│   └── /ops/messages
│
└── Admin Console (authenticated: role = Platform Admin)
    ├── /admin/dashboard (Platform-wide analytics)
    ├── /admin/users (User & role management)
    ├── /admin/hospitals (Listing approval & moderation)
    ├── /admin/reviews (Review moderation queue)
    ├── /admin/finance (Commission configuration, transactions, payouts)
    ├── /admin/cms (Blog / destination guide content management)
    ├── /admin/audit-log
    └── /admin/settings (Platform-wide configuration)
```

## 2. Primary Navigation (Public Site — Desktop Header)

```
[Logo]   Hospitals ▾   Specialties ▾   Destinations ▾   How It Works   Blog        [Language ▾]  [Log In]  [Get Started →]
```
- "Hospitals ▾" dropdown: Browse All Hospitals, By City, By Specialty
- Language selector persists choice via cookie/account preference
- "Get Started" CTA is the primary conversion button, always visible (sticky header on
  scroll)

## 3. Primary Navigation (Patient Portal — Authenticated)

**Desktop:** Left sidebar, persistent
```
Dashboard
My Applications
My Dependents
Bookings (Hotels / Transfers)
Payments
Messages
Reviews
Notifications (bell icon, top bar)
Settings
[Account menu: profile, logout]
```

**Mobile:** Bottom tab bar (5 primary items) + hamburger for overflow
```
[Home] [Cases] [Messages] [Payments] [Menu]
```

## 4. Primary Navigation (Hospital / Ops / Admin Consoles)

Left sidebar pattern consistent across all internal consoles for shared muscle memory,
with role-specific menu items per the sitemap above. Top bar contains: global search
(cases/users, admin only), notifications, account menu.

## 5. Information Architecture Principles

1. **Role-based entry points.** After login, users land directly in their role's console
   (Patient → `/app/dashboard`, Hospital Staff → `/hospital/dashboard`, etc.) — no shared
   generic dashboard.
2. **Case-centric structure.** For Patients, Hospital Staff, and Case Managers alike, the
   "case" (an application/booking) is the central object that documents, messages,
   itinerary, and payments all nest under — avoiding scattered, hard-to-correlate views.
3. **Progressive disclosure.** The public site leads with trust-building content
   (accreditations, reviews, transparent pricing ranges) before asking for any personal
   information; the application wizard only requests sensitive medical data at the point
   it's needed.
4. **Consistent object model across roles.** The same case is viewed through different
   lenses (patient view vs. hospital view vs. case-manager view) rather than duplicated
   data structures — this drives the shared component patterns defined in Phase 2.
5. **Search & filter first for discovery.** The hospital directory is built around
   filters (specialty, city, price, language, rating) since patients typically start from
   a medical need, not a hospital name.
6. **Shallow depth.** No public page should require more than 3 clicks from the homepage;
   no authenticated action should require more than 2 clicks from the relevant dashboard.

## 6. URL & Slug Conventions

- Public marketing routes: lowercase, hyphenated, human-readable (`/hospitals/beijing-
  united-family-hospital`).
- Authenticated app routes: prefixed by portal (`/app/...`, `/hospital/...`, `/ops/...`,
  `/admin/...`, `/partner/...`) to make role scope obvious in the URL itself and simplify
  route-level access-control middleware.
- Resource IDs use opaque identifiers (UUID) in authenticated routes; public content uses
  SEO-friendly slugs.
