import Link from "next/link";
import CollectionGrid from "@/components/landing/CollectionGrid";
import FeatureSection from "@/components/landing/FeatureSection";

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-amber-700 text-white py-20 md:py-28">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-amber-400/10" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-amber-200 mb-8">
            <span className="text-lg">✨</span>
            <span>AI-Powered Premium Biodata Generator</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Create a Beautiful
            <span className="block text-amber-300">Marriage Biodata</span>
            <span className="block text-3xl md:text-4xl font-medium text-red-200 mt-2">in 2 Minutes</span>
          </h1>

          <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            20 professionally designed templates across Royal, Floral, Traditional, Modern & Luxury collections.
            Live preview. HD PDF. Just ₹49.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/collections"
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              🎨 Choose Your Design Style
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-white/40 hover:border-white/70 text-white font-semibold text-base px-6 py-3.5 rounded-2xl transition-all backdrop-blur-sm"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-red-200">
            <span className="flex items-center gap-1.5"><span>✓</span> 10,000+ Families Served</span>
            <span className="flex items-center gap-1.5"><span>✓</span> 20 Premium Templates</span>
            <span className="flex items-center gap-1.5"><span>✓</span> HD PDF Download</span>
            <span className="flex items-center gap-1.5"><span>✓</span> Live Preview</span>
            <span className="flex items-center gap-1.5"><span>✓</span> Secure Payments</span>
          </div>
        </div>
      </section>

      {/* ── Choose Your Style ────────────────────────────────────────────── */}
      <section id="collections" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">Step 1</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Design Style
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Each collection has its own personality. Pick the one that matches your family's taste.
            </p>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {[
              { label: "All Collections", active: true },
              { label: "👑 Royal" },
              { label: "🌸 Floral" },
              { label: "🛕 Traditional" },
              { label: "✨ Modern" },
              { label: "💎 Luxury" },
              { label: "🏛 Heritage" },
            ].map((f) => (
              <button
                key={f.label}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  f.active
                    ? "bg-red-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <CollectionGrid />

          <div className="text-center mt-10">
            <p className="text-gray-400 text-sm">
              Not sure? <Link href="/collections" className="text-red-700 font-medium hover:underline">Browse all 20 templates →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Features + How It Works + Pricing + Reviews ─────────────────── */}
      <div id="how-it-works">
        <FeatureSection />
      </div>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-red-800 to-red-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Dream Biodata?
          </h2>
          <p className="text-red-200 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of families who have created stunning biodatas with ShaadiBio.
          </p>
          <Link
            href="/collections"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-lg px-10 py-4 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start Creating Now — Free
          </Link>
          <p className="text-red-300 text-sm mt-4">No account required. Preview free. Pay only to download.</p>
        </div>
      </section>
    </div>
  );
}
