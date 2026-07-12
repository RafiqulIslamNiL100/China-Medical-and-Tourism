import type { Metadata } from "next";
import { Button } from "@/components/Button";

export const metadata: Metadata = { title: "Platform Settings" };

export default function AdminSettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <h1 className="text-2xl font-bold text-neutral-900">Platform Settings</h1>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Supported languages</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {["English", "Simplified Chinese"].map((l) => (
            <span key={l} className="rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700">
              {l}
            </span>
          ))}
        </div>
        <Button size="sm" variant="secondary" className="mt-4">
          Add Language
        </Button>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">SLA thresholds</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700">Hospital response time</span>
            <input
              type="text"
              defaultValue="3 business days"
              className="w-40 rounded-md border border-neutral-300 px-2 py-1 text-right"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700">Document verification time</span>
            <input
              type="text"
              defaultValue="2 business days"
              className="w-40 rounded-md border border-neutral-300 px-2 py-1 text-right"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700">Inquiry acknowledgment</span>
            <input
              type="text"
              defaultValue="5 minutes"
              className="w-40 rounded-md border border-neutral-300 px-2 py-1 text-right"
            />
          </div>
        </div>
        <Button size="sm" className="mt-4">
          Save changes
        </Button>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-bold text-neutral-900">Templates</h2>
        <p className="mb-3 text-sm text-neutral-600">
          Manage document-checklist templates, invitation-letter templates, and
          notification templates.
        </p>
        <div className="flex flex-col gap-2">
          <button className="rounded-md border border-neutral-300 px-3 py-2 text-left text-sm font-semibold text-neutral-900 hover:bg-neutral-100">
            Document checklist templates
          </button>
          <button className="rounded-md border border-neutral-300 px-3 py-2 text-left text-sm font-semibold text-neutral-900 hover:bg-neutral-100">
            Invitation letter template
          </button>
          <button className="rounded-md border border-neutral-300 px-3 py-2 text-left text-sm font-semibold text-neutral-900 hover:bg-neutral-100">
            Notification templates
          </button>
        </div>
      </section>
    </div>
  );
}
