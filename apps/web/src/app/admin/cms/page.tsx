import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cmsArticles } from "@/data/admin";

export const metadata: Metadata = { title: "CMS" };

export default function AdminCmsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Content Management</h1>
        <Button size="sm">New Article</Button>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cmsArticles.map((a) => (
              <tr key={a.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-neutral-900">{a.title}</td>
                <td className="px-4 py-3 text-neutral-700">{a.author}</td>
                <td className="px-4 py-3 text-neutral-500">{a.updatedDate}</td>
                <td className="px-4 py-3">
                  <Badge tone={a.status === "Published" ? "success" : "neutral"}>{a.status}</Badge>
                </td>
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
