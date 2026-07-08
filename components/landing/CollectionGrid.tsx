"use client";

import Link from "next/link";
import { Collection } from "@/types";
import { COLLECTIONS } from "@/lib/templates/collections";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { CollectionId } from "@/types";

export default function CollectionGrid() {
  const setCollection = useBiodataStore((s) => s.setCollection);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {COLLECTIONS.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onSelect={() => setCollection(collection.id as CollectionId)}
        />
      ))}
    </div>
  );
}

function CollectionCard({
  collection,
  onSelect,
}: {
  collection: Collection;
  onSelect: () => void;
}) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      onClick={onSelect}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Gradient Preview Area */}
      <div
        className="relative h-36 flex flex-col items-center justify-center text-white"
        style={{ background: collection.previewGradient }}
      >
        {/* Badge */}
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">
          {collection.badge}
        </span>

        {/* Mini Template Previews */}
        <div className="flex gap-2 mb-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-10 h-14 rounded-sm bg-white/20 backdrop-blur-sm border border-white/30 flex flex-col items-center justify-start pt-1 gap-0.5"
            >
              <div className="w-5 h-5 rounded-full bg-white/40" />
              <div className="w-7 h-0.5 bg-white/50 rounded" />
              <div className="w-6 h-0.5 bg-white/40 rounded" />
              <div className="w-7 h-0.5 bg-white/30 rounded" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <span className="text-2xl">{collection.icon}</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-base">{collection.name}</h3>
          <span className="text-xs text-gray-400">{collection.templates.length} designs</span>
        </div>
        <p className="text-xs text-amber-600 font-medium mb-1.5">{collection.tagline}</p>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{collection.description}</p>

        <div className="mt-3 flex items-center text-red-700 text-xs font-semibold group-hover:gap-2 gap-1 transition-all">
          <span>Browse designs</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
