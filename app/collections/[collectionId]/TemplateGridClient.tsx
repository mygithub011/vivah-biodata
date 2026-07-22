"use client";

import { useRouter } from "next/navigation";
import { Collection, BiodataTemplate } from "@/types";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { defaultFormData } from "@/lib/store/biodataStore";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

export default function TemplateGridClient({ collection }: { collection: Collection }) {
  const router = useRouter();
  const { setTemplate, setCollection } = useBiodataStore();

  const handleSelect = (template: BiodataTemplate) => {
    setCollection(collection.id);
    setTemplate(template.id);
    router.push(`/create?collection=${collection.id}&template=${template.id}`);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collection.templates.map((template) => (
        <button
          key={template.id}
          onClick={() => handleSelect(template)}
          className="group text-left rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
        >
          {/* Scaled template preview with sample data */}
          <div className="relative h-[320px] overflow-hidden">
            <div style={{ transform: "scale(0.38)", transformOrigin: "top left", width: "794px" }}>
              <TemplateRenderer template={template} data={defaultFormData} />
            </div>
            {/* Premium badge */}
            {template.isPremium && (
              <div className="absolute top-3 right-3 bg-amber-500 text-white text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                ₹49 Premium
              </div>
            )}
          </div>

          {/* Template Info */}
          <div className="p-4 border-t border-gray-100">
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
