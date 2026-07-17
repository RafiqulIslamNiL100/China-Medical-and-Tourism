export type Doctor = {
  slug: string;
  name: string;
  specialty: string;
  credentials: string;
  yearsExperience: number;
  languages: string[];
  bio: string;
};

export type TreatmentPackage = {
  name: string;
  specialty: string;
  priceRangeUsd: [number, number];
  description: string;
  includes: string[];
};

export type Review = {
  patientName: string;
  country: string;
  rating: number;
  text: string;
  treatment: string;
  date: string;
};

export type Hospital = {
  slug: string;
  name: string;
  city: "beijing" | "shanghai" | "guangzhou";
  cityLabel: string;
  specialties: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  priceTier: "$$" | "$$$" | "$$$$";
  accreditations: string[];
  description: string;
  facilities: string[];
  doctors: Doctor[];
  packages: TreatmentPackage[];
  reviews: Review[];
};

export const specialties = [
  {
    slug: "oncology",
    name: "Oncology",
    blurb: "Advanced cancer diagnostics, surgical oncology, radiotherapy, and immunotherapy.",
  },
  {
    slug: "cardiology",
    name: "Cardiology",
    blurb: "Interventional cardiology, bypass surgery, and structural heart repair.",
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    blurb: "Joint replacement, sports medicine, and complex spine surgery.",
  },
  {
    slug: "fertility",
    name: "Fertility & IVF",
    blurb: "IVF, fertility preservation, and reproductive endocrinology.",
  },
  {
    slug: "health-screening",
    name: "Health Screening",
    blurb: "Comprehensive executive health checkups and early-detection panels.",
  },
  {
    slug: "tcm-wellness",
    name: "TCM Wellness",
    blurb: "Traditional Chinese Medicine programs for recovery and preventive health.",
  },
] as const;

export const cities = [
  {
    slug: "beijing",
    name: "Beijing",
    tagline: "China's medical capital — top-tier academic hospitals and specialist centers.",
    climate: "Continental — hot summers, cold winters. Best visited spring or autumn.",
  },
  {
    slug: "shanghai",
    name: "Shanghai",
    tagline: "International hospitals with strong English-speaking staff and modern facilities.",
    climate: "Humid subtropical — mild winters, hot humid summers.",
  },
  {
    slug: "guangzhou",
    name: "Guangzhou",
    tagline: "A gateway city with excellent TCM integration and growing specialist capacity.",
    climate: "Humid subtropical — warm year-round, wettest in summer.",
  },
  {
    slug: "xi-an",
    name: "Xi'an",
    tagline: "A major regional medical center in Northwest China, home to leading transplant and oncology programs.",
    climate: "Semi-arid continental — hot summers, cold dry winters. Best visited spring or autumn.",
  },
] as const;

