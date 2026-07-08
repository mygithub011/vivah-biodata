"use client";

import { useState, useRef } from "react";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";

export default function PhotoAboutForm() {
  const { formData, setPhotoUrl, setAboutMe, setHobbies, nextStep, prevStep } = useBiodataStore();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(formData.photoUrl ?? null);
  const [aboutMe, setAboutMeLocal] = useState(formData.aboutMe ?? "");
  const [hobbies, setHobbiesLocal] = useState(formData.hobbies ?? "");
  const [aiLoading, setAiLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image under 5 MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setPhotoUrl(dataUrl);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    // Compose a prompt from the user's data
    const name = formData.personal?.fullName ?? "";
    const profession = formData.career?.currentDesignation ?? "";
    const education = formData.education?.highestQualification ?? "";
    const hobbiesText = hobbies;

    const res = await fetch("/api/ai-about-me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, profession, education, hobbies: hobbiesText }),
    });

    if (res.ok) {
      const { text } = await res.json();
      setAboutMeLocal(text);
      setAboutMe(text);
    }
    setAiLoading(false);
  };

  const handleSubmit = () => {
    setAboutMe(aboutMe);
    setHobbies(hobbies);
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Photo Upload */}
      <section>
        <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-amber-100 pb-2">📸 Profile Photo</h3>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragging ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-red-50/30"
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {preview ? (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-lg"
              />
              <p className="text-sm text-gray-500">Click or drag to change photo</p>
              <button
                type="button"
                className="text-xs text-red-500 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setPhotoUrl("");
                }}
              >
                Remove photo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {uploading ? (
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center text-3xl">
                    📷
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Upload your photo</p>
                    <p className="text-sm text-gray-400 mt-1">Drag & drop or click — JPG/PNG, max 5 MB</p>
                  </div>
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    ✨ Tip: Use a clear, front-facing photo for best results
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Me */}
      <section>
        <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-amber-100 pb-2">✍️ About Me</h3>

        <div className="relative">
          <Textarea
            label="About Me"
            placeholder='e.g. "I am a cheerful, family-oriented person with a passion for music and travel. I believe in maintaining a balance between career and family values..."'
            value={aboutMe}
            onChange={(e) => {
              setAboutMeLocal(e.target.value);
              setAboutMe(e.target.value);
            }}
            rows={5}
            helper="2–4 sentences work best. Keep it warm and personal."
          />

          <Button
            type="button"
            variant="gold"
            size="sm"
            className="mt-3"
            onClick={handleGenerateAI}
            loading={aiLoading}
          >
            🤖 Generate with AI
          </Button>
        </div>
      </section>

      {/* Hobbies */}
      <section>
        <Textarea
          label="Hobbies & Interests"
          placeholder="e.g. Reading, Cooking, Travelling, Yoga, Classical Music"
          value={hobbies}
          onChange={(e) => {
            setHobbiesLocal(e.target.value);
            setHobbies(e.target.value);
          }}
          rows={2}
        />
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onClick={prevStep}>
          ← Back
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={handleSubmit}>
          Preview My Biodata →
        </Button>
      </div>
    </div>
  );
}
