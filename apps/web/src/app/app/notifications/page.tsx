import type { Metadata } from "next";
import Link from "next/link";
import { patientNotifications } from "@/data/patient";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
        <button className="text-sm font-semibold text-primary-700">Mark all as read</button>
      </div>

      <div className="flex flex-col gap-2">
        {patientNotifications.map((n) => (
          <Link
            key={n.id}
            href={n.href}
            className={`flex items-start gap-3 rounded-[10px] border p-4 shadow-sm ${
              n.read ? "border-neutral-300 bg-white" : "border-primary-600/30 bg-primary-100"
            }`}
          >
            {!n.read ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-600" /> : <span className="mt-1.5 h-2 w-2 shrink-0" />}
            <div>
              <p className="text-sm font-bold text-neutral-900">{n.title}</p>
              <p className="text-sm text-neutral-600">{n.body}</p>
              <p className="mt-1 text-xs text-neutral-500">{n.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
