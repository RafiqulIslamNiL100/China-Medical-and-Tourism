import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { currentPatient } from "@/data/patient";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              Full name
            </label>
            <input
              id="name"
              defaultValue={currentPatient.name}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              Email
            </label>
            <input
              id="email"
              defaultValue={currentPatient.email}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-semibold text-neutral-900">
              Phone
            </label>
            <input
              id="phone"
              defaultValue={currentPatient.phone}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-semibold text-neutral-900">
              Country
            </label>
            <input
              id="country"
              defaultValue={currentPatient.country}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
        </div>
        <Button size="sm" className="mt-4">
          Save changes
        </Button>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Security</h2>
        <Button size="sm" variant="secondary">
          Change password
        </Button>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Notification preferences</h2>
        <div className="flex flex-col gap-3 text-sm">
          {["Application status updates", "New messages", "Payment reminders"].map((label) => (
            <label key={label} className="flex items-center justify-between">
              {label}
              <input type="checkbox" defaultChecked />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-bold text-neutral-900">Privacy</h2>
        <p className="mb-4 text-sm text-neutral-600">
          Request a copy of your data, or request deletion subject to legal retention
          requirements.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">
            Export my data
          </Button>
          <Button size="sm" variant="secondary">
            Request deletion
          </Button>
        </div>
      </section>
    </div>
  );
}
