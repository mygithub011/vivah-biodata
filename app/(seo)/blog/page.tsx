import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schemas";
import { buildBreadcrumbs } from "@/lib/seo/internal-links";
import { BLOG_POSTS } from "@/lib/content/blog/posts";

export const metadata: Metadata = generatePageMetadata({
  title: "Marriage Biodata Blog — Tips, Formats & Guides | ShaadiBio",
  description:
    "Expert articles on creating the perfect marriage biodata. Tips, format guides, photo advice, and more from the ShaadiBio team.",
  keywords: ["marriage biodata blog", "biodata tips", "biodata guide", "marriage biodata help"],
  path: "/blog",
});

export default function BlogIndexPage() {
  const breadcrumbs = buildBreadcrumbs([{ name: "Blog", path: "/blog" }]);

  const schemas = [
    collectionPageSchema({ name: "ShaadiBio Blog", description: "Marriage biodata tips and guides", url: `${SITE_URL}/blog`, itemCount: BLOG_POSTS.length }),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-700">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Blog</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">Marriage Biodata Blog</h1>
        <p className="text-lg text-slate-600 mb-10">
          Expert tips, format guides, and advice for creating the perfect marriage biodata.
        </p>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="border border-gray-200 rounded-2xl p-6 hover:border-red-200 hover:shadow-sm transition-all">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-slate-900 hover:text-red-700 transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-slate-600 mb-3">{post.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.readingTime} min read</span>
                <span>·</span>
                <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</time>
              </div>
            </article>
          ))}
        </div>

        {/* Internal Links */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/collections" className="text-sm text-red-700 hover:underline font-medium">Browse Templates →</Link>
            <Link href="/faq" className="text-sm text-red-700 hover:underline font-medium">FAQs →</Link>
            <Link href="/marriage-biodata-maker" className="text-sm text-red-700 hover:underline font-medium">Biodata Maker →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
