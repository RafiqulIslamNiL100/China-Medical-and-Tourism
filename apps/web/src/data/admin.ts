export const currentAdmin = {
  name: "Sarah Chen",
  title: "Platform Administrator",
};

export const platformKpis = {
  bookingsThisMonth: 47,
  revenueThisMonthUsd: 612000,
  activeCases: 89,
  slaComplianceRate: 0.91,
};

export const conversionFunnel = [
  { stage: "Inquiries", count: 210 },
  { stage: "Applications", count: 142 },
  { stage: "Accepted", count: 98 },
  { stage: "Paid", count: 81 },
  { stage: "Completed", count: 54 },
];

export const hospitalLeaderboard = [
  { name: "Beijing United Family Hospital", bookings: 21, revenueUsd: 268000, rating: 4.8 },
  { name: "Shanghai East Hospital", bookings: 16, revenueUsd: 198000, rating: 4.7 },
  { name: "Guangzhou First People's Hospital", bookings: 10, revenueUsd: 146000, rating: 4.6 },
];

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: "patient" | "hospital_staff" | "case_manager" | "driver" | "interpreter" | "hotel_partner" | "admin";
  status: "Active" | "Deactivated";
  lastLogin: string;
};

export const platformUsers: PlatformUser[] = [
  { id: "u-1", name: "Amara Nwosu", email: "amara.nwosu@example.com", role: "patient", status: "Active", lastLogin: "2026-07-11" },
  { id: "u-2", name: "Jing Zhao", email: "jing.zhao@buf-hospital.cn", role: "hospital_staff", status: "Active", lastLogin: "2026-07-12" },
  { id: "u-3", name: "Li Wei", email: "li.wei@cmt-platform.com", role: "case_manager", status: "Active", lastLogin: "2026-07-12" },
  { id: "u-4", name: "Zhang Wei", email: "zhang.wei@drivers.cmt.com", role: "driver", status: "Active", lastLogin: "2026-07-10" },
  { id: "u-5", name: "Sun Li", email: "sun.li@interpreters.cmt.com", role: "interpreter", status: "Active", lastLogin: "2026-07-09" },
  { id: "u-6", name: "Riverside Suites Mgmt", email: "bookings@riverside-suites.cn", role: "hotel_partner", status: "Active", lastLogin: "2026-07-08" },
  { id: "u-7", name: "Former Coordinator", email: "ex-staff@buf-hospital.cn", role: "hospital_staff", status: "Deactivated", lastLogin: "2026-04-02" },
];

export type ModerationItem = {
  id: string;
  hospitalName: string;
  changeSummary: string;
  submittedDate: string;
};

export const hospitalModerationQueue: ModerationItem[] = [
  {
    id: "mod-1",
    hospitalName: "Shanghai East Hospital",
    changeSummary: "Added a new doctor profile: Dr. Zhou Yan (Reproductive Endocrinology)",
    submittedDate: "2026-07-09",
  },
  {
    id: "mod-2",
    hospitalName: "Guangzhou First People's Hospital",
    changeSummary: "Updated treatment package pricing for TCM Recovery & Wellness Program",
    submittedDate: "2026-07-07",
  },
];

export type PendingReview = {
  id: string;
  patientName: string;
  hospitalName: string;
  rating: number;
  text: string;
  submittedDate: string;
};

export const pendingReviews: PendingReview[] = [
  {
    id: "rev-1",
    patientName: "David M.",
    hospitalName: "Beijing United Family Hospital",
    rating: 5,
    text: "Exceptional care from the whole team. My case manager was reachable at every step, even outside normal hours.",
    submittedDate: "2026-07-08",
  },
  {
    id: "rev-2",
    patientName: "Priya S.",
    hospitalName: "Shanghai East Hospital",
    rating: 2,
    text: "Surgery went fine but the hotel booked for me was much further from the hospital than advertised.",
    submittedDate: "2026-07-06",
  },
];

export type CommissionRate = {
  partnerName: string;
  partnerType: "Hospital" | "Hotel" | "Transport";
  rate: number;
};

export const commissionRates: CommissionRate[] = [
  { partnerName: "Beijing United Family Hospital", partnerType: "Hospital", rate: 0.12 },
  { partnerName: "Shanghai East Hospital", partnerType: "Hospital", rate: 0.1 },
  { partnerName: "Guangzhou First People's Hospital", partnerType: "Hospital", rate: 0.1 },
  { partnerName: "Beijing Riverside Suites", partnerType: "Hotel", rate: 0.15 },
];

export type Transaction = {
  id: string;
  date: string;
  patientName: string;
  description: string;
  amountUsd: number;
  status: "Paid" | "Refunded" | "Pending";
};

export const transactions: Transaction[] = [
  { id: "tx-1", date: "2026-06-25", patientName: "Amara Nwosu", description: "Booking deposit — CMT-2026-1042", amountUsd: 3000, status: "Paid" },
  { id: "tx-2", date: "2026-01-15", patientName: "Amara Nwosu", description: "Executive Health Screening — full payment", amountUsd: 1850, status: "Paid" },
  { id: "tx-3", date: "2026-05-30", patientName: "Priya S.", description: "Refund — hotel discrepancy goodwill credit", amountUsd: 200, status: "Refunded" },
];

export type CmsArticle = {
  id: string;
  title: string;
  status: "Published" | "Draft";
  author: string;
  updatedDate: string;
};

export const cmsArticles: CmsArticle[] = [
  { id: "cms-1", title: "What to Pack for Your Medical Trip to China", status: "Published", author: "CMT Case Management Team", updatedDate: "2026-05-02" },
  { id: "cms-2", title: "Understanding the Medical Visa Process for China", status: "Published", author: "CMT Case Management Team", updatedDate: "2026-04-18" },
  { id: "cms-3", title: "Why More International Patients Are Choosing China for Cardiology Care", status: "Published", author: "CMT Editorial", updatedDate: "2026-03-27" },
  { id: "cms-4", title: "A Guide to Recovery Nutrition After Surgery", status: "Draft", author: "CMT Editorial", updatedDate: "2026-07-10" },
];

export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export const auditLog: AuditLogEntry[] = [
  { id: "log-1", actor: "Li Wei", action: "Document accessed", target: "Passport photo page — CMT-2026-1042", timestamp: "2026-07-12T09:14:00Z" },
  { id: "log-2", actor: "Sarah Chen", action: "Role changed", target: "u-7 → Deactivated", timestamp: "2026-07-11T16:02:00Z" },
  { id: "log-3", actor: "Jing Zhao", action: "Listing change submitted", target: "Shanghai East Hospital — doctor profile", timestamp: "2026-07-09T11:47:00Z" },
  { id: "log-4", actor: "Sarah Chen", action: "Commission rate updated", target: "Beijing Riverside Suites → 15%", timestamp: "2026-07-05T14:30:00Z" },
  { id: "log-5", actor: "System", action: "Refund processed", target: "$200 — Priya S.", timestamp: "2026-05-30T10:05:00Z" },
];
