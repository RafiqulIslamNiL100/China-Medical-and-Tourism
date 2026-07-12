export const currentCaseManager = {
  name: "Li Wei",
  title: "Senior Case Manager",
};

export type OpsCaseStatus =
  | "Submitted"
  | "Under Review"
  | "Info Requested"
  | "Accepted"
  | "Declined"
  | "Completed";

export type SlaRisk = "on-track" | "at-risk" | "breached";

export type OpsCase = {
  id: string;
  refNumber: string;
  patientName: string;
  patientCountry: string;
  hospitalName: string;
  specialty: string;
  status: OpsCaseStatus;
  slaRisk: SlaRisk;
  travelDate: string | null;
  assignedCaseManager: string;
  internalNotes: { author: string; note: string; date: string }[];
  assignments: {
    type: "Driver" | "Interpreter";
    name: string | null;
    date: string;
    detail: string;
  }[];
};

export const opsCases: OpsCase[] = [
  {
    id: "case-1042",
    refNumber: "CMT-2026-1042",
    patientName: "Amara Nwosu",
    patientCountry: "Nigeria",
    hospitalName: "Beijing United Family Hospital",
    specialty: "Cardiology",
    status: "Accepted",
    slaRisk: "on-track",
    travelDate: "2026-07-28",
    assignedCaseManager: "Li Wei",
    internalNotes: [
      {
        author: "Li Wei",
        note: "Patient is anxious about the procedure — spent extra time on the phone call reassuring her about recovery timeline.",
        date: "2026-06-20",
      },
    ],
    assignments: [
      { type: "Driver", name: null, date: "2026-07-28", detail: "Airport arrival pickup — unassigned" },
      { type: "Interpreter", name: null, date: "2026-07-28", detail: "Pre-op diagnostics visit — unassigned" },
    ],
  },
  {
    id: "case-0981",
    refNumber: "CMT-2026-0981",
    patientName: "Elena Kovalenko",
    patientCountry: "Kazakhstan",
    hospitalName: "Shanghai East Hospital",
    specialty: "Orthopedics",
    status: "Under Review",
    slaRisk: "at-risk",
    travelDate: null,
    assignedCaseManager: "Li Wei",
    internalNotes: [],
    assignments: [],
  },
  {
    id: "case-2201",
    refNumber: "CMT-2026-2201",
    patientName: "Farrukh Tashkentov",
    patientCountry: "Uzbekistan",
    hospitalName: "Beijing United Family Hospital",
    specialty: "Cardiology",
    status: "Submitted",
    slaRisk: "at-risk",
    travelDate: null,
    assignedCaseManager: "Unassigned",
    internalNotes: [],
    assignments: [],
  },
  {
    id: "case-2185",
    refNumber: "CMT-2026-2185",
    patientName: "Michael Asante",
    patientCountry: "Ghana",
    hospitalName: "Beijing United Family Hospital",
    specialty: "Cardiology",
    status: "Info Requested",
    slaRisk: "breached",
    travelDate: null,
    assignedCaseManager: "Li Wei",
    internalNotes: [
      {
        author: "Li Wei",
        note: "Requested ECG report from patient on 2026-07-01, no response yet. Follow up by phone.",
        date: "2026-07-05",
      },
    ],
    assignments: [],
  },
  {
    id: "case-0754",
    refNumber: "CMT-2026-0754",
    patientName: "Amara Nwosu",
    patientCountry: "Nigeria",
    hospitalName: "Beijing United Family Hospital",
    specialty: "Health Screening",
    status: "Completed",
    slaRisk: "on-track",
    travelDate: "2026-02-02",
    assignedCaseManager: "Li Wei",
    internalNotes: [],
    assignments: [
      { type: "Driver", name: "Zhang Wei", date: "2026-02-02", detail: "Airport arrival pickup — completed" },
    ],
  },
];

export type AssignmentBoardItem = {
  id: string;
  caseId: string;
  caseRef: string;
  patientName: string;
  type: "Driver" | "Interpreter";
  date: string;
  detail: string;
  assignedTo: string | null;
};

export const assignmentBoard: AssignmentBoardItem[] = [
  {
    id: "asg-1",
    caseId: "case-1042",
    caseRef: "CMT-2026-1042",
    patientName: "Amara Nwosu",
    type: "Driver",
    date: "2026-07-28",
    detail: "Airport arrival pickup — Beijing Capital Intl (PEK)",
    assignedTo: null,
  },
  {
    id: "asg-2",
    caseId: "case-1042",
    caseRef: "CMT-2026-1042",
    patientName: "Amara Nwosu",
    type: "Interpreter",
    date: "2026-07-28",
    detail: "Pre-op diagnostics — Beijing United Family Hospital",
    assignedTo: null,
  },
  {
    id: "asg-3",
    caseId: "case-0754",
    caseRef: "CMT-2026-0754",
    patientName: "Amara Nwosu",
    type: "Driver",
    date: "2026-02-02",
    detail: "Airport arrival pickup — completed",
    assignedTo: "Zhang Wei",
  },
];

export const availableDrivers = ["Zhang Wei", "Liu Yang", "Wang Qiang"];
export const availableInterpreters = ["Sun Li (EN/CN)", "Ahmed Hassan (AR/CN)", "Olga Petrova (RU/CN)"];
