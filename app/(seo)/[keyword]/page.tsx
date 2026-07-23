import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getKeywordBySlug, getAllKeywordSlugs } from "@/lib/seo/keywords";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import { faqPageSchema, breadcrumbSchema, webPageSchema, softwareApplicationSchema } from "@/lib/seo/schemas";
import { getRelatedKeywordLinks, buildBreadcrumbs, getRelatedBlogLinks } from "@/lib/seo/internal-links";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

export async function generateStaticParams() {
  return getAllKeywordSlugs().map((slug) => ({ keyword: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const page = getKeywordBySlug(keyword);
  if (!page) return {};
  return generatePageMetadata({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    path: `/${page.slug}`,
  });
}

export default async function KeywordPage({ params }: PageProps) {
  const { keyword } = await params;
  const page = getKeywordBySlug(keyword);
  if (!page) notFound();

  const breadcrumbs = buildBreadcrumbs([{ name: page.h1.split("—")[0].trim(), path: `/${page.slug}` }]);
  const relatedPages = getRelatedKeywordLinks(page.slug);
  const relatedBlogs = getRelatedBlogLinks(page.keywords);

  const schemas = [
    webPageSchema({ title: page.title, description: page.description, url: `${SITE_URL}/${page.slug}` }),
    softwareApplicationSchema(),
    faqPageSchema(page.faqs),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
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

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-6">{page.h1}</h1>

        {/* Introduction */}
        <p className="text-lg text-slate-600 leading-relaxed mb-10">{page.contentBlocks.introduction}</p>

        {/* CTA */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-10 text-center">
          <p className="text-lg font-semibold text-slate-900 mb-3">Ready to create your biodata?</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            🎨 Create My Biodata — Free
          </Link>
        </div>

        {/* Benefits */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Benefits</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {page.contentBlocks.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-slate-700">
                <span className="text-green-600 mt-1">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {page.contentBlocks.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-slate-700">
                <span className="text-blue-600 mt-1">★</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* Who is it for */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Is It For?</h2>
          <ul className="space-y-2">
            {page.contentBlocks.whoIsItFor.map((w) => (
              <li key={w} className="text-slate-700 pl-4 border-l-2 border-red-200">
                {w}
              </li>
            ))}
          </ul>
        </section>

        {/* How to Use */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use</h2>
          <p className="text-slate-600 leading-relaxed">{page.contentBlocks.usage}</p>
        </section>

        {/* FAQs */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group border border-gray-200 rounded-xl p-4">
                <summary className="font-semibold text-slate-900 cursor-pointer group-open:mb-2">
                  {faq.question}
                </summary>
                <p className="text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Pages */}
        {relatedPages.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Pages</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedPages.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{link.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Blog Posts */}
        {relatedBlogs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedBlogs.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-sm">{link.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Start Creating Your Biodata Now</h2>
          <p className="text-red-100 mb-5">50+ templates. No signup. Preview free. HD download for just ₹49.</p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Templates →
          </Link>
        </div>
      </div>
    </>
  );
}
