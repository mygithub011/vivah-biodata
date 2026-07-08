"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { getTemplateById, getCollectionById } from "@/lib/templates/collections";
import PersonalDetailsForm from "@/components/forms/PersonalDetailsForm";
import FamilyDetailsForm from "@/components/forms/FamilyDetailsForm";
import EducationCareerForm from "@/components/forms/EducationCareerForm";
import PhotoAboutForm from "@/components/forms/PhotoAboutForm";
import PreviewStep from "./PreviewStep";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { CollectionId } from "@/types";

const STEPS = [
  { id: 1, label: "Personal", icon: "👤" },
  { id: 2, label: "Family", icon: "👨‍👩‍👧" },
  { id: 3, label: "Career", icon: "💼" },
  { id: 4, label: "Photo & Bio", icon: "📸" },
  { id: 5, label: "Preview", icon: "✨" },
];

// Suspense wrapper required because useSearchParams() is used inside
export default function CreatePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <CreatePage />
    </Suspense>
  );
}

function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCollection = searchParams.get("collection");
  const urlTemplate = searchParams.get("template");

  const { currentStep, selectedTemplateId, selectedCollectionId, formData, _hasHydrated, setCollection, setTemplate } =
    useBiodataStore();

  // Sync URL params → store (URL params are the source of truth on first load)
  useEffect(() => {
    if (urlCollection) setCollection(urlCollection as CollectionId);
    if (urlTemplate) setTemplate(urlTemplate);
  }, [urlCollection, urlTemplate, setCollection, setTemplate]);

  // Effective IDs: prefer URL params over store (in case store hasn't hydrated yet)
  const effectiveTemplateId = urlTemplate ?? selectedTemplateId;
  const effectiveCollectionId = urlCollection ?? selectedCollectionId;

  const template = effectiveTemplateId ? getTemplateById(effectiveTemplateId) : null;

  useEffect(() => {
    if (_hasHydrated && !effectiveTemplateId) {
      router.replace("/collections");
    }
  }, [effectiveTemplateId, router, _hasHydrated]);

  // Show loading only briefly — URL params give us the template immediately
  if (!template) {
    if (!urlTemplate && !_hasHydrated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left: Form */}
          <div className="flex-1 min-w-0">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          step.id < currentStep
                            ? "bg-green-500 text-white"
                            : step.id === currentStep
                            ? "bg-red-700 text-white shadow-lg ring-4 ring-red-100"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.id < currentStep ? "✓" : step.icon}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          step.id === currentStep ? "text-red-700" : step.id < currentStep ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 rounded transition-all ${
                          step.id < currentStep ? "bg-green-400" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {currentStep === 1 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>
                  <PersonalDetailsForm />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Family Details</h2>
                  <FamilyDetailsForm />
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Education, Career & Contact</h2>
                  <EducationCareerForm />
                </>
              )}
              {currentStep === 4 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Photo & About Me</h2>
                  <PhotoAboutForm />
                </>
              )}
              {currentStep === 5 && <PreviewStep template={template} />}
            </div>
          </div>

          {/* Right: Live Preview (sticky) */}
          {currentStep < 5 && (
            <div className="hidden xl:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Preview</p>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: template.colors.lightBg,
                        color: template.colors.primary,
                      }}
                    >
                      {template.name}
                    </span>
                  </div>

                  {/* Scaled preview */}
                  <div className="overflow-hidden rounded-lg border border-gray-100" style={{ height: "400px" }}>
                    <div style={{ transform: "scale(0.33)", transformOrigin: "top left", width: "794px" }}>
                      <TemplateRenderer template={template} data={formData} />
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/collections/${effectiveCollectionId}`)}
                    className="mt-3 w-full text-center text-xs text-red-700 font-medium hover:underline"
                  >
                    ↩ Change Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
