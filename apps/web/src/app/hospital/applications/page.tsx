import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { incomingApplications } from "@/data/hospitalStaff";

export const metadata: Metadata = { title: "Applications" };

export default function HospitalApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Applications Queue</h1>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {incomingApplications.map((a) => (
              <tr key={a.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-100/50">
                <td className="px-4 py-3">
                  <Link href={`/hospital/applications/${a.id}`} className="font-semibold text-primary-700">
                    {a.patientName}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {a.refNumber} &middot; {a.patientCountry}
                  </p>
                </td>
                <td className="px-4 py-3 text-neutral-700">{a.specialty}</td>
                <td className="px-4 py-3 text-neutral-500">{a.submittedDate}</td>
                <td className="px-4 py-3">
                  <SlaChip risk={a.slaRisk} />
                </td>
                <td className="px-4 py-3">
                  <Badge>{a.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