export const hospitals: Hospital[] = [
  {
    slug: "beijing-united-family-hospital",
    name: "Beijing United Family Hospital",
    city: "beijing",
    cityLabel: "Beijing",
    specialties: ["Cardiology", "Oncology", "Health Screening"],
    languages: ["English", "Mandarin", "Arabic"],
    rating: 4.8,
    reviewCount: 212,
    priceTier: "$$$",
    accreditations: ["JCI Accredited", "ISO 9001"],
    description:
      "A JCI-accredited international hospital in Beijing combining Western clinical standards with access to leading Chinese specialists. Beijing United serves international patients with a dedicated case-coordination team and on-site interpretation in six languages.",
    facilities: [
      "24/7 international emergency department",
      "Dedicated international patient lounge",
      "On-site pharmacy stocking imported medication",
      "Private recovery suites",
    ],
    doctors: [
      {
        slug: "li-wei",
        name: "Dr. Li Wei",
        specialty: "Interventional Cardiology",
        credentials: "MD, PhD — Peking Union Medical College",
        yearsExperience: 22,
        languages: ["English", "Mandarin"],
        bio: "Dr. Li specializes in complex coronary interventions and structural heart repair, with over 3,000 procedures performed and training at Cleveland Clinic.",
      },
      {
        slug: "chen-min",
        name: "Dr. Chen Min",
        specialty: "Surgical Oncology",
        credentials: "MD — Peking University Health Science Center",
        yearsExperience: 18,
        languages: ["English", "Mandarin"],
        bio: "Dr. Chen leads the hospital's tumor board and specializes in minimally invasive oncologic surgery for gastrointestinal cancers.",
      },
    ],
    packages: [
      {
        name: "Coronary Angioplasty Package",
        specialty: "Cardiology",
        priceRangeUsd: [12000, 18000],
        description:
          "Full diagnostic workup, angioplasty procedure, 3-night private recovery stay, and a 30-day follow-up plan.",
        includes: ["Pre-op diagnostics", "Procedure & anesthesia", "3-night private room", "Follow-up consultation"],
      },
      {
        name: "Executive Health Screening",
        specialty: "Health Screening",
        priceRangeUsd: [1200, 2500],
        description:
          "A comprehensive one-day screening panel including imaging, bloodwork, and a same-day specialist consultation.",
        includes: ["Full-body imaging", "Comprehensive bloodwork", "Cardiology consult", "Same-day results review"],
      },
    ],
    reviews: [
      {
        patientName: "Kamrul H.",
        country: "Bangladesh",
        rating: 5,
        text: "Asia Health Link handled everything — hospital booking, visa letter, hotel, even airport pickup — so all I had to focus on was my treatment. The facility itself was spotless and the recovery suite felt more like a hotel than a hospital.",
        treatment: "Coronary Angioplasty",
        date: "2026-03-14",
      },
      {
        patientName: "Shirin A.",
        country: "Bangladesh",
        rating: 5,
        text: "My case manager checked in with me every single day, in Bangla when I needed it. Coming from Dhaka, I was nervous about a hospital system I didn't understand, but Asia Health Link made the whole process feel simple.",
        treatment: "Executive Health Screening",
        date: "2026-01-22",
      },
    ],
  },
  {
    slug: "shanghai-east-hospital",
    name: "Shanghai East Hospital",
    city: "shanghai",
    cityLabel: "Shanghai",
    specialties: ["Orthopedics", "Fertility & IVF", "Oncology"],
    languages: ["English", "Mandarin", "Russian"],
    rating: 4.7,
    reviewCount: 168,
    priceTier: "$$",
    accreditations: ["JCI Accredited"],
    description:
      "Shanghai East Hospital's International Medical Center pairs a high-volume orthopedic surgery program with one of the region's leading reproductive medicine departments, serving patients from over 40 countries annually.",
    facilities: [
      "Robotic-assisted joint replacement suite",
      "IVF laboratory with cryopreservation",
      "International patient concierge desk",
      "On-site physiotherapy gym",
    ],
    doctors: [
      {
        slug: "wang-fang",
        name: "Dr. Wang Fang",
        specialty: "Orthopedic Surgery",
        credentials: "MD — Shanghai Jiao Tong University",
        yearsExperience: 16,
        languages: ["English", "Mandarin"],
        bio: "Dr. Wang performs over 200 robotic-assisted knee and hip replacements annually and trains internationally on minimally invasive technique.",
      },
      {
        slug: "zhou-yan",
        name: "Dr. Zhou Yan",
        specialty: "Reproductive Endocrinology",
        credentials: "MD, PhD — Fudan University",
        yearsExperience: 14,
        languages: ["English", "Mandarin", "Russian"],
        bio: "Dr. Zhou has guided over 1,500 IVF cycles and specializes in fertility preservation for patients with complex medical histories.",
      },
    ],
    packages: [
      {
        name: "Total Knee Replacement",
        specialty: "Orthopedics",
        priceRangeUsd: [15000, 22000],
        description:
          "Robotic-assisted single knee replacement with a 5-night stay and a structured 6-week physiotherapy plan.",
        includes: ["Pre-op imaging", "Robotic-assisted surgery", "5-night stay", "6-week physiotherapy plan"],
      },
      {
        name: "IVF Cycle Package",
        specialty: "Fertility & IVF",
        priceRangeUsd: [6000, 9500],
        description:
          "A single IVF cycle including stimulation monitoring, retrieval, and transfer, with optional cryopreservation.",
        includes: ["Ovarian stimulation monitoring", "Egg retrieval", "Embryo transfer", "Cryopreservation (optional)"],
      },
    ],
    reviews: [
      {
        patientName: "Nusrat J.",
        country: "Bangladesh",
        rating: 5,
        text: "We researched hospitals for months back home before finding Asia Health Link. The treatment facility exceeded what we expected, and having a dedicated coordinator meant we never had to navigate anything alone.",
        treatment: "IVF Cycle",
        date: "2026-02-08",
      },
      {
        patientName: "Tanvir R.",
        country: "Bangladesh",
        rating: 5,
        text: "The surgical outcome was excellent and the hospital itself was world-class. Asia Health Link's case manager sorted out every small hiccup — hotel timing, transport — before I even had to ask.",
        treatment: "Total Knee Replacement",
        date: "2025-12-02",
      },
    ],
  },
  {
    slug: "guangzhou-first-peoples-hospital",
    name: "Guangzhou First People's Hospital — International Center",
    city: "guangzhou",
    cityLabel: "Guangzhou",
    specialties: ["TCM Wellness", "Cardiology", "Health Screening"],
    languages: ["English", "Mandarin", "Cantonese"],
    rating: 4.6,
    reviewCount: 94,
    priceTier: "$$",
    accreditations: ["ISO 9001", "National Tertiary Hospital (Grade A)"],
    description:
      "Guangzhou First People's Hospital blends a strong Traditional Chinese Medicine department with modern cardiology and diagnostic capability, popular with patients seeking integrated recovery and wellness programs alongside conventional treatment.",
    facilities: [
      "Dedicated TCM treatment wing",
      "Cardiac catheterization lab",
      "International patient guesthouse partnership",
      "Herbal pharmacy on-site",
    ],
    doctors: [
      {
        slug: "liu-jing",
        name: "Dr. Liu Jing",
        specialty: "Traditional Chinese Medicine",
        credentials: "MD (TCM) — Guangzhou University of Chinese Medicine",
        yearsExperience: 25,
        languages: ["English", "Mandarin", "Cantonese"],
        bio: "Dr. Liu integrates TCM protocols with post-surgical recovery plans and has published widely on integrative cardiac rehabilitation.",
      },
    ],
    packages: [
      {
        name: "TCM Recovery & Wellness Program",
        specialty: "TCM Wellness",
        priceRangeUsd: [1800, 3200],
        description:
          "A 10-day integrative program combining acupuncture, herbal medicine, and dietary therapy for post-treatment recovery.",
        includes: ["Initial TCM diagnosis", "10 days of treatment sessions", "Personalized herbal regimen", "Dietary therapy plan"],
      },
    ],
    reviews: [
      {
        patientName: "Mahmudul I.",
        country: "Bangladesh",
        rating: 5,
        text: "The wellness program after my procedure genuinely accelerated my recovery, and the facility was immaculate. Asia Health Link made a treatment journey abroad feel completely manageable from Bangladesh.",
        treatment: "TCM Recovery Program",
        date: "2026-04-01",
      },
    ],
  },
];

