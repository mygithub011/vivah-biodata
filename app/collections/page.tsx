import { COLLECTIONS } from "@/lib/templates/collections";
import Link from "next/link";

export const metadata = {
  title: "Browse Collections — ShaadiBio",
  description: "Choose from 6 premium collections: Royal, Floral, Traditional Hindu, Modern Minimal, Luxury Gold, and Heritage. 20 beautiful templates.",
};

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">Our Collections</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your Design Style
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Each collection is designed with a unique aesthetic. Browse all 6 collections, each with multiple unique templates.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
          >
            {/* Gradient Hero */}
            <div
              className="relative h-48 flex items-end justify-start p-6"
              style={{ background: collection.previewGradient }}
            >
              {/* Badge */}
              <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                {collection.badge}
              </span>

              {/* Template count */}
              <span className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {collection.templates.length} templates
              </span>

              {/* Mini previews */}
              <div className="absolute right-6 bottom-4 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-12 rounded bg-white/15 backdrop-blur-sm border border-white/25 flex flex-col items-center justify-start pt-1 gap-0.5"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/40" />
                    <div className="w-6 h-px bg-white/50" />
                    <div className="w-5 h-px bg-white/40" />
                    <div className="w-6 h-px bg-white/30" />
                    <div className="w-4 h-px bg-white/20" />
                  </div>
                ))}
              </div>

              <div>
                <div className="text-4xl mb-1">{collection.icon}</div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-700 transition-colors">
                {collection.name}
              </h2>
              <p className="text-sm text-amber-600 font-semibold mb-3">{collection.tagline}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{collection.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-red-700 group-hover:gap-2 flex items-center gap-1 transition-all">
                  Browse Templates
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
                <div className="flex gap-1">
                  {collection.templates.slice(0, 4).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: collection.templates[i]?.colors.primary ?? "#ccc" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pricing Callout */}
      <div id="pricing" className="mt-20 bg-gradient-to-r from-amber-50 to-red-50 rounded-3xl p-10 text-center border border-amber-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Simple Pricing</h2>
        <p className="text-gray-500 mb-8">One-time payment. No subscriptions. Preview always free.</p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: "Free Preview", price: "₹0", desc: "Watermarked PDF, limited templates" },
            { name: "Premium", price: "₹49", desc: "All templates, HD PDF, no watermark", highlight: true },
            { name: "Premium Plus", price: "₹99", desc: "AI writing, bilingual, WhatsApp card" },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 min-w-[200px] ${
                p.highlight ? "bg-red-700 text-white shadow-xl" : "bg-white border border-gray-200"
              }`}
            >
              <p className={`text-sm font-medium mb-1 ${p.highlight ? "text-red-200" : "text-gray-500"}`}>{p.name}</p>
              <p className={`text-3xl font-bold mb-2 ${p.highlight ? "text-amber-300" : "text-red-700"}`}>{p.price}</p>
              <p className={`text-xs ${p.highlight ? "text-red-100" : "text-gray-400"}`}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
