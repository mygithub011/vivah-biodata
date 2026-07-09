"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface DownloadClientProps {
  token: string;
  tier: string;
}

export default function DownloadClient({ token, tier }: DownloadClientProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!token) {
      alert("Download token is missing. Please return to the checkout page and retry.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downloadToken: token, tier }),
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
