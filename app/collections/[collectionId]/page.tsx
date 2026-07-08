import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollectionById } from "@/lib/templates/collections";
import TemplateGridClient from "./TemplateGridClient";

interface Params {
  params: Promise<{ collectionId: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { collectionId } = await params;
  const collection = getCollectionById(collectionId);
  if (!collection) return {};
  return {
    title: `${collection.name} — ShaadiBio`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Params) {
  const { collectionId } = await params;
  const collection = getCollectionById(collectionId);

  if (!collection) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-red-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-red-700 transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{collection.name}</span>
      </nav>

      {/* Collection Header */}
      <div
        className="rounded-3xl p-10 mb-12 text-white relative overflow-hidden"
        style={{ background: collection.previewGradient }}
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/10" />

        <div className="relative">
          <span className="text-5xl block mb-4">{collection.icon}</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{collection.name}</h1>
          <p className="text-white/80 text-lg mb-1">{collection.tagline}</p>
          <p className="text-white/60 text-sm max-w-xl">{collection.description}</p>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose a Template to Get Started
        </h2>
        <p className="text-gray-500">
          Pick any design — you can switch templates later without re-entering your details.
        </p>
      </div>

      {/* Template Grid (client for interactivity) */}
      <TemplateGridClient collection={collection} />
    </div>
  );
}
