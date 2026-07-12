import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { hospitalModerationQueue } from "@/data/admin";

export const metadata: Metadata = { title: "Hospital Moderation" };

export default function AdminHospitalModerationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Hospital Listing Moderation</h1>
      <p className="text-sm text-neutral-500">
        Changes to hospital and doctor profiles require approval before they go live.
      </p>

      <div className="flex flex-col gap-4">
        {hospitalModerationQueue.map((item) => (
          <div key={item.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-neutral-900">{item.hospitalName}</p>
            <p className="mt-1 text-sm text-neutral-700">{item.changeSummary}</p>
            <p className="mt-1 text-xs text-neutral-500">Submitted {item.submittedDate}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="secondary">
                Reject
              </Button>
            </div>
          </div>
        ))}
        {hospitalModerationQueue.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            No pending listing changes.
          </div>
        ) : null}
      </div>
    </div>
  );
}
