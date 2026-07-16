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
  formData?: FormData;
  accessToken?: string;
  idempotencyKey?: string;
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
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
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

export type City = {
  slug: string;
  name: string;
  tagline?: string | null;
  climate?: string | null;
};

export type Specialty = {
  slug: string;
  name: string;
  blurb?: string | null;
};

export type Hospital = {
  id: string;
  slug: string;
  name: string;
  citySlug: string;
  description: string;
  richProfileMarkdown?: string | null;
  specialtySlugs?: string[];
  priceTier: string;
  accreditations: string[];
  languages: string[];
  facilities: string[];
  rating: string;
  reviewCount: number;
  status: string;
  staffTitle?: string | null;
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
  status?: string;
};

export type CaseStatusApi = "Submitted" | "UnderReview" | "InfoRequested" | "Accepted" | "Declined" | "Completed";

export type Application = {
  id: string;
  refNumber: string;
  patientId: string;
  hospitalId: string;
  doctorId: string | null;
  specialtySlug: string;
  status: CaseStatusApi;
  conditionSummary: string | null;
  medications: string | null;
  allergies: string | null;
  treatmentPlan: string | null;
  costEstimateMinUsd: string | null;
  costEstimateMaxUsd: string | null;
  caseManagerUserId: string | null;
  submittedAt: string;
  statusHistory?: { id: string; status: CaseStatusApi; note: string | null; createdAt: string }[];
  patientName?: string | null;
  patientCountry?: string | null;
};

export type Patient = {
  id: string;
  userId: string;
  fullName: string;
  phone: string | null;
  country: string | null;
};

export type Dependent = {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  dateOfBirth: string;
};

export type ChecklistItem = {
  id: string;
  applicationId: string;
  name: string;
  category: "MedicalRecords" | "IdentityDocuments" | "VisaDocuments";
  status: "NotUploaded" | "Uploaded" | "Verified" | "Rejected";
  note: string | null;
  uploadedAt: string | null;
  downloadUrl: string | null;
};

export type CaseMessage = {
  id: string;
  applicationId: string;
  senderUserId: string;
  body: string;
  createdAt: string;
};

export type InternalNote = {
  id: string;
  applicationId: string;
  authorUserId: string;
  note: string;
  createdAt: string;
};

export type Invoice = {
  id: string;
  applicationId: string;
  description: string;
  amountUsd: string;
  status: "Due" | "Paid" | "Refunded" | "Cancelled";
  dueDate: string | null;
  createdAt: string;
};

export type Payment = {
  id: string;
  invoiceId: string;
  amountUsd: string;
  provider: string;
  providerRef: string;
  paidAt: string;
};

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: string;
  linkUrl: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPreference = {
  category: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
};

export type Review = {
  id: string;
  applicationId: string;
  patientId: string;
  hospitalId: string;
  rating: number;
  text: string;
  status: "Pending" | "Approved" | "Rejected" | "Redacted";
  createdAt: string;
};

export type Hotel = {
  id: string;
  name: string;
  citySlug: string;
  address: string | null;
  rating: string;
  roomTypes?: RoomType[];
};

export type RoomType = {
  id: string;
  hotelId: string;
  name: string;
  roomCount: number;
  baseRateUsd: string;
};

export type HotelBooking = {
  id: string;
  hotelId: string;
  roomTypeId: string;
  applicationId: string | null;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Cancelled";
  hotel?: { name: string; citySlug: string };
  roomType?: { name: string };
};

export type Transfer = {
  id: string;
  applicationId: string;
  direction: "Arrival" | "Departure";
  flightNumber: string | null;
  scheduledAt: string;
  pickupLocation: string;
  driverId: string | null;
  status: "Requested" | "Assigned" | "Completed" | "Cancelled";
};

export type InterpreterSession = {
  id: string;
  applicationId: string;
  interpreterId: string | null;
  hospitalVisitAt: string;
  department: string | null;
  note: string | null;
  status: "Requested" | "Assigned" | "Completed" | "Cancelled";
};

/** Shape of GET /drivers/me/trips — adds patient/case context not present on the base Transfer. */
export type MyTrip = Transfer & { refNumber: string; patientName: string | null; patientPhone: string | null };

