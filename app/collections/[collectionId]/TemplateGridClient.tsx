"use client";

import { useRouter } from "next/navigation";
import { Collection, BiodataTemplate } from "@/types";
import { useBiodataStore } from "@/lib/store/biodataStore";

export default function TemplateGridClient({ collection }: { collection: Collection }) {
  const router = useRouter();
  const { setTemplate, setCollection } = useBiodataStore();

  const handleSelect = (template: BiodataTemplate) => {
    setCollection(collection.id);
    setTemplate(template.id);
    // Pass via URL params for reliability across SSR/CSR boundary
    router.push(`/create?collection=${collection.id}&template=${template.id}`);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collection.templates.map((template) => (
        <button
          key={template.id}
          onClick={() => handleSelect(template)}
          className="group text-left rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
        >
          {/* Template Preview Card */}
          <div
            className="relative h-52 flex flex-col items-center justify-center p-4"
            style={{ backgroundColor: template.colors.background }}
          >
            {/* Outer border decoration */}
            <div
              className="absolute inset-2 rounded-lg border-2 pointer-events-none"
              style={{ borderColor: template.colors.accent }}
            />
            <div
              className="absolute inset-3 rounded-md border pointer-events-none"
              style={{ borderColor: template.colors.secondary + "60" }}
            />

            {/* Mock biodata layout */}
            <div className="relative z-10 w-full max-w-[160px] flex flex-col items-center gap-2 scale-90">
              {/* Header */}
              <div className="w-full text-center">
                <div className="h-px mb-1" style={{ background: template.colors.secondary }} />
                <div className="h-3 rounded" style={{ background: template.colors.primary + "30", width: "70%", margin: "0 auto" }} />
                <p className="text-[8px] font-bold mt-0.5" style={{ color: template.colors.primary }}>
                  MARRIAGE BIODATA
                </p>
                <div className="h-px mt-1" style={{ background: template.colors.secondary }} />
              </div>

              {/* Photo */}
              {template.photoPosition === "top-center" && (
                <div
                  className="w-12 h-12 flex items-center justify-center text-xs"
                  style={{
                    borderRadius: template.photoShape === "circle" ? "50%" : template.photoShape === "oval" ? "50% / 40%" : "8px",
                    border: `2px solid ${template.colors.secondary}`,
                    backgroundColor: template.colors.lightBg,
                    color: template.colors.secondary,
                  }}
                >
                  👤
                </div>
              )}

              {/* Info rows */}
              {[100, 80, 90, 70, 85, 60].map((w, i) => (
                <div key={i} className="flex gap-1.5 items-center w-full">
                  <div
                    className="h-1.5 rounded-sm flex-shrink-0"
                    style={{ width: "30%", background: template.colors.secondary + "60" }}
                  />
                  <div
                    className="h-1.5 rounded-sm"
                    style={{ width: `${w * 0.5}%`, background: template.colors.text + "25" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Template Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">
                {template.name}
              </h3>
              <div className="flex gap-1 flex-shrink-0 ml-2">
                {[template.colors.primary, template.colors.secondary, template.colors.accent].map((color, i) => (
                  <div key={i} className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">{template.tagline}</p>

            <div
              className="w-full py-2 rounded-lg text-xs font-semibold text-center text-white transition-all group-hover:shadow-md"
              style={{ background: template.colors.primary }}
            >
              Use This Template →
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
