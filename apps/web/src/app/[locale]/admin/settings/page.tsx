"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { getAdminSettings, updateAdminSetting } from "@/lib/api";

export default function AdminSettingsPage() {
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [valueInput, setValueInput] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    getAdminSettings(accessToken)
      .then(setSettings)
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleSave(key: string) {
    if (!accessToken) return;
    await updateAdminSetting(accessToken, key, valueInput);
    setSettings((prev) => ({ ...prev, [key]: valueInput }));
    setEditingKey(null);
    setValueInput("");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !newKey.trim()) return;
    await updateAdminSetting(accessToken, newKey.trim(), newValue);
    setSettings((prev) => ({ ...prev, [newKey.trim()]: newValue }));
    setNewKey("");
    setNewValue("");
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  const entries = Object.entries(settings);

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <h1 className="text-2xl font-bold text-neutral-900">Platform Settings</h1>

      <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-neutral-900">Settings</h2>
        <div className="flex flex-col gap-3">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-neutral-700">{key}</span>
              {editingKey === key ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    className="w-48 rounded-md border border-neutral-300 px-2 py-1 text-right"
                  />
                  <button className="text-xs font-semibold text-primary-700" onClick={() => handleSave(key)}>
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className="rounded-md border border-neutral-300 px-2 py-1 text-neutral-700 hover:bg-neutral-100"
                  onClick={() => {
                    setEditingKey(key);
                    setValueInput(String(value));
                  }}
                >
                  {String(value)}
                </button>
              )}
            </div>
          ))}
          {entries.length === 0 ? <p className="text-sm text-neutral-500">No settings configured yet.</p> : null}
        </div>
        <form onSubmit={handleAdd} className="mt-4 flex gap-2 border-t border-neutral-100 pt-4">
          <input placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-32 rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
          <input placeholder="value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="flex-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm" />
          <Button type="submit" size="sm">Add</Button>
        </form>
      </section>
    </div>
  );
}