/** Shape of GET /interpreters/me/appointments — adds patient/case context not present on the base InterpreterSession. */
export type MyAppointment = InterpreterSession & { refNumber: string; patientName: string | null; hospitalName: string | null };

export type DriverProfile = { id: string; userId: string; fullName: string; phone: string | null };
export type InterpreterProfile = { id: string; userId: string; fullName: string; languages: string[] };

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string | null;
  status: "Draft" | "Published";
  publishedAt: string | null;
};

export type AuditLogEntry = {
  id: string;
  actorUserId: string | null;
  actorLabel: string;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type ModerationItem = {
  id: string;
  hospitalId: string;
  changeSummary: string;
  submittedAt: string;
  resolvedAt: string | null;
  approved: boolean | null;
};

export type CommissionRate = {
  id: string;
  partnerType: "Hospital" | "Hotel" | "Transport";
  hospitalId: string | null;
  hotelId: string | null;
  rate: string;
};

export type PlatformAnalytics = {
  bookingsThisMonth: number;
  revenueThisMonthUsd: number;
  activeCases: number;
  slaComplianceRate: number;
  conversionFunnel: { stage: string; count: number }[];
};

type Paginated<T> = { data: T[]; meta: { nextCursor: string | null; hasMore: boolean } };

// --- Auth --------------------------------------------------------------

export function register(input: {
  email: string;
  phone?: string;
  password: string;
  fullName: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
}) {
  return request<{ user: User }>("/auth/register", { method: "POST", body: input });
}

export function verifyEmail(input: { userId: string; code: string }) {
  return request<AuthTokens>("/auth/verify", { method: "POST", body: input });
}

export function resendVerification(userId: string) {
  return request<void>("/auth/resend-verification", { method: "POST", body: { userId } });
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

// --- Patient profile & dependents -------------------------------------------

export function getMyPatientProfile(accessToken: string) {
  return request<Patient>("/patients/me", { accessToken });
}

export function updateMyPatientProfile(accessToken: string, input: { fullName?: string; phone?: string; country?: string }) {
  return request<Patient>("/patients/me", { method: "PATCH", body: input, accessToken });
}

export function listDependents(accessToken: string) {
  return request<Dependent[]>("/patients/me/dependents", { accessToken });
}

export function addDependent(accessToken: string, input: { fullName: string; relationship: string; dateOfBirth: string }) {
  return request<Dependent>("/patients/me/dependents", { method: "POST", body: input, accessToken });
}

export function updateDependent(
  accessToken: string,
  dependentId: string,
  input: { fullName?: string; relationship?: string; dateOfBirth?: string },
) {
  return request<Dependent>(`/patients/me/dependents/${dependentId}`, { method: "PATCH", body: input, accessToken });
}

export function deleteDependent(accessToken: string, dependentId: string) {
  return request<void>(`/patients/me/dependents/${dependentId}`, { method: "DELETE", accessToken });
}

// --- Hospitals -----------------------------------------------------------

export function searchHospitals(query: { city?: string; specialty?: string } = {}) {
  return request<Paginated<Hospital>>("/hospitals", { query });
}

export function listSpecialties() {
  return request<Specialty[]>("/specialties");
}

export function getHospital(hospitalId: string) {
  return request<Hospital>(`/hospitals/${hospitalId}`);
}

export function getMyHospital(accessToken: string) {
  return request<Hospital>("/hospitals/mine", { accessToken });
}

export function submitHospitalChange(accessToken: string, hospitalId: string, input: Record<string, unknown>) {
  return request<ModerationItem>(`/hospitals/${hospitalId}`, { method: "PATCH", body: input, accessToken });
}

export function listDoctors(hospitalId: string) {
  return request<Doctor[]>(`/hospitals/${hospitalId}/doctors`);
}

export function addDoctor(
  accessToken: string,
  hospitalId: string,
  input: { slug: string; name: string; specialtySlug: string; credentials: string; yearsExperience: number; languages: string[]; bio: string },
) {
  return request<Doctor>(`/hospitals/${hospitalId}/doctors`, { method: "POST", body: input, accessToken });
}

export function listPackages(hospitalId: string) {
  return request<TreatmentPackage[]>(`/hospitals/${hospitalId}/packages`);
}

export function addPackage(
  accessToken: string,
  hospitalId: string,
  input: { name: string; specialtySlug: string; description: string; priceMinUsd: number; priceMaxUsd: number; includes: string[] },
) {
  return request<TreatmentPackage>(`/hospitals/${hospitalId}/packages`, { method: "POST", body: input, accessToken });
}

export function getHospitalReports(accessToken: string, hospitalId: string) {
  return request<{
    bookingsThisMonth: number;
    revenueThisMonthUsd: number;
    conversionFunnel: { stage: string; count: number }[];
  }>(`/hospitals/${hospitalId}/reports`, { accessToken });
}

export function listHospitalReviews(hospitalId: string) {
  return request<Review[]>(`/hospitals/${hospitalId}/reviews`);
}

// --- Applications ----------------------------------------------------------

export function listApplications(accessToken: string, query: { status?: string; view?: string } = {}) {
  return request<Paginated<Application>>("/applications", { accessToken, query });
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

export function decideApplication(
  accessToken: string,
  applicationId: string,
  input: { decision: "Accept" | "RequestInfo" | "Decline"; treatmentPlan?: string; costEstimateMinUsd?: number; costEstimateMaxUsd?: number; message?: string },
) {
  return request<Application>(`/applications/${applicationId}/decision`, { method: "POST", body: input, accessToken });
}

export function reassignApplication(accessToken: string, applicationId: string, caseManagerUserId: string) {
  return request<Application>(`/applications/${applicationId}/reassign`, {
    method: "POST",
    body: { caseManagerUserId },
    accessToken,
  });
}

export type CaseManager = { userId: string; email: string };

export function listCaseManagers(accessToken: string) {
  return request<CaseManager[]>("/applications/case-managers", { accessToken });
}

export function listCaseMessages(accessToken: string, applicationId: string) {
  return request<CaseMessage[]>(`/applications/${applicationId}/messages`, { accessToken });
}

export function sendCaseMessage(accessToken: string, applicationId: string, body: string) {
  return request<CaseMessage>(`/applications/${applicationId}/messages`, { method: "POST", body: { body }, accessToken });
}

export function listInternalNotes(accessToken: string, applicationId: string) {
  return request<InternalNote[]>(`/applications/${applicationId}/internal-notes`, { accessToken });
}

export function addInternalNote(accessToken: string, applicationId: string, note: string) {
  return request<InternalNote>(`/applications/${applicationId}/internal-notes`, { method: "POST", body: { note }, accessToken });
}

// --- Documents ---------------------------------------------------------------

export function listDocuments(accessToken: string, applicationId: string) {
  return request<ChecklistItem[]>(`/applications/${applicationId}/documents`, { accessToken });
}

export function uploadDocument(accessToken: string, applicationId: string, documentId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request<ChecklistItem>(`/applications/${applicationId}/documents/${documentId}/upload`, {
    method: "POST",
    formData,
    accessToken,
  });
}

/** Ad-hoc upload used by the application wizard — creates its own checklist item rather
 * than filling in one of the items seeded on hospital/case-manager acceptance. */
export function uploadNewDocument(accessToken: string, applicationId: string, file: File, name?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);
  return request<ChecklistItem>(`/applications/${applicationId}/documents`, {
    method: "POST",
    formData,
    accessToken,
  });
}

export function verifyDocument(accessToken: string, applicationId: string, documentId: string, approved: boolean, note?: string) {
  return request<ChecklistItem>(`/applications/${applicationId}/documents/${documentId}/verify`, {
    method: "POST",
    body: { approved, note },
    accessToken,
  });
}

export function generateInvitationLetter(accessToken: string, applicationId: string) {
  return request<{ id: string; downloadUrl: string }>(`/applications/${applicationId}/invitation-letter`, {
    method: "POST",
    accessToken,
  });
}

/** Resolve a relative downloadUrl (local-disk storage mode) against the API host. */
export function absoluteFileUrl(downloadUrl: string): string {
  if (downloadUrl.startsWith("http")) return downloadUrl;
  const apiOrigin = new URL(API_BASE_URL).origin;
  return `${apiOrigin}${downloadUrl}`;
}

// --- Payments -------------------------------------------------------------------

export function listInvoices(accessToken: string, applicationId: string) {
  return request<Invoice[]>(`/applications/${applicationId}/invoices`, { accessToken });
}

export function payInvoice(accessToken: string, invoiceId: string, idempotencyKey: string, paymentMethodToken = "tok_visa") {
  return request<Payment>(`/invoices/${invoiceId}/pay`, {
    method: "POST",
    body: { invoiceId, paymentMethodToken },
    accessToken,
    idempotencyKey,
  });
}

export function listMyPayments(accessToken: string) {
  return request<Paginated<Payment>>("/payments/me", { accessToken });
}

export function refundPayment(accessToken: string, paymentId: string, idempotencyKey: string, amountUsd: number, reason: string) {
  return request<{ id: string }>(`/payments/${paymentId}/refund`, {
    method: "POST",
    body: { amountUsd, reason },
    accessToken,
    idempotencyKey,
  });
}

// --- Notifications ------------------------------------------------------------------

export function listNotifications(accessToken: string, unreadOnly = false) {
  return request<Paginated<AppNotification>>("/notifications", { accessToken, query: { unreadOnly: unreadOnly || undefined } });
}

export function markNotificationRead(accessToken: string, notificationId: string) {
  return request<AppNotification>(`/notifications/${notificationId}/read`, { method: "POST", accessToken });
}

export function markAllNotificationsRead(accessToken: string) {
  return request<void>("/notifications/read-all", { method: "POST", accessToken });
}

export function getNotificationPreferences(accessToken: string) {
  return request<NotificationPreference[]>("/notifications/preferences", { accessToken });
}

export function updateNotificationPreferences(accessToken: string, preferences: NotificationPreference[]) {
  return request<NotificationPreference[]>("/notifications/preferences", { method: "PUT", body: preferences, accessToken });
}

// --- Reviews ------------------------------------------------------------------------

export function submitReview(accessToken: string, input: { applicationId: string; rating: number; text: string }) {
  return request<Review>("/reviews", { method: "POST", body: input, accessToken });
}

export function listPendingReviews(accessToken: string) {
  return request<Review[]>("/admin/reviews", { accessToken });
}

export function moderateReview(accessToken: string, reviewId: string, decision: "Approve" | "Redact" | "Reject", redactedText?: string) {
  return request<Review>(`/admin/reviews/${reviewId}/moderate`, { method: "POST", body: { decision, redactedText }, accessToken });
}

// --- Hotels & bookings ------------------------------------------------------------------

export function searchHotels(query: { city?: string; nearHospitalId?: string } = {}) {
  return request<Hotel[]>("/hotels", { query });
}

export function listRoomTypes(hotelId: string) {
  return request<RoomType[]>(`/hotels/${hotelId}/room-types`);
}

export function getMyHotels(accessToken: string) {
  return request<Hotel[]>("/hotels/mine", { accessToken });
}

export function addRoomType(accessToken: string, hotelId: string, input: { name: string; roomCount: number; baseRateUsd: number }) {
  return request<RoomType>(`/hotels/${hotelId}/room-types`, { method: "POST", body: input, accessToken });
}

export function listHotelBookings(accessToken: string, hotelId: string) {
  return request<HotelBooking[]>(`/hotels/${hotelId}/bookings`, { accessToken });
}

export function listMyHotelBookings(accessToken: string) {
  return request<HotelBooking[]>("/hotel-bookings/me", { accessToken });
}

export function requestHotelBooking(
  accessToken: string,
  hotelId: string,
  input: { applicationId?: string; roomTypeId: string; checkIn: string; checkOut: string },
) {
  return request<HotelBooking>(`/hotels/${hotelId}/bookings`, { method: "POST", body: input, accessToken });
}

export function confirmHotelBooking(accessToken: string, bookingId: string) {
  return request<HotelBooking>(`/hotel-bookings/${bookingId}/confirm`, { method: "POST", accessToken });
}

export function rejectHotelBooking(accessToken: string, bookingId: string) {
  return request<HotelBooking>(`/hotel-bookings/${bookingId}/reject`, { method: "POST", accessToken });
}

// --- Transport -----------------------------------------------------------------------------

export function listTransfers(accessToken: string, applicationId: string) {
  return request<Transfer[]>(`/applications/${applicationId}/transfers`, { accessToken });
}

export function requestTransfer(
  accessToken: string,
  applicationId: string,
  input: { direction: "Arrival" | "Departure"; flightNumber?: string; scheduledAt: string; pickupLocation: string },
) {
  return request<Transfer>(`/applications/${applicationId}/transfers`, { method: "POST", body: input, accessToken });
}

export function assignDriver(accessToken: string, transferId: string, driverId: string) {
  return request<Transfer>(`/transfers/${transferId}/assign`, { method: "POST", body: { driverId }, accessToken });
}

export function completeTransfer(accessToken: string, transferId: string) {
  return request<Transfer>(`/transfers/${transferId}/complete`, { method: "POST", accessToken });
}

export function listMyTrips(accessToken: string, status?: "Assigned" | "Completed") {
  return request<MyTrip[]>("/drivers/me/trips", { accessToken, query: { status } });
}

export function listInterpreterSessions(accessToken: string, applicationId: string) {
  return request<InterpreterSession[]>(`/applications/${applicationId}/interpreter-sessions`, { accessToken });
}

export function requestInterpreterSession(
  accessToken: string,
  applicationId: string,
  input: { hospitalVisitAt: string; department?: string; note?: string },
) {
  return request<InterpreterSession>(`/applications/${applicationId}/interpreter-sessions`, {
    method: "POST",
    body: input,
    accessToken,
  });
}

export function assignInterpreter(accessToken: string, sessionId: string, interpreterId: string) {
  return request<InterpreterSession>(`/interpreter-sessions/${sessionId}/assign`, {
    method: "POST",
    body: { interpreterId },
    accessToken,
  });
}

export function completeInterpreterSession(accessToken: string, sessionId: string) {
  return request<InterpreterSession>(`/interpreter-sessions/${sessionId}/complete`, { method: "POST", accessToken });
}

export function listMyAppointments(accessToken: string) {
  return request<MyAppointment[]>("/interpreters/me/appointments", { accessToken });
}

export function listDrivers(accessToken: string) {
  return request<DriverProfile[]>("/drivers", { accessToken });
}

export function listInterpreters(accessToken: string) {
  return request<InterpreterProfile[]>("/interpreters", { accessToken });
}

export type AssignmentBoardTransfer = {
  id: string;
  applicationId: string;
  refNumber: string;
  direction: "Arrival" | "Departure";
  scheduledAt: string;
  pickupLocation: string;
  status: "Requested" | "Assigned" | "Completed" | "Cancelled";
  assignedTo: string | null;
};

export type AssignmentBoardInterpreterSession = {
  id: string;
  applicationId: string;
  refNumber: string;
  hospitalVisitAt: string;
  department: string | null;
  status: "Requested" | "Assigned" | "Completed" | "Cancelled";
  assignedTo: string | null;
};

export function getAssignmentBoard(accessToken: string) {
  return request<{ transfers: AssignmentBoardTransfer[]; interpreterSessions: AssignmentBoardInterpreterSession[] }>(
    "/assignment-board",
    { accessToken },
  );
}

// --- CMS ---------------------------------------------------------------------------------------

export function listArticles(category?: string) {
  return request<Article[]>("/articles", { query: { category } });
}

export function createArticle(accessToken: string, input: { slug?: string; title: string; excerpt?: string; body: string; category?: string }) {
  return request<Article>("/articles", { method: "POST", body: input, accessToken });
}

export function updateArticle(
  accessToken: string,
  slug: string,
  input: { title?: string; excerpt?: string; body?: string; category?: string; status?: "Draft" | "Published" },
) {
  return request<Article>(`/articles/${slug}`, { method: "PATCH", body: input, accessToken });
}

// --- Admin ---------------------------------------------------------------------------------------

export function getAdminDashboard(accessToken: string) {
  return request<PlatformAnalytics>("/admin/dashboard", { accessToken });
}

export function listAllArticles(accessToken: string) {
  return request<Article[]>("/admin/articles", { accessToken });
}

export function listAdminUsers(accessToken: string, query: { role?: Role; cursor?: string; limit?: number } = {}) {
  return request<Paginated<User>>("/admin/users", { accessToken, query });
}

// --- Admin: cities -------------------------------------------------------------------------

export function listCitiesAdmin(accessToken: string) {
  return request<City[]>("/admin/cities", { accessToken });
}

export function createCity(accessToken: string, input: { slug: string; name: string; tagline?: string; climate?: string }) {
  return request<City>("/admin/cities", { method: "POST", body: input, accessToken });
}

export function createSpecialty(accessToken: string, input: { slug: string; name: string; blurb?: string }) {
  return request<Specialty>("/admin/specialties", { method: "POST", body: input, accessToken });
}

// --- Admin: hospitals / doctors / packages (direct CRUD, no moderation queue) ------------------

export function listAllHospitalsAdmin(accessToken: string) {
  return request<Hospital[]>("/admin/hospitals", { accessToken });
}

export function createHospital(
  accessToken: string,
  input: {
    slug: string;
    name: string;
    citySlug: string;
    description: string;
    richProfileMarkdown?: string;
    priceTier: string;
    specialtySlugs?: string[];
    accreditations: string[];
    languages: string[];
    facilities: string[];
    status?: string;
  },
) {
  return request<Hospital>("/admin/hospitals", { method: "POST", body: input, accessToken });
}

export function adminUpdateHospital(accessToken: string, hospitalId: string, input: Record<string, unknown>) {
  return request<Hospital>(`/admin/hospitals/${hospitalId}`, { method: "PATCH", body: input, accessToken });
}

export function adminCreateDoctor(
  accessToken: string,
  hospitalId: string,
  input: { slug: string; name: string; specialtySlug: string; credentials: string; yearsExperience: number; languages: string[]; bio: string },
) {
  return request<Doctor>(`/admin/hospitals/${hospitalId}/doctors`, { method: "POST", body: input, accessToken });
}

export function adminUpdateDoctor(accessToken: string, hospitalId: string, doctorId: string, input: Record<string, unknown>) {
  return request<Doctor>(`/admin/hospitals/${hospitalId}/doctors/${doctorId}`, { method: "PATCH", body: input, accessToken });
}

export function adminCreatePackage(
  accessToken: string,
  hospitalId: string,
  input: { name: string; specialtySlug: string; description: string; priceMinUsd: number; priceMaxUsd: number; includes: string[] },
) {
  return request<TreatmentPackage>(`/admin/hospitals/${hospitalId}/packages`, { method: "POST", body: input, accessToken });
}

export function adminUpdatePackage(accessToken: string, hospitalId: string, packageId: string, input: Record<string, unknown>) {
  return request<TreatmentPackage>(`/admin/hospitals/${hospitalId}/packages/${packageId}`, { method: "PATCH", body: input, accessToken });
}

export function inviteUser(accessToken: string, email: string, role: Role) {
  return request<User>("/admin/users", { method: "POST", body: { email, role }, accessToken });
}

export function updateUser(accessToken: string, userId: string, input: { role?: Role; status?: "Active" | "Deactivated" }) {
  return request<User>(`/admin/users/${userId}`, { method: "PATCH", body: input, accessToken });
}

export function listModerationQueue(accessToken: string) {
  return request<ModerationItem[]>("/admin/hospitals/moderation-queue", { accessToken });
}

export function resolveModerationItem(accessToken: string, itemId: string, approved: boolean, rejectionReason?: string) {
  return request<ModerationItem>(`/admin/hospitals/moderation-queue/${itemId}/resolve`, {
    method: "POST",
    body: { approved, rejectionReason },
    accessToken,
  });
}

export function listCommissionRates(accessToken: string) {
  return request<CommissionRate[]>("/admin/commission-rates", { accessToken });
}

export function setCommissionRate(
  accessToken: string,
  input: { partnerType: "Hospital" | "Hotel" | "Transport"; hospitalId?: string; hotelId?: string; rate: number },
) {
  return request<CommissionRate>("/admin/commission-rates", { method: "POST", body: input, accessToken });
}

export function listTransactions(accessToken: string, query: { cursor?: string; limit?: number } = {}) {
  return request<Paginated<Payment>>("/admin/transactions", { accessToken, query });
}

export function listAuditLog(accessToken: string, query: { targetType?: string; cursor?: string; limit?: number } = {}) {
  return request<Paginated<AuditLogEntry>>("/admin/audit-log", { accessToken, query });
}

export function getAdminSettings(accessToken: string) {
  return request<Record<string, unknown>>("/admin/settings", { accessToken });
}

export function updateAdminSetting(accessToken: string, key: string, value: unknown) {
  return request<{ key: string; value: unknown }>("/admin/settings", { method: "PUT", body: { key, value }, accessToken });
}
