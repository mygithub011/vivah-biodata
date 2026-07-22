import Link from "next/link";
import CollectionGrid from "@/components/landing/CollectionGrid";
import FeatureSection from "@/components/landing/FeatureSection";
import RealExamples from "@/components/landing/RealExamples";
import { COLLECTIONS, TEMPLATES } from "@/lib/templates/collections";

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pt-24 lg:pb-24">
        {/* Subtle gradient mesh */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-50 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          {/* Tagline */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Trusted by 10,000+ Indian families
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Your perfect{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-red-700">marriage biodata</span>
              <span className="absolute bottom-1 left-0 right-0 z-0 h-3 rounded bg-red-100 sm:h-4" />
            </span>
            <br className="hidden sm:block" />
            {" "}ready in 3 minutes
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {TEMPLATES.length} beautiful PDF templates across {COLLECTIONS.length} curated collections.
            Hindu, Muslim, Sikh, Christian &amp; Jain families — all communities, all styles.
            Fill once, download instantly.
          </p>

          {/* Trust pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: "🎨", text: `${TEMPLATES.length} Templates` },
              { icon: "⚡", text: "No Signup" },
              { icon: "📄", text: "HD PDF" },
              { icon: "🔒", text: "No Watermark" },
              { icon: "🌐", text: "Multi-language" },
            ].map((badge) => (
              <span
                key={badge.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                <span>{badge.icon}</span>
                {badge.text}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/collections"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl"
            >
              🎨 Create My Biodata — Free
            </Link>
            <Link
              href="/collections"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              Browse {COLLECTIONS.length} Collections
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Preview free. Pay only ₹49 for HD download without watermark.
          </p>
        </div>
      </section>

      {/* ── Template Previews ──────────────────────────────────────────── */}
      <RealExamples />

      {/* ── Collections ───────────────────────────────────────────────── */}
      <section id="collections" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-red-700">
              Choose your style
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {COLLECTIONS.length} curated collections for every family
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              From royal grandeur to modern minimalism — find the design that matches your personality.
            </p>
          </div>

          <div className="mt-12">
            <CollectionGrid />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:underline"
            >
              Explore all collections →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features / How it works ───────────────────────────────────── */}
      <div id="how-it-works">
        <FeatureSection />
      </div>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-red-800 to-red-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Ready to impress? Start your biodata now.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-red-200">
            Join thousands of families who created stunning biodatas with ShaadiBio.
            Takes just 3 minutes from start to HD PDF.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/collections"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-amber-400 px-8 py-4 text-base font-bold text-gray-900 transition-all hover:-translate-y-0.5 hover:bg-amber-500"
            >
              Start Creating — It&apos;s Free
            </Link>
          </div>
          <p className="mt-5 text-sm text-red-300">No account needed. Preview unlimited. Pay only to download HD.</p>
        </div>
      </section>
    </div>
  );
}
