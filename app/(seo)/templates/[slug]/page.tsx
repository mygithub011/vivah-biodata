import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateById, TEMPLATES, COLLECTIONS } from "@/lib/templates/collections";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/constants";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schemas";
import { buildBreadcrumbs } from "@/lib/seo/internal-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateById(slug);
  if (!template) return {};

  const collection = COLLECTIONS.find((c) => c.id === template.collectionId);
  const title = `${template.name} Marriage Biodata Template — ${collection?.name || ""} Collection | ShaadiBio`;
  const description = `Create a beautiful marriage biodata with our ${template.name} template. ${template.tagline}. Part of the ${collection?.name} collection. Download HD PDF instantly.`;

  return generatePageMetadata({
    title,
    description,
    keywords: [`${template.name} biodata template`, `${collection?.name} marriage biodata`, "marriage biodata template", template.id],
    path: `/templates/${slug}`,
  });
}

export default async function TemplateSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateById(slug);
  if (!template) notFound();

  const collection = COLLECTIONS.find((c) => c.id === template.collectionId);
  const relatedTemplates = TEMPLATES.filter((t) => t.collectionId === template.collectionId && t.id !== template.id).slice(0, 4);

  const breadcrumbs = buildBreadcrumbs([
    { name: "Templates", path: "/collections" },
    { name: template.name, path: `/templates/${slug}` },
  ]);

  const faqs = [
    { question: `What is the ${template.name} template?`, answer: `The ${template.name} template is a ${template.tagline.toLowerCase()} marriage biodata design from our ${collection?.name} collection. It features elegant typography and professional layout.` },
    { question: `How do I use the ${template.name} template?`, answer: `Simply select the ${template.name} template from the ${collection?.name} collection, fill in your details using our guided form, and download your HD PDF.` },
    { question: `Can I preview the ${template.name} template for free?`, answer: "Yes! You can preview any template for free. You only pay ₹49 for the HD PDF download without watermark." },
    { question: `Is the ${template.name} template suitable for both bride and groom?`, answer: "Absolutely! All our templates work beautifully for both bride and groom biodatas." },
  ];

  const schemas = [
    webPageSchema({ title: `${template.name} Marriage Biodata Template`, description: template.tagline, url: `${SITE_URL}/templates/${slug}` }),
    breadcrumbSchema(breadcrumbs),
    faqPageSchema(faqs),
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

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-4">
          {template.name} Marriage Biodata Template
        </h1>
        <p className="text-lg text-slate-600 mb-6">{template.tagline} — Part of the {collection?.name} collection</p>

        {/* Template Preview Card */}
        <div
          className="rounded-2xl p-8 mb-8 flex items-center justify-center h-48"
          style={{ background: template.previewColor }}
        >
          <div className="text-center text-white">
            <p className="text-3xl font-bold" style={{ fontFamily: template.fonts.heading }}>
              {template.name}
            </p>
            <p className="mt-2 opacity-80">{template.tagline}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-10 text-center">
          <p className="text-lg font-semibold text-slate-900 mb-3">Use this template now</p>
          <Link
            href={`/collections/${template.collectionId}`}
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Create Biodata with {template.name} →
          </Link>
        </div>

        {/* Template Details */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Template Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Collection</p>
              <p className="font-semibold">{collection?.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Photo Shape</p>
              <p className="font-semibold capitalize">{template.photoShape}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Orientation</p>
              <p className="font-semibold capitalize">{template.orientation}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Style</p>
              <p className="font-semibold capitalize">{template.headerStyle.replace("-", " ")}</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border border-gray-200 rounded-xl p-4">
                <summary className="font-semibold text-slate-900 cursor-pointer group-open:mb-2">
                  {faq.question}
                </summary>
                <p className="text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Templates */}
        {relatedTemplates.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Templates</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedTemplates.map((t) => (
                <Link
                  key={t.id}
                  href={`/templates/${t.id}`}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: t.previewColor }} />
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/collections" className="text-sm text-red-700 hover:underline font-medium">Browse All Collections →</Link>
            <Link href="/blog" className="text-sm text-red-700 hover:underline font-medium">Read Our Blog →</Link>
            <Link href="/faq" className="text-sm text-red-700 hover:underline font-medium">FAQs →</Link>
            <Link href="/marriage-biodata-maker" className="text-sm text-red-700 hover:underline font-medium">Biodata Maker →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
