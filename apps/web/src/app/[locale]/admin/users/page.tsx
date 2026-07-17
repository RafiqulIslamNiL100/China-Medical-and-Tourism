"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDateTime } from "@/lib/portal";
import { listAdminUsers, inviteUser, updateUser, ApiError, type User, type Role } from "@/lib/api";

const roleLabels: Record<string, string> = {
  patient: "Patient",
  hospital_staff: "Hospital Staff",
  doctor: "Doctor",
  case_manager: "Case Manager",
  driver: "Driver",
  interpreter: "Interpreter",
  hotel_partner: "Hotel Partner",
  admin: "Admin",
};

const roles: Role[] = ["patient", "hospital_staff", "doctor", "case_manager", "driver", "interpreter", "hotel_partner", "admin"];

export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listAdminUsers(accessToken)
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await inviteUser(accessToken, email, role);
      setUsers((prev) => [created, ...prev]);
      setEmail("");
      setInviting(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not invite user.");
    }
  }

  async function handleToggleStatus(u: User) {
    if (!accessToken) return;
    const updated = await updateUser(accessToken, u.id, {
      status: u.status === "Active" ? "Deactivated" : "Active",
    });
    setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Users &amp; Roles</h1>
        <Button size="sm" onClick={() => setInviting((v) => !v)}>
          {inviting ? "Cancel" : "Invite User"}
        </Button>
      </div>

      {inviting ? (
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          {error ? <p className="text-sm text-danger-700 basis-full">{error}</p> : null}
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-900">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-900">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" size="sm">Send Invite</Button>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold text-neutral-900">{u.email}</p>
                  {u.phone ? <p className="text-xs text-neutral-500">{u.phone}</p> : null}
                </td>
                <td className="px-4 py-3 text-neutral-700">{roleLabels[u.role] ?? u.role}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.status === "Active" ? "success" : "neutral"}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3 text-neutral-500">{fmtDateTime(u.lastLoginAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-primary-700" onClick={() => handleToggleStatus(u)}>
                    {u.status === "Active" ? "Deactivate" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
