# Screen Specifications — Public / Marketing Site

Each screen spec lists: purpose, key sections (top to bottom), primary CTA, and
responsive notes. These are wireframe-level specs (layout & content, not pixel mockups) —
sufficient for frontend implementation without a separate Figma pass, though a visual
mockup pass is recommended before final build.

---

### Screen 01 — Home / Landing Page (`/`)
**Purpose:** Convert visitors into inquiries/registrations; establish trust immediately.
**Sections:**
1. Hero — headline ("World-class treatment in China, fully coordinated"), subheadline,
   primary CTA ("Find a Hospital") + secondary CTA ("How It Works"), trust strip below
   (accreditation logos, "X patients served", "X partner hospitals").
2. Specialty quick-links (icon grid: Oncology, Cardiology, Orthopedics, Fertility, Health
   Screening, TCM Wellness).
3. Featured hospitals carousel (Hospital Cards).
4. "How It Works" 4-step visual (Apply → Get Matched → Travel & Treat → Recover, with
   supporting icons).
5. Testimonials carousel (patient photo/quote/treatment type/rating).
6. Destination highlights (Beijing/Shanghai/Guangzhou city cards linking to guides).
7. Trust/security band (data privacy, verified hospitals, secure payments messaging).
8. Footer CTA banner + newsletter signup.
9. Global footer (sitemap links, language selector, social, legal links).
**Primary CTA:** "Get Started" / "Find a Hospital" → `/hospitals`.
**Mobile:** Sections stack; carousels become swipeable; hero CTA remains above the fold.

---

### Screen 02 — Hospital Directory (`/hospitals`)
**Purpose:** Discovery via filtering/comparison.
**Sections:** Filter sidebar (desktop) / filter drawer (mobile) — specialty, city, price
range, language, rating; search bar; sort dropdown (Relevance, Rating, Price); results
grid of Hospital Cards; pagination.
**Primary CTA:** "View Hospital" per card.
**Empty state:** No results — suggest broadening filters, link to "Talk to us" inquiry.

---

### Screen 03 — Hospital Detail (`/hospitals/[slug]`)
**Purpose:** Build confidence and drive an application.
**Sections:** Header (name, city, accreditation badges, rating, photo gallery); sticky
"Start Application" CTA card (desktop: right rail; mobile: sticky bottom bar); Tabs —
**Overview** (description, facilities, languages, accreditations detail), **Doctors**
(Doctor Card grid), **Packages** (treatment package cards with price ranges), **Reviews**
(verified patient reviews with rating breakdown).
**Primary CTA:** "Start Application" (persistent).

---

### Screen 04 — Doctor Detail (`/hospitals/[slug]/doctors/[doctor-slug]`)
**Purpose:** Individual credibility.
**Sections:** Photo, name, specialty, credentials/education, years of experience,
languages, bio, affiliated hospital link, patient reviews specific to doctor.
**Primary CTA:** "Start Application with Dr. [Name]".

---

### Screen 05 — Specialty Landing Page (`/specialties/[slug]`)
**Purpose:** SEO entry point + condition-specific trust content.
**Sections:** Hero (specialty name + short explainer), "Why choose China for [specialty]"
content block, list of hospitals offering this specialty, FAQ accordion specific to the
specialty (e.g., recovery time, typical costs), CTA band.

---

### Screen 06 — Destination / City Guide (`/destinations/[city-slug]`)
**Purpose:** Reduce travel-logistics anxiety, support hotel/transfer upsell later.
**Sections:** City overview, climate/best-time-to-visit, list of hospitals in city, list
of partner hotels in city, transport/visa notes, FAQ.

---

### Screen 07 — How It Works (`/how-it-works`)
**Purpose:** Full-funnel explainer for hesitant visitors.
**Sections:** Step-by-step journey (mirrors Journey 1 in `03-user-journeys.md`) with
expanded detail per step, embedded FAQ, embedded testimonial, CTA.

---

### Screen 08 — Pricing / Packages Overview (`/pricing`)
**Purpose:** Address the #1 objection (cost transparency) proactively.
**Sections:** Illustrative package price ranges by specialty (clearly marked "estimate,
confirmed after medical review"), what's included/excluded per package tier (Standard vs.
VIP concierge), CTA to get a personalized estimate.

---

### Screen 09 — Reviews / Testimonials Hub (`/reviews`)
**Purpose:** Aggregate social proof.
**Sections:** Overall rating summary, filter by specialty/hospital, review list (Verified
Patient badge), pagination.

---

### Screen 10 — Blog Index (`/blog`) & Screen 11 — Blog Article (`/blog/[slug]`)
**Purpose:** SEO + patient education.
**Sections (index):** Featured article, category filter, article card grid.
**Sections (article):** Article header (title, author/case-manager byline, date, read
time), body content, related articles, CTA band.

---

### Screen 12 — About Us (`/about`)
**Purpose:** Founder/company credibility.
**Sections:** Mission statement, team/founder bios, accreditation partnerships,
press/media mentions (if any), CTA.

---

### Screen 13 — Partner With Us (`/partner-with-us`)
**Purpose:** B2B acquisition (hospitals, hotels).
**Sections:** Value proposition for hospitals ("Reach international patients"), value
prop for hotels/drivers/interpreters, application form, FAQ for partners.

---

### Screen 14 — FAQ (`/faq`)
**Purpose:** Reduce support load.
**Sections:** Categorized accordion (Applying, Visa, Payments, Travel, Cancellations),
search bar, "Still need help? Contact us" CTA.

---

### Screen 15 — Contact (`/contact`)
**Purpose:** Low-friction inquiry path for undecided visitors.
**Sections:** Contact form (name, email, phone, message, optional specialty interest),
direct contact info, office/hours info, live-chat entry point (P2).

---

### Screen 16 — Privacy Policy (`/privacy-policy`) & Screen 17 — Terms of Service
(`/terms-of-service`)
**Purpose:** Legal transparency.
**Sections:** Long-form legal text (content from `08-privacy-policy.md` /
`09-terms-of-service.md`), table of contents sidebar for long-page navigation, last-
updated date.

---

### Screen 18 — Login (`/login`)
**Sections:** Email/phone + password fields, "Forgot password?" link, social login
buttons (P2), link to Register, role-aware redirect after login (routes to correct
portal per Sitemap §5.1).

---

### Screen 19 — Register (`/register`)
**Sections:** Name, email/phone, password, terms/privacy consent checkbox (explicit,
separate from a "receive marketing emails" opt-in per NFR-COMP-02), CTA "Create Account",
link to Login.

---

### Screen 20 — Verify Account (`/verify`)
**Sections:** OTP input (6-digit), resend-code timer, success state auto-redirects to
onboarding/dashboard.

---

### Screen 21 — Forgot / Reset Password (`/forgot-password`, `/reset-password`)
**Sections:** Email/phone input → confirmation message → (via emailed link) new-password
form with strength indicator.
