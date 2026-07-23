import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQ_PAGES, getFaqPageBySlug, getAllFaqSlugs } from "@/lib/content/faqs/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import { faqPageSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { buildBreadcrumbs } from "@/lib/seo/internal-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFaqSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getFaqPageBySlug(slug);
  if (!page) return {};
  return generatePageMetadata({
    title: `${page.title} | ShaadiBio`,
    description: page.description,
    keywords: page.keywords,
    path: `/faqs/${slug}`,
  });
}

export default async function FaqDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getFaqPageBySlug(slug);
  if (!page) notFound();

  const relatedFaqs = FAQ_PAGES.filter((f) => page.relatedSlugs.includes(f.slug));
  const breadcrumbs = buildBreadcrumbs([
    { name: "FAQ", path: "/faq" },
    { name: page.title.replace(" — FAQ", ""), path: `/faqs/${slug}` },
  ]);

  const schemas = [faqPageSchema(page.questions), breadcrumbSchema(breadcrumbs)];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <div className="max-w-3xl mx-auto px-6 py-12">
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

        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">{page.title.replace(" — FAQ", "")}</h1>
        <p className="text-lg text-slate-600 mb-10">{page.description}</p>

        {/* Questions */}
        <div className="space-y-4 mb-10">
          {page.questions.map((q) => (
            <details key={q.question} className="group border border-gray-200 rounded-xl p-5" open>
              <summary className="font-semibold text-slate-900 cursor-pointer group-open:mb-3 text-lg">
                {q.question}
              </summary>
              <p className="text-slate-600 leading-relaxed">{q.answer}</p>
            </details>
          ))}
        </div>

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

        {/* Related FAQ Pages */}
        {relatedFaqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Related Questions</h2>
            <div className="space-y-3">
              {relatedFaqs.map((faq) => (
                <Link
                  key={faq.slug}
                  href={`/faqs/${faq.slug}`}
                  className="block p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <p className="font-semibold text-slate-900">{faq.title.replace(" — FAQ", "")}</p>
                  <p className="text-sm text-slate-500 mt-1">{faq.questions.length} questions</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/faq" className="text-red-700 hover:underline font-medium">← All FAQs</Link>
          <Link href="/blog" className="text-red-700 hover:underline font-medium">Blog</Link>
          <Link href="/collections" className="text-red-700 hover:underline font-medium">Templates</Link>
          <Link href="/marriage-biodata-maker" className="text-red-700 hover:underline font-medium">Biodata Maker</Link>
        </div>
      </div>
    </>
  );
}
