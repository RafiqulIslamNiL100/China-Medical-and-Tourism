import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/Section";
import { Badge } from "@/components/Badge";
import { blogPosts } from "@/data/hospitals";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and insights for planning your medical trip to China.",
};

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Guides for your medical journey"
        description="Practical advice from our case management team on visas, travel prep, and treatment options."
      />
      <Container className="py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Badge tone="primary">{post.category}</Badge>
              <h2 className="font-bold text-neutral-900 group-hover:text-primary-700">
                {post.title}
              </h2>
              <p className="text-sm text-neutral-600">{post.excerpt}</p>
              <p className="mt-auto text-xs text-neutral-500">
                {post.author} &middot; {post.readTime}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