export const testimonials: Review[] = hospitals.flatMap((h) => h.reviews);

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-to-pack-medical-trip-china",
    title: "What to Pack for Your Medical Trip to China",
    excerpt:
      "A practical checklist for international patients — from documents to comfort items for your recovery stay.",
    category: "Travel Prep",
    author: "Asia Health Link Case Management Team",
    date: "2026-05-02",
    readTime: "6 min read",
    body: [
      "Traveling for medical treatment is different from an ordinary trip — you're packing for a procedure and a recovery, not a vacation. Start with documents: passport, visa, invitation letter, and copies of your medical records in both digital and printed form.",
      "Comfort matters more than you'd expect. Loose, easy-to-remove clothing, your own pillow if you have a favorite, and any home comforts (tea, a familiar snack) can make the recovery days in an unfamiliar hospital feel less foreign.",
      "Finally, keep a small folder — physical or digital — with your case reference number, your case manager's contact details, and your hospital's address in Chinese characters, so any taxi driver can get you there without confusion.",
    ],
  },
  {
    slug: "understanding-medical-visa-china",
    title: "Understanding the Medical Visa Process for China",
    excerpt:
      "What an invitation letter actually does, how long approval typically takes, and how to avoid common delays.",
    category: "Visa & Documentation",
    author: "Asia Health Link Case Management Team",
    date: "2026-04-18",
    readTime: "8 min read",
    body: [
      "An invitation letter from your treating hospital is the single most important document in your visa application. It confirms that a licensed institution has accepted your case and states the purpose and expected duration of your visit.",
      "Once your treatment plan is confirmed and your deposit is paid, your case manager prepares this letter within a few business days. From there, submission to your nearest consulate typically takes one to three weeks, though this varies by country.",
      "The most common cause of delay isn't the hospital paperwork — it's incomplete supporting documents on the applicant's side. Make sure your passport has at least six months of validity remaining and that all forms are signed exactly as they appear on your passport.",
    ],
  },
  {
    slug: "why-patients-choose-china-cardiology",
    title: "Why More International Patients Are Choosing China for Cardiology Care",
    excerpt:
      "Advanced interventional techniques, shorter wait times, and significant cost savings versus Western alternatives.",
    category: "Treatment Insights",
    author: "Asia Health Link Editorial",
    date: "2026-03-27",
    readTime: "5 min read",
    body: [
      "China's top cardiology centers now perform some of the highest procedure volumes in the world, giving surgeons a level of hands-on experience that's hard to match elsewhere — and for patients, that experience translates into outcomes.",
      "Cost is a real factor too: a coronary intervention that might run well into six figures in some Western healthcare systems is typically a fraction of that in China's leading international hospitals, without a compromise on accreditation or equipment.",
      "Combined with shorter scheduling wait times and a coordinated travel experience, it's easy to see why cardiology has become one of the fastest-growing specialties for international patients booking through the platform.",
    ],
  },
];
