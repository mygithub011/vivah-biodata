"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface DownloadClientProps {
  biodataId: string;
  templateId: string;
  tier: string;
  token: string;
  formData: object;
}

export default function DownloadClient({ biodataId, templateId, tier, token, formData }: DownloadClientProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData, templateId, tier }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vivah-biodata-${token.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("Download failed. Please try again or contact support.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button variant="gold" size="xl" className="w-full" onClick={handleDownload} loading={loading}>
        ⬇️ Download HD PDF
      </Button>
      <p className="text-xs text-gray-400">HD quality · No watermark · Print-ready A4</p>
    </div>
  );
}
