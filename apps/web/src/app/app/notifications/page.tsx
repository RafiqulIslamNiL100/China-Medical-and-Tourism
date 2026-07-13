"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { listNotifications, markNotificationRead, markAllNotificationsRead, type AppNotification } from "@/lib/api";

export default function NotificationsPage() {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    listNotifications(accessToken)
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleMarkAll() {
    if (!accessToken) return;
    await markAllNotificationsRead(accessToken);
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
  }

  async function handleClick(n: AppNotification) {
    if (!accessToken || n.readAt) return;
    await markNotificationRead(accessToken, n.id);
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)));
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
        <button onClick={handleMarkAll} className="text-sm font-semibold text-primary-700">
          Mark all as read
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <Link
            key={n.id}
            href={n.linkUrl ?? "#"}
            onClick={() => handleClick(n)}
            className={`flex items-start gap-3 rounded-[10px] border p-4 shadow-sm ${
              n.readAt ? "border-neutral-300 bg-white" : "border-primary-600/30 bg-primary-100"
            }`}
          >
            {!n.readAt ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-600" /> : <span className="mt-1.5 h-2 w-2 shrink-0" />}
            <div>
              <p className="text-sm font-bold text-neutral-900">{n.title}</p>
              <p className="text-sm text-neutral-600">{n.body}</p>
              <p className="mt-1 text-xs text-neutral-500">{fmtDate(n.createdAt)}</p>
            </div>
          </Link>
        ))}
        {notifications.length === 0 ? <p className="text-sm text-neutral-500">No notifications yet.</p> : null}
      </div>
    </div>
  );
}
