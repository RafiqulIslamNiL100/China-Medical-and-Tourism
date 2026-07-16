export type CaseStatus =
  | "Submitted"
  | "Under Review"
  | "Info Requested"
  | "Accepted"
  | "Declined"
  | "Completed";

export type CaseDocument = {
  id: string;
  name: string;
  category: "Medical Records" | "Identity Documents" | "Visa Documents";
  status: "Not Uploaded" | "Uploaded" | "Verified" | "Rejected";
  note?: string;
};

export type CaseMessage = {
  id: string;
  sender: string;
  role: "Patient" | "Case Manager" | "Hospital";
  body: string;
  timestamp: string;
};

export type ItineraryEvent = {
  id: string;
  type: "Hospital Visit" | "Hotel" | "Transfer";
  title: string;
  date: string;
  detail: string;
};

export type Invoice = {
  id: string;
  description: string;
  amountUsd: number;
  status: "Paid" | "Due" | "Refunded";
  date: string;
};

export type TimelineEntry = {
  label: string;
  date: string;
  pending?: boolean;
};

export type PatientCase = {
  id: string;
  refNumber: string;
  hospitalName: string;
  hospitalSlug: string;
  doctorName: string;
  specialty: string;
  status: CaseStatus;
  submittedDate: string;
  caseManager: { name: string; title: string } | null;
  treatmentPlan: string | null;
  costEstimateUsd: [number, number] | null;
  nextStep: string;
  timeline: TimelineEntry[];
  documents: CaseDocument[];
  messages: CaseMessage[];
  itinerary: ItineraryEvent[];
  invoices: Invoice[];
};

export const currentPatient = {
  name: "Amara Nwosu",
  email: "amara.nwosu@example.com",
  phone: "+234 803 555 0142",
  country: "Nigeria",
};

export const dependents = [
  {
    id: "dep-1",
    name: "Chidi Nwosu",
    relationship: "Father",
    dob: "1958-03-11",
    linkedCases: 1,
  },
];

