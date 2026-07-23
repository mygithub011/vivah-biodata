import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import { faqPageSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { buildBreadcrumbs } from "@/lib/seo/internal-links";
import { FAQ_PAGES, getAllFaqQuestions } from "@/lib/content/faqs/pages";

export const metadata: Metadata = generatePageMetadata({
  title: "Marriage Biodata FAQ — Frequently Asked Questions | ShaadiBio",
  description:
    "Find answers to common questions about creating marriage biodata. Format tips, photo guidelines, content suggestions, and more.",
  keywords: ["marriage biodata faq", "biodata questions", "biodata help", "marriage biodata guide"],
  path: "/faq",
});

export default function FaqIndexPage() {
  const breadcrumbs = buildBreadcrumbs([{ name: "FAQ", path: "/faq" }]);
  const allFaqs = getAllFaqQuestions();

  const schemas = [faqPageSchema(allFaqs), breadcrumbSchema(breadcrumbs)];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-700">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">FAQ</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-slate-600 mb-10">
          Everything you need to know about creating the perfect marriage biodata.
        </p>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {FAQ_PAGES.map((faqPage) => (
            <section key={faqPage.slug}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                <Link href={`/faqs/${faqPage.slug}`} className="hover:text-red-700 transition-colors">
                  {faqPage.title.replace(" — FAQ", "")}
                </Link>
              </h2>
              <div className="space-y-3">
                {faqPage.questions.slice(0, 3).map((q) => (
                  <details key={q.question} className="group border border-gray-200 rounded-xl p-4">
                    <summary className="font-semibold text-slate-900 cursor-pointer group-open:mb-2">
                      {q.question}
                    </summary>
                    <p className="text-slate-600">{q.answer}</p>
                  </details>
                ))}
              </div>
              {faqPage.questions.length > 3 && (
                <Link href={`/faqs/${faqPage.slug}`} className="inline-block mt-3 text-sm text-red-700 hover:underline font-medium">
                  View all {faqPage.questions.length} questions →
                </Link>
              )}
            </section>
          ))}
        </div>

        {/* Internal Links */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/collections" className="text-sm text-red-700 hover:underline font-medium">Browse Templates →</Link>
            <Link href="/blog" className="text-sm text-red-700 hover:underline font-medium">Read Our Blog →</Link>
            <Link href="/marriage-biodata-maker" className="text-sm text-red-700 hover:underline font-medium">Biodata Maker →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
