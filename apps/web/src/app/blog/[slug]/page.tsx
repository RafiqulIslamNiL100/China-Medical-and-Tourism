import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { blogPosts } from "@/data/hospitals";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <Container className="py-12">
      <Link href="/blog" className="text-sm font-semibold text-primary-700">
        &larr; All articles
      </Link>
      <article className="mx-auto mt-6 max-w-2xl">
        <Badge tone="primary">{post.category}</Badge>
        <h1 className="mt-3 text-3xl font-bold text-neutral-900">{post.title}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {post.author} &middot; {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          &middot; {post.readTime}
        </p>
        <div className="mt-6 flex flex-col gap-4 text-neutral-700">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      {related.length > 0 ? (
        <div className="mx-auto mt-14 max-w-2xl border-t border-neutral-300 pt-8">
          <h2 className="mb-4 font-bold text-neutral-900">Related articles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-[10px] border border-neutral-300 bg-white p-4 text-sm font-semibold text-neutral-900 shadow-sm hover:text-primary-700"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
