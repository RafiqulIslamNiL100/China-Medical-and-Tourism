export const currentHospitalStaff = {
  name: "Jing Zhao",
  title: "International Patient Coordinator",
  hospitalName: "Beijing United Family Hospital",
  hospitalSlug: "beijing-united-family-hospital",
};

export type IncomingApplication = {
  id: string;
  refNumber: string;
  patientName: string;
  patientCountry: string;
  specialty: string;
  submittedDate: string;
  slaDeadline: string;
  slaRisk: "on-track" | "at-risk" | "breached";
  status: "Submitted" | "Under Review" | "Info Requested" | "Accepted" | "Declined";
  conditionSummary: string;
  medications: string;
  allergies: string;
  documents: { name: string; uploaded: boolean }[];
};

export const incomingApplications: IncomingApplication[] = [
  {
    id: "app-2201",
    refNumber: "CMT-2026-2201",
    patientName: "Farrukh Tashkentov",
    patientCountry: "Uzbekistan",
    specialty: "Cardiology",
    submittedDate: "2026-07-10",
    slaDeadline: "2026-07-13",
    slaRisk: "at-risk",
    status: "Submitted",
    conditionSummary:
      "Recurring chest pain, diagnosed with coronary artery narrowing via CT angiogram in home country. Seeking evaluation for angioplasty.",
    medications: "Atorvastatin 20mg daily, Aspirin 75mg daily",
    allergies: "None reported",
    documents: [
      { name: "CT angiogram report", uploaded: true },
      { name: "Recent bloodwork", uploaded: true },
      { name: "Referral letter", uploaded: false },
    ],
  },
  {
    id: "app-2198",
    refNumber: "CMT-2026-2198",
    patientName: "Grace Otieno",
    patientCountry: "Kenya",
    specialty: "Health Screening",
    submittedDate: "2026-07-09",
    slaDeadline: "2026-07-12",
    slaRisk: "on-track",
    status: "Under Review",
    conditionSummary:
      "Requesting comprehensive executive health screening ahead of a planned relocation — no acute symptoms.",
    medications: "None",
    allergies: "Penicillin",
    documents: [{ name: "Prior screening summary (2024)", uploaded: true }],
  },
  {
    id: "app-2185",
    refNumber: "CMT-2026-2185",
    patientName: "Michael Asante",
    patientCountry: "Ghana",
    specialty: "Cardiology",
    submittedDate: "2026-07-01",
    slaDeadline: "2026-07-04",
    slaRisk: "breached",
    status: "Info Requested",
    conditionSummary:
      "Reports shortness of breath on exertion. No prior cardiac workup available yet.",
    medications: "Lisinopril 10mg daily",
    allergies: "None reported",
    documents: [{ name: "ECG report", uploaded: false }],
  },
  {
    id: "app-2140",
    refNumber: "CMT-2026-2140",
    patientName: "Amara Nwosu",
    patientCountry: "Nigeria",
    specialty: "Cardiology",
    submittedDate: "2026-06-18",
    slaDeadline: "2026-06-21",
    slaRisk: "on-track",
    status: "Accepted",
    conditionSummary: "Coronary artery disease, candidate for angioplasty.",
    medications: "None",
    allergies: "None reported",
    documents: [
      { name: "Recent ECG report", uploaded: true },
    ],
  },
];

export const hospitalReportSummary = {
  bookingsThisMonth: 14,
  bookingsLastMonth: 9,
  revenueThisMonthUsd: 168000,
  revenueLastMonthUsd: 121000,
  conversionFunnel: [
    { stage: "Applications received", count: 42 },
    { stage: "Accepted", count: 27 },
    { stage: "Deposit paid", count: 21 },
    { stage: "Completed", count: 14 },
  ],
};
