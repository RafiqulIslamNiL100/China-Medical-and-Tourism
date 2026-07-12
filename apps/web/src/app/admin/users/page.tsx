import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { platformUsers } from "@/data/admin";

export const metadata: Metadata = { title: "Users & Roles" };

const roleLabels: Record<string, string> = {
  patient: "Patient",
  hospital_staff: "Hospital Staff",
  case_manager: "Case Manager",
  driver: "Driver",
  interpreter: "Interpreter",
  hotel_partner: "Hotel Partner",
  admin: "Admin",
};

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Users &amp; Roles</h1>
        <Button size="sm">Invite User</Button>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {platformUsers.map((u) => (
              <tr key={u.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-neutral-900">{u.name}</p>
                  <p className="text-xs text-neutral-500">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-neutral-700">{roleLabels[u.role]}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.status === "Active" ? "success" : "neutral"}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3 text-neutral-500">{u.lastLogin}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-primary-700">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
