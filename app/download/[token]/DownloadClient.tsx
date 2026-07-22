"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { BiodataFormData } from "@/types";
import { getTemplateById } from "@/lib/templates/collections";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { generatePdfFromElement, downloadBlob } from "@/lib/generatePdfClient";

interface DownloadClientProps {
  token: string;
  tier: string;
  formData: Partial<BiodataFormData> | null;
  templateId: string | null;
}

export default function DownloadClient({ token, tier, formData, templateId }: DownloadClientProps) {
  const [loading, setLoading] = useState(false);

  const template = templateId ? getTemplateById(templateId) : null;

  const handleDownload = async () => {
    if (!formData || !template) {
      alert("Biodata data not found. Please contact support at support@shaadibio.com with your payment ID.");
      return;
    }

    setLoading(true);
    try {
      const el = document.getElementById("biodata-download-render");
      if (!el) {
        alert("Rendering failed. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const blob = await generatePdfFromElement(
        el,
        `vivah-biodata-${token.slice(0, 8)}.pdf`
      );
      downloadBlob(blob, `vivah-biodata-${token.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error("Download error:", err);
      alert("PDF generation failed. Please try again or contact support.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button variant="gold" size="xl" className="w-full" onClick={handleDownload} loading={loading}>
        ⬇️ Download HD PDF
      </Button>
      <p className="text-xs text-gray-400">HD quality · No watermark · Print-ready A4</p>

      {/* Hidden render area for PDF capture */}
      {formData && template && (
        <div
          style={{ position: "absolute", left: "-9999px", top: 0 }}
          aria-hidden="true"
        >
          <div id="biodata-download-render">
            <TemplateRenderer template={template} data={formData} scale={1} />
          </div>
        </div>
      )}
    </div>
  );
}
