import type { Metadata } from "next";
import { connection } from "next/server";
import { Link } from "@/components/Link";
import { Container, PageHero } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { listArticles } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { fmtDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Blog",
    description: "Guides and insights for planning your medical trip to China.",
    path: "/blog",
    locale,
  });
}

export default async function BlogIndexPage() {
  // Keep this route dynamically rendered rather than statically prerendered at
  // build time — see the matching comment in destinations/page.tsx.
  await connection();
  const articles = await listArticles();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Guides for your medical journey"
        description="Practical advice from our case management team on visas, travel prep, and treatment options."
      />
      <Container className="py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {post.category ? <Badge tone="primary">{post.category}</Badge> : null}
              <h2 className="font-bold text-neutral-900 group-hover:text-primary-700">
                {post.title}
              </h2>
              {post.excerpt ? <p className="text-sm text-neutral-600">{post.excerpt}</p> : null}
              <p className="mt-auto text-xs text-neutral-500">{fmtDate(post.publishedAt)}</p>
            </Link>
          ))}
          {articles.length === 0 ? (
            <p className="text-neutral-500 sm:col-span-2 lg:col-span-3">
              No articles published yet — check back soon.
            </p>
          ) : null}
        </div>
      </Container>
    </>
  );
}
