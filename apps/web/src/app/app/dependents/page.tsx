import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { dependents } from "@/data/patient";

export const metadata: Metadata = { title: "My Dependents" };

export default function DependentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">My Dependents</h1>
        <Button size="sm">Add Dependent</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {dependents.map((d) => (
          <div key={d.id} className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-neutral-900">{d.name}</p>
            <p className="text-sm text-neutral-500">{d.relationship}</p>
            <p className="mt-2 text-xs text-neutral-500">Date of birth: {d.dob}</p>
            <p className="text-xs text-neutral-500">
              {d.linkedCases} linked case{d.linkedCases === 1 ? "" : "s"}
            </p>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-neutral-300 p-5 text-center text-sm text-neutral-500">
          Add a family member to manage their treatment application under your account.
          <Button size="sm" variant="secondary">
            Add Dependent
          </Button>
        </div>
      </div>
    </div>
  );
}
