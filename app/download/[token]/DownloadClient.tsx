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
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadToken: token, tier }),
      });

      if (res.ok) {
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/pdf")) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `vivah-biodata-${token.slice(0, 8)}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          // HTML fallback — open in new tab
          const html = await res.text();
          const w = window.open();
          if (w) {
            w.document.write(html);
            w.document.close();
          }
        }
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Download failed. Please try again or contact support.");
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please check your connection and try again.");
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
