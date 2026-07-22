"use client";

import { useRef } from "react";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates/collections";

// Pick a diverse set of templates to showcase
const SHOWCASE_IDS = [
  "royal-maharaja",
  "floral-rose",
  "modern-clean",
  "traditional-vedic",
  "luxury-noir",
  "elegant-moonstone",
  "regional-kanchipuram",
  "heritage-temple",
];

const SAMPLE_DATA = [
  { name: "Priya Sharma", dob: "15 Mar 1997", height: "5'4\"", religion: "Hindu", caste: "Brahmin", education: "M.Tech, IIT Delhi", profession: "Data Scientist", income: "18 LPA", city: "Bengaluru" },
  { name: "Ritu Patel", dob: "22 Aug 1998", height: "5'3\"", religion: "Hindu", caste: "Patel", education: "B.Pharm, Gujarat Uni", profession: "Pharmacist", income: "8 LPA", city: "Ahmedabad" },
  { name: "Neha Joshi", dob: "09 Jan 1996", height: "5'5\"", religion: "Hindu", caste: "Maratha", education: "MBA, Symbiosis Pune", profession: "Marketing Manager", income: "14 LPA", city: "Pune" },
  { name: "Aisha Khan", dob: "03 Nov 1997", height: "5'4\"", religion: "Muslim", caste: "Shaikh", education: "MBBS, AMU", profession: "Doctor", income: "12 LPA", city: "Lucknow" },
  { name: "Divya Reddy", dob: "18 Jun 1999", height: "5'6\"", religion: "Hindu", caste: "Reddy", education: "B.Tech, BITS Pilani", profession: "Software Engineer", income: "22 LPA", city: "Hyderabad" },
  { name: "Anjali Nair", dob: "27 Feb 1998", height: "5'3\"", religion: "Hindu", caste: "Nair", education: "CA", profession: "Chartered Accountant", income: "16 LPA", city: "Kochi" },
  { name: "Pooja Singh", dob: "11 Dec 1996", height: "5'5\"", religion: "Sikh", caste: "Jat", education: "BDS", profession: "Dentist", income: "10 LPA", city: "Chandigarh" },
  { name: "Shreya Das", dob: "05 Apr 1997", height: "5'4\"", religion: "Hindu", caste: "Kayastha", education: "B.Arch, Jadavpur", profession: "Architect", income: "11 LPA", city: "Kolkata" },
];

export default function TemplateCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  const showcaseTemplates = SHOWCASE_IDS
    .map((id, i) => {
      const t = TEMPLATES.find((tpl) => tpl.id === id);
      if (!t) return null;
      return { template: t, sample: SAMPLE_DATA[i % SAMPLE_DATA.length] };
    })
    .filter(Boolean) as { template: (typeof TEMPLATES)[number]; sample: (typeof SAMPLE_DATA)[number] }[];

  return (
    <div className="relative">
      {/* Navigation arrows */}
      <div className="absolute -top-14 right-0 flex gap-2 sm:right-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
          aria-label="Scroll left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {showcaseTemplates.map(({ template, sample }) => (
          <Link
            key={template.id}
            href={`/create?collection=${template.collectionId}&template=${template.id}`}
            className="group relative min-w-[280px] snap-start sm:min-w-[310px]"
          >
            {/* Template card — styled using the template's actual colors */}
            <article
              className="relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
              style={{ borderColor: template.colors.accent, backgroundColor: template.colors.background }}
            >
              {/* Top color band */}
              <div
                className="h-3"
                style={{ background: template.previewColor }}
              />

              <div className="px-5 pb-5 pt-4">
                {/* Template name badge */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: template.colors.lightBg, color: template.colors.primary }}
                  >
                    {template.name}
                  </span>
                  <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                    Free
                  </span>
                </div>

                {/* Header area */}
                <div className="mb-3 text-center">
                  <p
                    className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: template.colors.secondary }}
                  >
                    ॥ श्री गणेशाय नमः ॥
                  </p>
                  <h3
                    className="mt-1 text-lg font-bold leading-tight"
                    style={{ color: template.colors.primary, fontFamily: `'${template.fonts.heading}', serif` }}
                  >
                    {sample.name}
                  </h3>
                  <p className="text-[0.65rem] font-medium tracking-wide" style={{ color: template.colors.secondary }}>
                    ── MARRIAGE BIODATA ──
                  </p>
                </div>

                {/* Photo placeholder + details */}
                <div className="flex gap-3">
                  <div
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center text-xl"
                    style={{
                      borderRadius: template.photoShape === "circle" ? "50%" : template.photoShape === "oval" ? "50% / 40%" : "12px",
                      border: `2px solid ${template.colors.secondary}`,
                      backgroundColor: template.colors.lightBg,
                      color: template.colors.secondary,
                    }}
                  >
                    👤
                  </div>
                  <div className="flex-1 space-y-1 text-[0.68rem]" style={{ color: template.colors.text }}>
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ color: template.colors.secondary }}>DOB</span>
                      <span>{sample.dob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ color: template.colors.secondary }}>Height</span>
                      <span>{sample.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ color: template.colors.secondary }}>Religion</span>
                      <span>{sample.religion}</span>
                    </div>
                  </div>
                </div>

                {/* Section divider */}
                <div className="my-3 flex items-center gap-2">
                  <div className="h-px flex-1" style={{ backgroundColor: template.colors.accent }} />
                  <span className="text-[0.6rem]" style={{ color: template.colors.secondary }}>✦</span>
                  <div className="h-px flex-1" style={{ backgroundColor: template.colors.accent }} />
                </div>

                {/* More details */}
                <div
                  className="space-y-1.5 rounded-lg p-3 text-[0.68rem]"
                  style={{ backgroundColor: template.colors.lightBg, color: template.colors.text }}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold" style={{ color: template.colors.secondary }}>Education</span>
                    <span className="text-right">{sample.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold" style={{ color: template.colors.secondary }}>Profession</span>
                    <span>{sample.profession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold" style={{ color: template.colors.secondary }}>Income</span>
                    <span>{sample.income}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold" style={{ color: template.colors.secondary }}>City</span>
                    <span>{sample.city}</span>
                  </div>
                </div>

                {/* Use this template CTA */}
                <div
                  className="mt-3 rounded-lg py-2 text-center text-[0.7rem] font-bold opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: template.colors.primary, color: template.colors.background }}
                >
                  Use This Template →
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
