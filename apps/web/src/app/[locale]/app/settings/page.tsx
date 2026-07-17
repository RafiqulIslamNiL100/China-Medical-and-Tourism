"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import {
  getMyPatientProfile,
  updateMyPatientProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
  ApiError,
  type NotificationPreference,
} from "@/lib/api";

const DEFAULT_CATEGORIES = ["CaseStatus", "Message", "Payment"];
const CATEGORY_LABELS: Record<string, string> = {
  CaseStatus: "Application status updates",
  Message: "New messages",
  Payment: "Payment reminders",
};

export default function SettingsPage() {
  const { accessToken, user } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "", country: "" });
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([getMyPatientProfile(accessToken), getNotificationPreferences(accessToken)])
      .then(([profile, prefs]) => {
        setForm({ fullName: profile.fullName, phone: profile.phone ?? "", country: profile.country ?? "" });
        setPreferences(
          prefs.length > 0
            ? prefs
            : DEFAULT_CATEGORIES.map((category) => ({ category, emailEnabled: true, smsEnabled: false, inAppEnabled: true })),
        );
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    setSavedMessage(null);
    try {
      await updateMyPatientProfile(accessToken, form);
      setSavedMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePreference(category: string) {
    if (!accessToken) return;
    const next = preferences.map((p) => (p.category === category ? { ...p, emailEnabled: !p.emailEnabled } : p));
    setPreferences(next);
    await updateNotificationPreferences(accessToken, next);
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Profile</h2>
        {error ? <p className="mb-3 text-sm text-danger-700">{error}</p> : null}
        {savedMessage ? <p className="mb-3 text-sm text-success-600">{savedMessage}</p> : null}
        <form onSubmit={handleSaveProfile} className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-neutral-900">
              Full name
            </label>
            <input
              id="name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-900">
              Email
            </label>
            <input
              id="email"
              disabled
              value={user?.email ?? ""}
              className="rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-semibold text-neutral-900">
              Phone
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-semibold text-neutral-900">
              Country
            </label>
            <input
              id="country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
          </div>
          <Button type="submit" size="sm" className="sm:col-span-2 w-fit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Security</h2>
        <p className="mb-3 text-sm text-neutral-500">
          Password changes aren&apos;t available from this screen yet — contact support if you need to reset your
          password.
        </p>
        <Button size="sm" variant="secondary" disabled>
          Change password
        </Button>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Notification preferences</h2>
        <div className="flex flex-col gap-3 text-sm">
          {preferences.map((p) => (
            <label key={p.category} className="flex items-center justify-between">
              {CATEGORY_LABELS[p.category] ?? p.category}
              <input type="checkbox" checked={p.emailEnabled} onChange={() => handleTogglePreference(p.category)} />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-bold text-neutral-900">Privacy</h2>
        <p className="mb-4 text-sm text-neutral-600">
          Request a copy of your data, or request deletion subject to legal retention requirements. Email{" "}
          <a href="mailto:privacy@asiahealthlink.com" className="font-semibold text-primary-700">
            privacy@asiahealthlink.com
          </a>{" "}
          to make a request.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" disabled>
            Export my data
          </Button>
          <Button size="sm" variant="secondary" disabled>
            Request deletion
          </Button>
        </div>
      </section>
    </div>
  );
}
