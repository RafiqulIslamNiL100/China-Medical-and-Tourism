"use client";

import { Fragment, useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { listAllArticles, createArticle, updateArticle, ApiError, type Article } from "@/lib/api";

export default function AdminCmsPage() {
  const { accessToken } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", excerpt: "", body: "" });
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", category: "", excerpt: "", body: "" });

  useEffect(() => {
    if (!accessToken) return;
    listAllArticles(accessToken)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const created = await createArticle(accessToken, form);
      setArticles((prev) => [created, ...prev]);
      setForm({ title: "", category: "", excerpt: "", body: "" });
      setCreating(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create article.");
    }
  }

  async function handleTogglePublish(article: Article) {
    if (!accessToken) return;
    const updated = await updateArticle(accessToken, article.slug, {
      status: article.status === "Published" ? "Draft" : "Published",
    });
    setArticles((prev) => prev.map((a) => (a.id === article.id ? updated : a)));
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setEditForm({
      title: article.title,
      category: article.category ?? "",
      excerpt: article.excerpt ?? "",
      body: article.body,
    });
  }

  async function handleSaveEdit(e: React.FormEvent, article: Article) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    try {
      const updated = await updateArticle(accessToken, article.slug, editForm);
      setArticles((prev) => prev.map((a) => (a.id === article.id ? updated : a)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save article.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Content Management</h1>
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancel" : "New Article"}
        </Button>
      </div>

      {creating ? (
        <form onSubmit={handleCreate} className="grid gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:grid-cols-2">
          {error ? <p className="text-sm text-danger-700 sm:col-span-2">{error}</p> : null}
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
          <textarea required placeholder="Body" rows={5} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm sm:col-span-2" />
          <Button type="submit" size="sm" className="w-fit">Save as Draft</Button>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <Fragment key={a.id}>
                <tr className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-semibold text-neutral-900">{a.title}</td>
                  <td className="px-4 py-3 text-neutral-700">{a.category ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{fmtDate(a.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={a.status === "Published" ? "success" : "neutral"}>{a.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      className="mr-3 text-xs font-semibold text-primary-700"
                      onClick={() => (editingId === a.id ? setEditingId(null) : startEdit(a))}
                    >
                      {editingId === a.id ? "Cancel" : "Edit"}
                    </button>
                    <button className="text-xs font-semibold text-primary-700" onClick={() => handleTogglePublish(a)}>
                      {a.status === "Published" ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
                {editingId === a.id ? (
                  <tr className="border-b border-neutral-100 last:border-0 bg-neutral-100">
                    <td colSpan={5} className="px-4 py-4">
                      <form onSubmit={(e) => handleSaveEdit(e, a)} className="grid gap-3 sm:grid-cols-2">
                        {error ? <p className="text-sm text-danger-600 sm:col-span-2">{error}</p> : null}
                        <input
                          required
                          placeholder="Title"
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                        />
                        <input
                          placeholder="Category"
                          value={editForm.category}
                          onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                        />
                        <input
                          placeholder="Excerpt"
                          value={editForm.excerpt}
                          onChange={(e) => setEditForm((f) => ({ ...f, excerpt: e.target.value }))}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm sm:col-span-2"
                        />
                        <textarea
                          required
                          placeholder="Body"
                          rows={6}
                          value={editForm.body}
                          onChange={(e) => setEditForm((f) => ({ ...f, body: e.target.value }))}
                          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm sm:col-span-2"
                        />
                        <Button type="submit" size="sm" className="w-fit">Save Changes</Button>
                      </form>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No articles yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