export const patientCases: PatientCase[] = [
  {
    id: "case-1042",
    refNumber: "AHLT-2026-1042",
    hospitalName: "Beijing United Family Hospital",
    hospitalSlug: "beijing-united-family-hospital",
    doctorName: "Dr. Li Wei",
    specialty: "Cardiology",
    status: "Accepted",
    submittedDate: "2026-06-18",
    caseManager: { name: "Li Wei", title: "Senior Case Manager" },
    treatmentPlan:
      "Coronary angioplasty with a 3-night private recovery stay, followed by a 30-day remote follow-up plan.",
    costEstimateUsd: [12000, 18000],
    nextStep: "Upload your passport to continue visa preparation",
    timeline: [
      { label: "Application submitted", date: "2026-06-18" },
      { label: "Case manager assigned — Li Wei", date: "2026-06-19" },
      { label: "Treatment plan received", date: "2026-06-22" },
      { label: "Deposit paid — booking confirmed", date: "2026-06-25" },
      { label: "Awaiting passport upload", date: "Expected by 2026-07-15", pending: true },
    ],
    documents: [
      { id: "doc-1", name: "Recent ECG report", category: "Medical Records", status: "Verified" },
      { id: "doc-2", name: "Passport photo page", category: "Identity Documents", status: "Not Uploaded" },
      { id: "doc-3", name: "Proof of funds", category: "Visa Documents", status: "Not Uploaded" },
      { id: "doc-4", name: "Invitation letter", category: "Visa Documents", status: "Not Uploaded", note: "Issued after passport is verified" },
    ],
    messages: [
      {
        id: "msg-1",
        sender: "Li Wei",
        role: "Case Manager",
        body: "Welcome, Amara! I'll be coordinating your treatment from here. Your treatment plan is attached above — let me know if you have any questions.",
        timestamp: "2026-06-19T09:12:00Z",
      },
      {
        id: "msg-2",
        sender: "Amara Nwosu",
        role: "Patient",
        body: "Thank you! The plan looks good. When should I plan to arrive in Beijing?",
        timestamp: "2026-06-20T14:03:00Z",
      },
      {
        id: "msg-3",
        sender: "Li Wei",
        role: "Case Manager",
        body: "Once your visa is approved we'll confirm exact dates, but plan to arrive 2 days before your procedure date for pre-op diagnostics.",
        timestamp: "2026-06-20T15:47:00Z",
      },
    ],
    itinerary: [
      {
        id: "it-1",
        type: "Hospital Visit",
        title: "Pre-op diagnostics — Beijing United Family Hospital",
        date: "2026-07-28",
        detail: "Arrive 30 minutes early, bring original passport.",
      },
      {
        id: "it-2",
        type: "Hotel",
        title: "Recovery stay — not yet booked",
        date: "TBC",
        detail: "Book a hotel near your hospital once your dates are confirmed.",
      },
    ],
    invoices: [
      { id: "inv-1", description: "Booking deposit", amountUsd: 3000, status: "Paid", date: "2026-06-25" },
      { id: "inv-2", description: "Treatment balance", amountUsd: 12000, status: "Due", date: "2026-07-20" },
    ],
  },
  {
    id: "case-0981",
    refNumber: "AHLT-2026-0981",
    hospitalName: "Shanghai East Hospital",
    hospitalSlug: "shanghai-east-hospital",
    doctorName: "Dr. Wang Fang",
    specialty: "Orthopedics",
    status: "Under Review",
    submittedDate: "2026-07-05",
    caseManager: null,
    treatmentPlan: null,
    costEstimateUsd: null,
    nextStep: "Hospital is reviewing your case — expect a response by 2026-07-10",
    timeline: [
      { label: "Application submitted", date: "2026-07-05" },
      { label: "Hospital reviewing your case", date: "Expected by 2026-07-10", pending: true },
    ],
    documents: [
      { id: "doc-5", name: "Knee MRI report", category: "Medical Records", status: "Uploaded" },
      { id: "doc-6", name: "Referral letter", category: "Medical Records", status: "Not Uploaded" },
    ],
    messages: [],
    itinerary: [],
    invoices: [],
  },
  {
    id: "case-0754",
    refNumber: "AHLT-2026-0754",
    hospitalName: "Beijing United Family Hospital",
    hospitalSlug: "beijing-united-family-hospital",
    doctorName: "Dr. Chen Min",
    specialty: "Health Screening",
    status: "Completed",
    submittedDate: "2026-01-10",
    caseManager: { name: "Li Wei", title: "Senior Case Manager" },
    treatmentPlan: "Executive Health Screening — full-body imaging, bloodwork, and specialist consult.",
    costEstimateUsd: [1200, 2500],
    nextStep: "Treatment complete — share your experience",
    timeline: [
      { label: "Application submitted", date: "2026-01-10" },
      { label: "Treatment completed", date: "2026-02-02" },
      { label: "Case closed", date: "2026-02-16" },
    ],
    documents: [
      { id: "doc-7", name: "Screening results summary", category: "Medical Records", status: "Verified" },
    ],
    messages: [],
    itinerary: [
      {
        id: "it-3",
        type: "Hospital Visit",
        title: "Executive Health Screening",
        date: "2026-02-02",
        detail: "Completed.",
      },
    ],
    invoices: [
      { id: "inv-3", description: "Executive Health Screening — full payment", amountUsd: 1850, status: "Paid", date: "2026-01-15" },
    ],
  },
];

export const patientNotifications = [
  {
    id: "n-1",
    title: "Document requested",
    body: "Please upload your passport photo page for case AHLT-2026-1042.",
    date: "2026-07-08",
    read: false,
    href: "/app/cases/case-1042",
  },
  {
    id: "n-2",
    title: "New message from Li Wei",
    body: "Once your visa is approved we'll confirm exact dates...",
    date: "2026-06-20",
    read: true,
    href: "/app/cases/case-1042",
  },
  {
    id: "n-3",
    title: "Payment due soon",
    body: "Treatment balance of $12,000 is due by 2026-07-20 for case AHLT-2026-1042.",
    date: "2026-07-06",
    read: false,
    href: "/app/cases/case-1042",
  },
  {
    id: "n-4",
    title: "Application under review",
    body: "Shanghai East Hospital is reviewing your orthopedics application.",
    date: "2026-07-05",
    read: true,
    href: "/app/cases/case-0981",
  },
];
