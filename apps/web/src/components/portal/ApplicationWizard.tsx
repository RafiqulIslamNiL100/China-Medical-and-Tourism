"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { hospitals, specialties } from "@/data/hospitals";

const steps = ["Specialty & Hospital", "Preferred Dates", "Medical History", "Documents", "Review & Submit"];

export function ApplicationWizard() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    specialty: specialties[0].slug as string,
    hospital: "",
    flexible: true,
    startDate: "",
    conditionSummary: "",
    medications: "",
    allergies: "",
    consent: false,
  });

  const matchingHospitals = hospitals.filter((h) =>
    h.specialties.some((s) => s.toLowerCase().replace(/[^a-z]+/g, "-") === form.specialty)
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
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
                {specialties.map((s) => (
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
                  <option key={h.slug} value={h.slug}>
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
            <div className="rounded-[10px] border-2 border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              Drag files here, or click to browse
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900">Review &amp; submit</h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Specialty</dt>
                <dd className="font-semibold text-neutral-900">
                  {specialties.find((s) => s.slug === form.specialty)?.name}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Hospital</dt>
                <dd className="font-semibold text-neutral-900">
                  {hospitals.find((h) => h.slug === form.hospital)?.name ?? "Not sure — help me choose"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <dt className="text-neutral-500">Preferred start date</dt>
                <dd className="font-semibold text-neutral-900">
                  {form.startDate || "Flexible"}
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
          <Button disabled={!form.consent} onClick={() => setSubmitted(true)}>
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
