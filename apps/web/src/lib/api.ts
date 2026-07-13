const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  accessToken?: string;
  query?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.accessToken) headers["Authorization"] = `Bearer ${options.accessToken}`;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    const error = data?.error ?? { code: "UNKNOWN_ERROR", message: "Something went wrong." };
    throw new ApiError(res.status, error.code, error.message, error.details);
  }

  return data as T;
}

// --- Types (mirroring api/openapi.yaml component schemas) ------------------

export type Role =
  | "patient"
  | "hospital_staff"
  | "doctor"
  | "case_manager"
  | "driver"
  | "interpreter"
  | "hotel_partner"
  | "admin";

export type User = {
  id: string;
  email: string;
  phone: string | null;
  role: Role;
  status: "Active" | "Deactivated";
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type Hospital = {
  id: string;
  slug: string;
  name: string;
  citySlug: string;
  description: string;
  priceTier: string;
  accreditations: string[];
  languages: string[];
  facilities: string[];
  rating: string;
  reviewCount: number;
  status: string;
};

export type Doctor = {
  id: string;
  hospitalId: string;
  slug: string;
  name: string;
  specialtySlug: string;
  credentials: string;
  yearsExperience: number;
  languages: string[];
  bio: string;
};

export type TreatmentPackage = {
  id: string;
  hospitalId: string;
  name: string;
  specialtySlug: string;
  description: string;
  priceMinUsd: string;
  priceMaxUsd: string;
  includes: string[];
};

export type Application = {
  id: string;
  refNumber: string;
  patientId: string;
  hospitalId: string;
  doctorId: string | null;
  specialtySlug: string;
  status: "Submitted" | "UnderReview" | "InfoRequested" | "Accepted" | "Declined" | "Completed";
  conditionSummary: string | null;
  medications: string | null;
  allergies: string | null;
  treatmentPlan: string | null;
  costEstimateMinUsd: string | null;
  costEstimateMaxUsd: string | null;
  caseManagerUserId: string | null;
  submittedAt: string;
};

// --- Auth --------------------------------------------------------------

export function register(input: { email: string; phone?: string; password: string; fullName: string; termsAccepted: boolean; marketingConsent: boolean }) {
  return request<{ user: User }>("/auth/register", { method: "POST", body: input });
}

export function verifyEmail(input: { userId: string; code: string }) {
  return request<AuthTokens>("/auth/verify", { method: "POST", body: input });
}

export function login(input: { emailOrPhone: string; password: string }) {
  return request<AuthTokens | { challengeId: string; twoFactorRequired: true }>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function refreshTokens(refreshToken: string) {
  return request<AuthTokens>("/auth/refresh", { method: "POST", body: { refreshToken } });
}

export function me(accessToken: string) {
  return request<User>("/me", { accessToken });
}

// --- Hospitals -----------------------------------------------------------

export function searchHospitals(query: { city?: string; specialty?: string } = {}) {
  return request<{ data: Hospital[]; meta: { nextCursor: string | null; hasMore: boolean } }>("/hospitals", { query });
}

export function getHospital(hospitalId: string) {
  return request<Hospital>(`/hospitals/${hospitalId}`);
}

export function listDoctors(hospitalId: string) {
  return request<Doctor[]>(`/hospitals/${hospitalId}/doctors`);
}

export function listPackages(hospitalId: string) {
  return request<TreatmentPackage[]>(`/hospitals/${hospitalId}/packages`);
}

export function listHospitalReviews(hospitalId: string) {
  return request<{ id: string; rating: number; text: string; createdAt: string }[]>(`/hospitals/${hospitalId}/reviews`);
}

// --- Applications ----------------------------------------------------------

export function listApplications(accessToken: string, query: { status?: string; view?: string } = {}) {
  return request<{ data: Application[]; meta: { nextCursor: string | null; hasMore: boolean } }>("/applications", {
    accessToken,
    query,
  });
}

export function getApplication(accessToken: string, applicationId: string) {
  return request<Application>(`/applications/${applicationId}`, { accessToken });
}

export function createApplication(
  accessToken: string,
  input: {
    hospitalId?: string;
    specialtySlug: string;
    preferredStartDate?: string;
    datesFlexible?: boolean;
    conditionSummary?: string;
    medications?: string;
    allergies?: string;
    consentToProcessMedicalData: boolean;
  },
) {
  return request<Application>("/applications", { method: "POST", body: input, accessToken });
}
