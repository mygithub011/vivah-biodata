"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { getTemplateById } from "@/lib/templates/collections";
import { BiodataFormData } from "@/types";

function PrintContent() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");

  if (!encodedData) {
    return <div>No data provided</div>;
  }

  let parsed: { formData: Partial<BiodataFormData>; templateId: string; watermark: boolean };
  try {
    const json = atob(encodedData);
    parsed = JSON.parse(json);
  } catch {
    return <div>Invalid data</div>;
  }

  const template = getTemplateById(parsed.templateId);
  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div style={{ width: "794px", margin: "0 auto", position: "relative" }}>
      {parsed.watermark && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: "none",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(6, 1fr)",
          placeItems: "center",
        }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{
              transform: "rotate(-35deg)",
              fontSize: "42px",
              color: "rgba(0,0,0,0.07)",
              fontWeight: 900,
              whiteSpace: "nowrap",
              letterSpacing: "4px",
              fontFamily: "sans-serif",
            }}>
              SHAADIBIO
            </div>
          ))}
        </div>
      )}
      <TemplateRenderer template={template} data={parsed.formData} scale={1} />
    </div>
  );
}

export default function PrintPreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintContent />
    </Suspense>
  );
}
