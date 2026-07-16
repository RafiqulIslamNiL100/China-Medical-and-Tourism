/**
 * Demo data seed — mirrors the canonical frontend mock data in
 * apps/web/src/data/*.ts (hospitals.ts, patient.ts, hospitalStaff.ts,
 * opsConsole.ts, partner.ts, admin.ts) so the two stay recognizably in sync
 * once the frontend is wired to this API. Safe to re-run: exits early if
 * the platform already has hospitals.
 *
 * All demo accounts share the password: Passw0rd!23
 */
const {
  PrismaClient,
  UserRole,
  UserStatus,
  HospitalListingStatus,
  PackageStatus,
  CaseStatus,
  DocumentCategory,
  DocumentStatus,
  InvoiceStatus,
  HotelBookingStatus,
  ServiceAssignmentStatus,
  TransferDirection,
  ReviewStatus,
  ArticleStatus,
  PartnerType,
} = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();
// Override with SEED_DEMO_PASSWORD when seeding any shared/production environment —
// the default below is written in a public repo and must never guard real accounts.
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "Passw0rd!23";

async function main() {
  // Guard on a demo-specific hospital, NOT just any hospital: the FAH-XJTU reference
  // hospital is inserted by the 20260716160000_seed_fah_xjtu_hospital migration (which
  // runs via `prisma migrate deploy` on every environment), so `findFirst()` would
  // otherwise see it and wrongly skip seeding the demo fixtures on a fresh database.
  const alreadySeeded = await prisma.hospital.findFirst({ where: { slug: "beijing-united-family-hospital" } });
  if (alreadySeeded) {
    console.log("Demo data already present (beijing-united-family-hospital exists) — skipping seed.");
    return;
  }

  const passwordHash = await argon2.hash(DEMO_PASSWORD);
  const now = new Date();

  // --- Cities ------------------------------------------------------------
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        slug: "beijing",
        name: "Beijing",
        tagline: "China's medical capital — top-tier academic hospitals and specialist centers.",
        climate: "Continental — hot summers, cold winters. Best visited spring or autumn.",
      },
    }),
    prisma.city.create({
      data: {
        slug: "shanghai",
        name: "Shanghai",
        tagline: "International hospitals with strong English-speaking staff and modern facilities.",
        climate: "Humid subtropical — mild winters, hot humid summers.",
      },
    }),
    prisma.city.create({
      data: {
        slug: "guangzhou",
        name: "Guangzhou",
        tagline: "A gateway city with excellent TCM integration and growing specialist capacity.",
        climate: "Humid subtropical — warm year-round, wettest in summer.",
      },
    }),
  ]);
  console.log(`Seeded ${cities.length} cities.`);

  // --- Specialties ---------------------------------------------------------
  // skipDuplicates: several of these slugs (cardiology, oncology, orthopedics, fertility,
  // tcm-wellness) are also inserted by the FAH-XJTU migration that runs before the seed,
  // so without this the createMany would hit unique-constraint violations on a fresh DB.
  await prisma.specialty.createMany({
    skipDuplicates: true,
    data: [
      { slug: "oncology", name: "Oncology", blurb: "Advanced cancer diagnostics, surgical oncology, radiotherapy, and immunotherapy." },
      { slug: "cardiology", name: "Cardiology", blurb: "Interventional cardiology, bypass surgery, and structural heart repair." },
      { slug: "orthopedics", name: "Orthopedics", blurb: "Joint replacement, sports medicine, and complex spine surgery." },
      { slug: "fertility", name: "Fertility & IVF", blurb: "IVF, fertility preservation, and reproductive endocrinology." },
      { slug: "health-screening", name: "Health Screening", blurb: "Comprehensive executive health checkups and early-detection panels." },
      { slug: "tcm-wellness", name: "TCM Wellness", blurb: "Traditional Chinese Medicine programs for recovery and preventive health." },
    ],
  });
  console.log("Seeded 6 specialties.");

  // --- Hospitals, doctors, packages ---------------------------------------
  const beijingUnited = await prisma.hospital.create({
    data: {
      slug: "beijing-united-family-hospital",
      name: "Beijing United Family Hospital",
      citySlug: "beijing",
      languages: ["English", "Mandarin", "Arabic"],
      rating: 4.8,
      reviewCount: 212,
      priceTier: "$$$",
      accreditations: ["JCI Accredited", "ISO 9001"],
      status: HospitalListingStatus.Published,
      description:
        "A JCI-accredited international hospital in Beijing combining Western clinical standards with access to leading Chinese specialists. Beijing United serves international patients with a dedicated case-coordination team and on-site interpretation in six languages.",
      facilities: [
        "24/7 international emergency department",
        "Dedicated international patient lounge",
        "On-site pharmacy stocking imported medication",
        "Private recovery suites",
      ],
      doctors: {
        create: [
          {
            slug: "li-wei",
            name: "Dr. Li Wei",
            specialtySlug: "cardiology",
            credentials: "MD, PhD — Peking Union Medical College",
            yearsExperience: 22,
            languages: ["English", "Mandarin"],
            bio: "Dr. Li specializes in complex coronary interventions and structural heart repair, with over 3,000 procedures performed and training at Cleveland Clinic.",
          },
          {
            slug: "chen-min",
            name: "Dr. Chen Min",
            specialtySlug: "oncology",
            credentials: "MD — Peking University Health Science Center",
            yearsExperience: 18,
            languages: ["English", "Mandarin"],
            bio: "Dr. Chen leads the hospital's tumor board and specializes in minimally invasive oncologic surgery for gastrointestinal cancers.",
          },
        ],
      },
      packages: {
        create: [
          {
            name: "Coronary Angioplasty Package",
            specialtySlug: "cardiology",
            priceMinUsd: 12000,
            priceMaxUsd: 18000,
            description:
              "Full diagnostic workup, angioplasty procedure, 3-night private recovery stay, and a 30-day follow-up plan.",
            includes: ["Pre-op diagnostics", "Procedure & anesthesia", "3-night private room", "Follow-up consultation"],
            status: PackageStatus.Active,
          },
          {
            name: "Executive Health Screening",
            specialtySlug: "health-screening",
            priceMinUsd: 1200,
            priceMaxUsd: 2500,
            description:
              "A comprehensive one-day screening panel including imaging, bloodwork, and a same-day specialist consultation.",
            includes: ["Full-body imaging", "Comprehensive bloodwork", "Cardiology consult", "Same-day results review"],
            status: PackageStatus.Active,
          },
        ],
      },
    },
    include: { doctors: true, packages: true },
  });

  const shanghaiEast = await prisma.hospital.create({
    data: {
      slug: "shanghai-east-hospital",
      name: "Shanghai East Hospital",
      citySlug: "shanghai",
      languages: ["English", "Mandarin", "Russian"],
      rating: 4.7,
      reviewCount: 168,
      priceTier: "$$",
      accreditations: ["JCI Accredited"],
      status: HospitalListingStatus.Published,
      description:
        "Shanghai East Hospital's International Medical Center pairs a high-volume orthopedic surgery program with one of the region's leading reproductive medicine departments, serving patients from over 40 countries annually.",
      facilities: [
        "Robotic-assisted joint replacement suite",
        "IVF laboratory with cryopreservation",
        "International patient concierge desk",
        "On-site physiotherapy gym",
      ],
      doctors: {
        create: [
          {
            slug: "wang-fang",
            name: "Dr. Wang Fang",
            specialtySlug: "orthopedics",
            credentials: "MD — Shanghai Jiao Tong University",
            yearsExperience: 16,
            languages: ["English", "Mandarin"],
            bio: "Dr. Wang performs over 200 robotic-assisted knee and hip replacements annually and trains internationally on minimally invasive technique.",
          },
          {
            slug: "zhou-yan",
            name: "Dr. Zhou Yan",
            specialtySlug: "fertility",
            credentials: "MD, PhD — Fudan University",
            yearsExperience: 14,
            languages: ["English", "Mandarin", "Russian"],
            bio: "Dr. Zhou has guided over 1,500 IVF cycles and specializes in fertility preservation for patients with complex medical histories.",
          },
        ],
      },
      packages: {
        create: [
          {
            name: "Total Knee Replacement",
            specialtySlug: "orthopedics",
            priceMinUsd: 15000,
            priceMaxUsd: 22000,
            description:
              "Robotic-assisted single knee replacement with a 5-night stay and a structured 6-week physiotherapy plan.",
            includes: ["Pre-op imaging", "Robotic-assisted surgery", "5-night stay", "6-week physiotherapy plan"],
            status: PackageStatus.Active,
          },
          {
            name: "IVF Cycle Package",
            specialtySlug: "fertility",
            priceMinUsd: 6000,
            priceMaxUsd: 9500,
            description:
              "A single IVF cycle including stimulation monitoring, retrieval, and transfer, with optional cryopreservation.",
            includes: ["Ovarian stimulation monitoring", "Egg retrieval", "Embryo transfer", "Cryopreservation (optional)"],
            status: PackageStatus.Active,
          },
        ],
      },
    },
    include: { doctors: true, packages: true },
  });

  const guangzhouFirst = await prisma.hospital.create({
    data: {
      slug: "guangzhou-first-peoples-hospital",
      name: "Guangzhou First People's Hospital — International Center",
      citySlug: "guangzhou",
      languages: ["English", "Mandarin", "Cantonese"],
      rating: 4.6,
      reviewCount: 94,
      priceTier: "$$",
      accreditations: ["ISO 9001", "National Tertiary Hospital (Grade A)"],
      status: HospitalListingStatus.Published,
      description:
        "Guangzhou First People's Hospital blends a strong Traditional Chinese Medicine department with modern cardiology and diagnostic capability, popular with patients seeking integrated recovery and wellness programs alongside conventional treatment.",
      facilities: [
        "Dedicated TCM treatment wing",
        "Cardiac catheterization lab",
        "International patient guesthouse partnership",
        "Herbal pharmacy on-site",
      ],
      doctors: {
        create: [
          {
            slug: "liu-jing",
            name: "Dr. Liu Jing",
            specialtySlug: "tcm-wellness",
            credentials: "MD (TCM) — Guangzhou University of Chinese Medicine",
            yearsExperience: 25,
            languages: ["English", "Mandarin", "Cantonese"],
            bio: "Dr. Liu integrates TCM protocols with post-surgical recovery plans and has published widely on integrative cardiac rehabilitation.",
          },
        ],
      },
      packages: {
        create: [
          {
            name: "TCM Recovery & Wellness Program",
            specialtySlug: "tcm-wellness",
            priceMinUsd: 1800,
            priceMaxUsd: 3200,
            description:
              "A 10-day integrative program combining acupuncture, herbal medicine, and dietary therapy for post-treatment recovery.",
            includes: ["Initial TCM diagnosis", "10 days of treatment sessions", "Personalized herbal regimen", "Dietary therapy plan"],
            status: PackageStatus.Active,
          },
        ],
      },
    },
    include: { doctors: true, packages: true },
  });
  console.log("Seeded 3 hospitals with doctors and packages.");

  const doctor = (hospital, slug) => hospital.doctors.find((d) => d.slug === slug);

  // --- Staff & platform users ----------------------------------------------
  const admin = await prisma.user.create({
    data: {
      email: "sarah.chen@asiahealthlink.com",
      passwordHash,
      role: UserRole.admin,
      status: UserStatus.Active,
      emailVerifiedAt: now,
    },
  });

  const jingZhao = await prisma.user.create({
    data: {
      email: "jing.zhao@buf-hospital.cn",
      passwordHash,
      role: UserRole.hospital_staff,
      status: UserStatus.Active,
      emailVerifiedAt: now,
      hospitalStaffProfile: { create: { hospitalId: beijingUnited.id, title: "International Patient Coordinator" } },
    },
  });

  await prisma.user.create({
    data: {
      email: "ex-staff@buf-hospital.cn",
      passwordHash,
      role: UserRole.hospital_staff,
      status: UserStatus.Deactivated,
      emailVerifiedAt: now,
      hospitalStaffProfile: { create: { hospitalId: beijingUnited.id, title: "Former Coordinator" } },
    },
  });

  const liWeiCaseManager = await prisma.user.create({
    data: {
      email: "li.wei@asiahealthlink.com",
      passwordHash,
      role: UserRole.case_manager,
      status: UserStatus.Active,
      emailVerifiedAt: now,
    },
  });

  const zhangWei = await prisma.user.create({
    data: {
      email: "zhang.wei@drivers.cmt.com",
      passwordHash,
      role: UserRole.driver,
      status: UserStatus.Active,
      emailVerifiedAt: now,
      driverProfile: { create: { fullName: "Zhang Wei" } },
    },
    include: { driverProfile: true },
  });

  const sunLi = await prisma.user.create({
    data: {
      email: "sun.li@interpreters.cmt.com",
      passwordHash,
      role: UserRole.interpreter,
      status: UserStatus.Active,
      emailVerifiedAt: now,
      interpreterProfile: { create: { fullName: "Sun Li", languages: ["English", "Mandarin"] } },
    },
    include: { interpreterProfile: true },
  });

  const hotelPartnerUser = await prisma.user.create({
    data: {
      email: "bookings@riverside-suites.cn",
      passwordHash,
      role: UserRole.hotel_partner,
      status: UserStatus.Active,
      emailVerifiedAt: now,
      hotelPartnerProfile: { create: {} },
    },
    include: { hotelPartnerProfile: true },
  });

  const riversideSuites = await prisma.hotel.create({
    data: {
      hotelPartnerId: hotelPartnerUser.hotelPartnerProfile.id,
      name: "Beijing Riverside Suites",
      citySlug: "beijing",
      roomTypes: {
        create: [
          { name: "Standard Queen", roomCount: 12, baseRateUsd: 95 },
          { name: "Deluxe King", roomCount: 8, baseRateUsd: 120 },
          { name: "Suite (2-room)", roomCount: 4, baseRateUsd: 210 },
        ],
      },
    },
    include: { roomTypes: true },
  });
  console.log("Seeded staff, driver, interpreter, hotel partner + hotel.");

  // --- Patients & cases ------------------------------------------------------
  async function createPatient(email, fullName, phone, country) {
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.patient,
        status: UserStatus.Active,
        emailVerifiedAt: now,
        patientProfile: { create: { fullName, phone, country } },
      },
      include: { patientProfile: true },
    });
  }

  const amara = await createPatient("amara.nwosu@example.com", "Amara Nwosu", "+234 803 555 0142", "Nigeria");
  await prisma.dependent.create({
    data: {
      patientId: amara.patientProfile.id,
      fullName: "Chidi Nwosu",
      relationship: "Father",
      dateOfBirth: new Date("1958-03-11"),
    },
  });

  const farrukh = await createPatient("farrukh.tashkentov@example.com", "Farrukh Tashkentov", null, "Uzbekistan");
  const grace = await createPatient("grace.otieno@example.com", "Grace Otieno", null, "Kenya");
  const michael = await createPatient("michael.asante@example.com", "Michael Asante", null, "Ghana");
  console.log("Seeded 4 patients (+1 dependent).");

  // Case 1 — Amara — Accepted, Beijing United, Cardiology (AHLT-2026-1042)
  const case1042 = await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-1042",
      patientId: amara.patientProfile.id,
      hospitalId: beijingUnited.id,
      doctorId: doctor(beijingUnited, "li-wei").id,
      specialtySlug: "cardiology",
      conditionSummary: "Coronary artery disease, candidate for angioplasty.",
      medications: "None",
      allergies: "None reported",
      status: CaseStatus.Accepted,
      submittedAt: new Date("2026-06-18T09:00:00Z"),
      caseManagerUserId: liWeiCaseManager.id,
      treatmentPlan: "Coronary angioplasty with a 3-night private recovery stay, followed by a 30-day remote follow-up plan.",
      costEstimateMinUsd: 12000,
      costEstimateMaxUsd: 18000,
      statusHistory: {
        create: [
          { status: CaseStatus.Submitted, createdAt: new Date("2026-06-18T09:00:00Z"), changedByUserId: amara.id },
          { status: CaseStatus.Accepted, note: "Case manager assigned — Li Wei", createdAt: new Date("2026-06-19T10:00:00Z"), changedByUserId: liWeiCaseManager.id },
        ],
      },
      documents: {
        create: [
          { name: "Recent ECG report", category: DocumentCategory.MedicalRecords, status: DocumentStatus.Verified, verifiedByUserId: liWeiCaseManager.id, verifiedAt: new Date("2026-06-20T00:00:00Z") },
          { name: "Passport photo page", category: DocumentCategory.IdentityDocuments, status: DocumentStatus.NotUploaded },
          { name: "Proof of funds", category: DocumentCategory.VisaDocuments, status: DocumentStatus.NotUploaded },
          { name: "Invitation letter", category: DocumentCategory.VisaDocuments, status: DocumentStatus.NotUploaded, note: "Issued after passport is verified" },
        ],
      },
      messages: {
        create: [
          { senderUserId: liWeiCaseManager.id, body: "Welcome, Amara! I'll be coordinating your treatment from here. Your treatment plan is attached above — let me know if you have any questions.", createdAt: new Date("2026-06-19T09:12:00Z") },
          { senderUserId: amara.id, body: "Thank you! The plan looks good. When should I plan to arrive in Beijing?", createdAt: new Date("2026-06-20T14:03:00Z") },
          { senderUserId: liWeiCaseManager.id, body: "Once your visa is approved we'll confirm exact dates, but plan to arrive 2 days before your procedure date for pre-op diagnostics.", createdAt: new Date("2026-06-20T15:47:00Z") },
        ],
      },
      invoices: {
        create: [
          { description: "Booking deposit", amountUsd: 3000, status: InvoiceStatus.Paid, createdAt: new Date("2026-06-25T00:00:00Z") },
          { description: "Treatment balance", amountUsd: 12000, status: InvoiceStatus.Due, dueDate: new Date("2026-07-20T00:00:00Z") },
        ],
      },
    },
  });
  await prisma.transferRequest.create({
    data: {
      applicationId: case1042.id,
      direction: TransferDirection.Arrival,
      scheduledAt: new Date("2026-07-28T06:00:00Z"),
      pickupLocation: "Beijing Capital International Airport",
      status: ServiceAssignmentStatus.Requested,
    },
  });
  await prisma.interpreterAssignment.create({
    data: {
      applicationId: case1042.id,
      hospitalVisitAt: new Date("2026-07-28T09:00:00Z"),
      department: "Cardiology",
      note: "Pre-op diagnostics visit",
      status: ServiceAssignmentStatus.Requested,
    },
  });
  await prisma.hotelBooking.create({
    data: {
      hotelId: riversideSuites.id,
      roomTypeId: riversideSuites.roomTypes.find((r) => r.name === "Deluxe King").id,
      applicationId: case1042.id,
      guestName: "Amara Nwosu",
      checkIn: new Date("2026-07-26T00:00:00Z"),
      checkOut: new Date("2026-07-31T00:00:00Z"),
      status: HotelBookingStatus.Pending,
    },
  });

  // Case 2 — Amara — UnderReview, Shanghai East, Orthopedics (AHLT-2026-0981)
  await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-0981",
      patientId: amara.patientProfile.id,
      hospitalId: shanghaiEast.id,
      doctorId: doctor(shanghaiEast, "wang-fang").id,
      specialtySlug: "orthopedics",
      conditionSummary: "Chronic knee pain, prior MRI shows cartilage wear consistent with osteoarthritis.",
      medications: "Ibuprofen as needed",
      allergies: "None reported",
      status: CaseStatus.UnderReview,
      submittedAt: new Date("2026-07-05T00:00:00Z"),
      statusHistory: { create: [{ status: CaseStatus.Submitted, createdAt: new Date("2026-07-05T00:00:00Z"), changedByUserId: amara.id }] },
      documents: {
        create: [
          { name: "Knee MRI report", category: DocumentCategory.MedicalRecords, status: DocumentStatus.Uploaded },
          { name: "Referral letter", category: DocumentCategory.MedicalRecords, status: DocumentStatus.NotUploaded },
        ],
      },
    },
  });

  // Case 3 — Amara — Completed, Beijing United, Health Screening (AHLT-2026-0754)
  const case0754 = await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-0754",
      patientId: amara.patientProfile.id,
      hospitalId: beijingUnited.id,
      doctorId: doctor(beijingUnited, "chen-min").id,
      specialtySlug: "health-screening",
      conditionSummary: "Routine executive health screening — no acute symptoms.",
      medications: "None",
      allergies: "None reported",
      status: CaseStatus.Completed,
      submittedAt: new Date("2026-01-10T00:00:00Z"),
      caseManagerUserId: liWeiCaseManager.id,
      treatmentPlan: "Executive Health Screening — full-body imaging, bloodwork, and specialist consult.",
      costEstimateMinUsd: 1200,
      costEstimateMaxUsd: 2500,
      statusHistory: {
        create: [
          { status: CaseStatus.Submitted, createdAt: new Date("2026-01-10T00:00:00Z"), changedByUserId: amara.id },
          { status: CaseStatus.Accepted, createdAt: new Date("2026-01-12T00:00:00Z"), changedByUserId: liWeiCaseManager.id },
          { status: CaseStatus.Completed, note: "Treatment completed", createdAt: new Date("2026-02-02T00:00:00Z"), changedByUserId: liWeiCaseManager.id },
        ],
      },
      documents: {
        create: [{ name: "Screening results summary", category: DocumentCategory.MedicalRecords, status: DocumentStatus.Verified, verifiedByUserId: liWeiCaseManager.id, verifiedAt: new Date("2026-02-03T00:00:00Z") }],
      },
      invoices: {
        create: [{ description: "Executive Health Screening — full payment", amountUsd: 1850, status: InvoiceStatus.Paid, createdAt: new Date("2026-01-15T00:00:00Z") }],
      },
    },
  });
  await prisma.review.create({
    data: {
      applicationId: case0754.id,
      patientId: amara.patientProfile.id,
      hospitalId: beijingUnited.id,
      rating: 5,
      text: "From the first email to my flight home, the coordination was flawless. The screening results were explained clearly and the recovery suite was better than some hotels I've stayed in.",
      status: ReviewStatus.Approved,
      moderatedByUserId: admin.id,
      moderatedAt: new Date("2026-02-18T00:00:00Z"),
    },
  });
  console.log("Seeded Amara Nwosu's 3 cases with documents, messages, invoices, transfer, interpreter session, hotel booking, and a review.");

  // Case — Farrukh — Submitted, Beijing United, Cardiology (AHLT-2026-2201)
  await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-2201",
      patientId: farrukh.patientProfile.id,
      hospitalId: beijingUnited.id,
      specialtySlug: "cardiology",
      conditionSummary: "Recurring chest pain, diagnosed with coronary artery narrowing via CT angiogram in home country. Seeking evaluation for angioplasty.",
      medications: "Atorvastatin 20mg daily, Aspirin 75mg daily",
      allergies: "None reported",
      status: CaseStatus.Submitted,
      submittedAt: new Date("2026-07-10T00:00:00Z"),
      statusHistory: { create: [{ status: CaseStatus.Submitted, createdAt: new Date("2026-07-10T00:00:00Z"), changedByUserId: farrukh.id }] },
      documents: {
        create: [
          { name: "CT angiogram report", category: DocumentCategory.MedicalRecords, status: DocumentStatus.Uploaded },
          { name: "Recent bloodwork", category: DocumentCategory.MedicalRecords, status: DocumentStatus.Uploaded },
          { name: "Referral letter", category: DocumentCategory.MedicalRecords, status: DocumentStatus.NotUploaded },
        ],
      },
    },
  });

  // Cases — Grace — UnderReview (Health Screening) + Completed (Knee, for review)
  await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-2198",
      patientId: grace.patientProfile.id,
      hospitalId: beijingUnited.id,
      specialtySlug: "health-screening",
      conditionSummary: "Requesting comprehensive executive health screening ahead of a planned relocation — no acute symptoms.",
      medications: "None",
      allergies: "Penicillin",
      status: CaseStatus.UnderReview,
      submittedAt: new Date("2026-07-09T00:00:00Z"),
      statusHistory: { create: [{ status: CaseStatus.Submitted, createdAt: new Date("2026-07-09T00:00:00Z"), changedByUserId: grace.id }] },
      documents: { create: [{ name: "Prior screening summary (2024)", category: DocumentCategory.MedicalRecords, status: DocumentStatus.Uploaded }] },
    },
  });

  const graceKnee = await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-1877",
      patientId: grace.patientProfile.id,
      hospitalId: shanghaiEast.id,
      doctorId: doctor(shanghaiEast, "wang-fang").id,
      specialtySlug: "orthopedics",
      conditionSummary: "Advanced osteoarthritis of the right knee, candidate for total knee replacement.",
      medications: "None",
      allergies: "None reported",
      status: CaseStatus.Completed,
      submittedAt: new Date("2025-11-20T00:00:00Z"),
      caseManagerUserId: liWeiCaseManager.id,
      treatmentPlan: "Robotic-assisted total knee replacement with a 5-night stay and 6-week physiotherapy plan.",
      costEstimateMinUsd: 15000,
      costEstimateMaxUsd: 22000,
      statusHistory: {
        create: [
          { status: CaseStatus.Submitted, createdAt: new Date("2025-11-20T00:00:00Z"), changedByUserId: grace.id },
          { status: CaseStatus.Completed, note: "Treatment completed", createdAt: new Date("2025-12-02T00:00:00Z"), changedByUserId: liWeiCaseManager.id },
        ],
      },
      invoices: { create: [{ description: "Total Knee Replacement — full payment", amountUsd: 18500, status: InvoiceStatus.Paid, createdAt: new Date("2025-11-25T00:00:00Z") }] },
    },
  });
  await prisma.review.create({
    data: {
      applicationId: graceKnee.id,
      patientId: grace.patientProfile.id,
      hospitalId: shanghaiEast.id,
      rating: 4,
      text: "Excellent surgical outcome. The only friction was hotel check-in timing, which the platform's case manager sorted out quickly.",
      status: ReviewStatus.Approved,
      moderatedByUserId: admin.id,
      moderatedAt: new Date("2025-12-10T00:00:00Z"),
    },
  });
  await prisma.transferRequest.create({
    data: {
      applicationId: graceKnee.id,
      direction: TransferDirection.Arrival,
      scheduledAt: new Date("2025-11-28T06:00:00Z"),
      pickupLocation: "Shanghai Pudong International Airport",
      driverId: zhangWei.driverProfile.id,
      status: ServiceAssignmentStatus.Completed,
    },
  });

  // Cases — Michael — InfoRequested (Cardiology) + Completed (TCM, for review)
  await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-2185",
      patientId: michael.patientProfile.id,
      hospitalId: beijingUnited.id,
      specialtySlug: "cardiology",
      conditionSummary: "Reports shortness of breath on exertion. No prior cardiac workup available yet.",
      medications: "Lisinopril 10mg daily",
      allergies: "None reported",
      status: CaseStatus.InfoRequested,
      submittedAt: new Date("2026-07-01T00:00:00Z"),
      statusHistory: {
        create: [
          { status: CaseStatus.Submitted, createdAt: new Date("2026-07-01T00:00:00Z"), changedByUserId: michael.id },
          { status: CaseStatus.InfoRequested, note: "Please upload a recent ECG report.", createdAt: new Date("2026-07-04T00:00:00Z"), changedByUserId: jingZhao.id },
        ],
      },
      documents: { create: [{ name: "ECG report", category: DocumentCategory.MedicalRecords, status: DocumentStatus.NotUploaded }] },
    },
  });

  const michaelTcm = await prisma.application.create({
    data: {
      refNumber: "AHLT-2026-1690",
      patientId: michael.patientProfile.id,
      hospitalId: guangzhouFirst.id,
      doctorId: doctor(guangzhouFirst, "liu-jing").id,
      specialtySlug: "tcm-wellness",
      conditionSummary: "Post-surgical recovery support following an overseas cardiac procedure.",
      medications: "None",
      allergies: "None reported",
      status: CaseStatus.Completed,
      submittedAt: new Date("2026-03-10T00:00:00Z"),
      caseManagerUserId: liWeiCaseManager.id,
      treatmentPlan: "10-day TCM Recovery & Wellness Program — acupuncture, herbal medicine, and dietary therapy.",
      costEstimateMinUsd: 1800,
      costEstimateMaxUsd: 3200,
      statusHistory: {
        create: [
          { status: CaseStatus.Submitted, createdAt: new Date("2026-03-10T00:00:00Z"), changedByUserId: michael.id },
          { status: CaseStatus.Completed, note: "Program completed", createdAt: new Date("2026-04-01T00:00:00Z"), changedByUserId: liWeiCaseManager.id },
        ],
      },
      invoices: { create: [{ description: "TCM Recovery & Wellness Program — full payment", amountUsd: 2600, status: InvoiceStatus.Paid, createdAt: new Date("2026-03-15T00:00:00Z") }] },
    },
  });
  await prisma.review.create({
    data: {
      applicationId: michaelTcm.id,
      patientId: michael.patientProfile.id,
      hospitalId: guangzhouFirst.id,
      rating: 5,
      text: "The wellness program after my procedure genuinely accelerated my recovery. Dr. Liu took real time to explain the TCM approach.",
      status: ReviewStatus.Approved,
      moderatedByUserId: admin.id,
      moderatedAt: new Date("2026-04-10T00:00:00Z"),
    },
  });
  console.log("Seeded Farrukh, Grace, and Michael cases with reviews.");

  // --- Commission rates & platform settings -------------------------------
  await prisma.commissionRate.createMany({
    data: [
      { partnerType: PartnerType.Hospital, hospitalId: beijingUnited.id, rate: 0.12 },
      { partnerType: PartnerType.Hospital, hospitalId: shanghaiEast.id, rate: 0.12 },
      { partnerType: PartnerType.Hospital, hospitalId: guangzhouFirst.id, rate: 0.1 },
      { partnerType: PartnerType.Hotel, hotelId: riversideSuites.id, rate: 0.15 },
    ],
  });

  await prisma.platformSetting.createMany({
    data: [
      { key: "platform_name", value: "Asia Health Link & Travel" },
      { key: "support_email", value: "support@asiahealthlink.com" },
      { key: "default_deposit_rate", value: 0.2 },
    ],
  });

  // --- CMS articles --------------------------------------------------------
  await prisma.article.createMany({
    data: [
      {
        slug: "what-to-pack-medical-trip-china",
        title: "What to Pack for Your Medical Trip to China",
        excerpt: "A practical checklist for international patients — from documents to comfort items for your recovery stay.",
        category: "Travel Prep",
        authorUserId: admin.id,
        status: ArticleStatus.Published,
        publishedAt: new Date("2026-05-02T00:00:00Z"),
        body: "Traveling for medical treatment is different from an ordinary trip — you're packing for a procedure and a recovery, not a vacation. Start with documents: passport, visa, invitation letter, and copies of your medical records in both digital and printed form.\n\nComfort matters more than you'd expect. Loose, easy-to-remove clothing, your own pillow if you have a favorite, and any home comforts (tea, a familiar snack) can make the recovery days in an unfamiliar hospital feel less foreign.\n\nFinally, keep a small folder — physical or digital — with your case reference number, your case manager's contact details, and your hospital's address in Chinese characters, so any taxi driver can get you there without confusion.",
      },
      {
        slug: "understanding-medical-visa-china",
        title: "Understanding the Medical Visa Process for China",
        excerpt: "What an invitation letter actually does, how long approval typically takes, and how to avoid common delays.",
        category: "Visa & Documentation",
        authorUserId: admin.id,
        status: ArticleStatus.Published,
        publishedAt: new Date("2026-04-18T00:00:00Z"),
        body: "An invitation letter from your treating hospital is the single most important document in your visa application. It confirms that a licensed institution has accepted your case and states the purpose and expected duration of your visit.\n\nOnce your treatment plan is confirmed and your deposit is paid, your case manager prepares this letter within a few business days. From there, submission to your nearest consulate typically takes one to three weeks, though this varies by country.\n\nThe most common cause of delay isn't the hospital paperwork — it's incomplete supporting documents on the applicant's side. Make sure your passport has at least six months of validity remaining and that all forms are signed exactly as they appear on your passport.",
      },
      {
        slug: "why-patients-choose-china-cardiology",
        title: "Why More International Patients Are Choosing China for Cardiology Care",
        excerpt: "Advanced interventional techniques, shorter wait times, and significant cost savings versus Western alternatives.",
        category: "Treatment Insights",
        authorUserId: admin.id,
        status: ArticleStatus.Published,
        publishedAt: new Date("2026-03-27T00:00:00Z"),
        body: "China's top cardiology centers now perform some of the highest procedure volumes in the world, giving surgeons a level of hands-on experience that's hard to match elsewhere — and for patients, that experience translates into outcomes.\n\nCost is a real factor too: a coronary intervention that might run well into six figures in some Western healthcare systems is typically a fraction of that in China's leading international hospitals, without a compromise on accreditation or equipment.\n\nCombined with shorter scheduling wait times and a coordinated travel experience, it's easy to see why cardiology has become one of the fastest-growing specialties for international patients booking through the platform.",
      },
    ],
  });
  console.log("Seeded commission rates, platform settings, and 3 published articles.");

  console.log(
    `\nDemo accounts (all share ${process.env.SEED_DEMO_PASSWORD ? "the password from SEED_DEMO_PASSWORD" : "password: Passw0rd!23"}):`,
  );
  console.log("  admin           sarah.chen@asiahealthlink.com");
  console.log("  hospital_staff  jing.zhao@buf-hospital.cn (Beijing United Family Hospital)");
  console.log("  case_manager    li.wei@asiahealthlink.com");
  console.log("  driver          zhang.wei@drivers.cmt.com");
  console.log("  interpreter     sun.li@interpreters.cmt.com");
  console.log("  hotel_partner   bookings@riverside-suites.cn (Beijing Riverside Suites)");
  console.log("  patient         amara.nwosu@example.com (3 cases, incl. dependent Chidi Nwosu)");
  console.log("  patient         farrukh.tashkentov@example.com (1 case)");
  console.log("  patient         grace.otieno@example.com (2 cases)");
  console.log("  patient         michael.asante@example.com (2 cases)");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
