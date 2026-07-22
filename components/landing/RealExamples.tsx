import Link from "next/link";
import TemplateCarousel from "@/components/landing/TemplateCarousel";
import { TEMPLATES, COLLECTIONS } from "@/lib/templates/collections";

export default function RealExamples() {
  return (
    <section
      id="real-examples"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Live Template Previews
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              See exactly how your biodata will look
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {TEMPLATES.length} unique designs across {COLLECTIONS.length} collections — each styled with real sample data. Click any card to start with that template.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800"
          >
            View All {TEMPLATES.length} Templates →
          </Link>
        </div>

        <TemplateCarousel />
      </div>
    </section>
  );
}
