"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import {
  searchHospitals,
  createApplication,
  listSpecialties,
  uploadNewDocument,
  ApiError,
  type Hospital,
  type Specialty,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-client";

const steps = ["Specialty & Hospital", "Preferred Dates", "Medical History", "Documents", "Review & Submit"];

const ACCEPTED_FILE_TYPES = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export function ApplicationWizard() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [matchingHospitals, setMatchingHospitals] = useState<Hospital[]>([]);
  const [specialtyList, setSpecialtyList] = useState<Specialty[]>([]);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    specialty: "",
    hospital: "",
    flexible: true,
    startDate: "",
    conditionSummary: "",
    medications: "",
    allergies: "",
    consent: false,
  });

  useEffect(() => {
    listSpecialties()
      .then((list) => {
        setSpecialtyList(list);
        setForm((f) => (f.specialty ? f : { ...f, specialty: list[0]?.slug ?? "" }));
      })
      .catch(() => setSpecialtyList([]));
  }, []);

  useEffect(() => {
    if (!form.specialty) return;
    searchHospitals({ specialty: form.specialty })
      .then(({ data }) => setMatchingHospitals(data))
      .catch(() => setMatchingHospitals([]));
  }, [form.specialty]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setFileError(null);
    const accepted: File[] = [];
    for (const file of Array.from(fileList)) {
      if (!ACCEPTED_MIME_TYPES.has(file.type)) {
        setFileError(`${file.name}: unsupported file type. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`${file.name}: file is too large (max 15 MB).`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) setStagedFiles((prev) => [...prev, ...accepted]);
  }

  function removeStagedFile(index: number) {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const application = await createApplication(accessToken, {
        hospitalId: form.hospital || undefined,
        specialtySlug: form.specialty,
        preferredStartDate: form.startDate || undefined,
        datesFlexible: form.flexible,
        conditionSummary: form.conditionSummary || undefined,
        medications: form.medications || undefined,
        allergies: form.allergies || undefined,
        consentToProcessMedicalData: form.consent,
      });

      for (const file of stagedFiles) {
        await uploadNewDocument(accessToken, application.id, file);
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-[10px] border border-neutral-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
          ✓
        </div>
        <h1 className="text-xl font-bold text-neutral-900">Application submitted</h1>
        <p className="mt-2 text-sm text-neutral-600">
          We&apos;ve notified the hospital. You can expect a response within 3 business
          days — track progress from your applications list.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button href="/app/cases">View My Applications</Button>
          <Button href="/app/dashboard" variant="secondary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">New application</h1>
      <p className="mb-6 text-sm text-neutral-500">Step {step + 1} of {steps.length}</p>

      <div className="mb-6 flex items-center gap-1">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-1">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i < step
                  ? "bg-primary-600 text-white"
                  : i === step
                    ? "border-2 border-primary-600 text-primary-700"
                    : "bg-neutral-100 text-neutral-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            {i < steps.length - 1 ? (
              <span className={`h-0.5 flex-1 ${i < step ? "bg-primary-600" : "bg-neutral-200"}`} />
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        {step === 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900">Specialty &amp; hospital</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="specialty" className="text-sm font-semibold text-neutral-900">
                Specialty
              </label>
              <select
                id="specialty"
                value={form.specialty}
                onChange={(e) => update("specialty", e.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              >
                {specialtyList.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="hospital" className="text-sm font-semibold text-neutral-900">
                Preferred hospital (optional)
              </label>
              <select
                id="hospital"
                value={form.hospital}
                onChange={(e) => update("hospital", e.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              >
                <option value="">Not sure — help me choose</option>
                {matchingHospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900">Preferred dates</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="startDate" className="text-sm font-semibold text-neutral-900">
                Preferred start date
              </label>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.flexible}
                onChange={(e) => update("flexible", e.target.checked)}
              />
              My dates are flexible (± 2 weeks)
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900">Medical history</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="conditionSummary" className="text-sm font-semibold text-neutral-900">
                Condition summary
              </label>
              <textarea
                id="conditionSummary"
                rows={4}
                value={form.conditionSummary}
                onChange={(e) => update("conditionSummary", e.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="medications" className="text-sm font-semibold text-neutral-900">
                Current medications
              </label>
              <input
                id="medications"
                type="text"
                value={form.medications}
                onChange={(e) => update("medications", e.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="allergies" className="text-sm font-semibold text-neutral-900">
                Allergies
              </label>
              <input
                id="allergies"
                type="text"
                value={form.allergies}
                onChange={(e) => update("allergies", e.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900">Documents</h2>
            <p className="text-sm text-neutral-600">
              Upload any existing diagnostic reports or medical records. This step is
              optional — you can submit without them and add documents later.
            </p>
            {fileError ? (
              <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{fileError}</p>
            ) : null}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`cursor-pointer rounded-[10px] border-2 border-dashed p-8 text-center text-sm transition-colors ${
                dragActive ? "border-primary-600 bg-primary-50 text-primary-700" : "border-neutral-300 text-neutral-500"
              }`}
            >
              Drag files here, or click to browse
              <p className="mt-1 text-xs text-neutral-400">PDF, DOC, DOCX, PNG, JPG, JPEG — max 15 MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_FILE_TYPES.join(",")}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>
            {stagedFiles.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {stagedFiles.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  >
                    <span className="truncate text-neutral-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeStagedFile(i)}
                      className="ml-3 shrink-0 text-xs font-semibold text-danger-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900">Review &amp; submit</h2>
            {submitError ? (
              <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{submitError}</p>
            ) : null}
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Specialty</dt>
                <dd className="font-semibold text-neutral-900">
                  {specialtyList.find((s) => s.slug === form.specialty)?.name}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Hospital</dt>
                <dd className="font-semibold text-neutral-900">
                  {matchingHospitals.find((h) => h.id === form.hospital)?.name ?? "Not sure — help me choose"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Preferred start date</dt>
                <dd className="font-semibold text-neutral-900">
                  {form.startDate || "Flexible"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Documents</dt>
                <dd className="font-semibold text-neutral-900">
                  {stagedFiles.length > 0 ? `${stagedFiles.length} file${stagedFiles.length === 1 ? "" : "s"}` : "None attached"}
                </dd>
              </div>
            </dl>
            <label className="flex items-start gap-2 text-xs text-neutral-600">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              <span>
                I consent to the processing of my medical information for the purpose of
                this application, per the{" "}
                <Link href="/privacy-policy" className="font-semibold text-primary-700">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
            Continue
          </Button>
        ) : (
          <Button disabled={!form.consent || submitting} onClick={handleSubmit}>
            {submitting ? "Submitting…" : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
