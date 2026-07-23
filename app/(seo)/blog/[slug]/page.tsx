import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug, getAllBlogSlugs, getRelatedPosts } from "@/lib/content/blog/posts";
import { generateArticleMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { buildBreadcrumbs } from "@/lib/seo/internal-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return generateArticleMetadata({
    title: post.title,
    description: post.description,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);
  const breadcrumbs = buildBreadcrumbs([
    { name: "Blog", path: "/blog" },
    { name: post.title.split("—")[0].trim(), path: `/blog/${slug}` },
  ]);

  // Nav: previous/next
  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;

  const schemas = [
    articleSchema({
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${slug}`,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      author: post.author,
    }),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          {breadcrumbs.map((item, i) => (
            <span key={item.url}>
              {i > 0 && <span className="mx-2">›</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={item.url.replace(SITE_URL, "") || "/"} className="hover:text-red-700">
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-900">{item.name}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            <span>·</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {post.updatedAt && (
              <>
                <span>·</span>
                <span>Updated {new Date(post.updatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-red-700">
          {post.content.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <br key={i} />;
            if (trimmed.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{trimmed.slice(3)}</h2>;
            if (trimmed.startsWith("### ")) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{trimmed.slice(4)}</h3>;
            if (trimmed.startsWith("- **")) {
              const match = trimmed.match(/^- \*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/);
              if (match) return <li key={i} className="ml-4 mb-1"><strong>{match[1]}</strong>{match[2] ? ` — ${match[2]}` : ""}</li>;
            }
            if (trimmed.startsWith("- ")) return <li key={i} className="ml-4 mb-1">{trimmed.slice(2)}</li>;
            if (/^\d+\.\s\*\*/.test(trimmed)) {
              const match = trimmed.match(/^\d+\.\s\*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/);
              if (match) return <li key={i} className="ml-4 mb-1 list-decimal"><strong>{match[1]}</strong>{match[2] ? ` — ${match[2]}` : ""}</li>;
            }
            return <p key={i} className="mb-4 text-slate-600 leading-relaxed">{trimmed}</p>;
          })}
        </div>

        {/* CTA */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 my-10 text-center">
          <p className="text-lg font-semibold text-slate-900 mb-3">Ready to create your biodata?</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            🎨 Create My Biodata — Free
          </Link>
        </div>

        {/* Previous/Next */}
        <nav className="flex justify-between items-center border-t border-gray-200 pt-8 mb-8">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="text-sm text-red-700 hover:underline">
              ← {prevPost.title.split("—")[0].trim()}
            </Link>
          ) : <span />}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="text-sm text-red-700 hover:underline">
              {nextPost.title.split("—")[0].trim()} →
            </Link>
          ) : <span />}
        </nav>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <p className="font-semibold text-sm text-slate-900">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.readingTime} min read</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/blog" className="text-red-700 hover:underline font-medium">← All Articles</Link>
          <Link href="/faq" className="text-red-700 hover:underline font-medium">FAQs</Link>
          <Link href="/collections" className="text-red-700 hover:underline font-medium">Templates</Link>
        </div>
      </article>
    </>
  );
}
