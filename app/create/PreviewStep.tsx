"use client";

import { useState, useCallback } from "react";
import { BiodataTemplate } from "@/types";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { TEMPLATES } from "@/lib/templates/collections";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/templates/collections";
import { generatePdfFromElement, downloadBlob } from "@/lib/generatePdfClient";

interface PreviewStepProps {
  template: BiodataTemplate;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; contact?: string };
  theme?: { color?: string };
}

export default function PreviewStep({ template }: PreviewStepProps) {
  const { formData, selectedCollectionId, setTemplate, prevStep, setPaymentStatus, setDownloadToken } = useBiodataStore();
  const [selectedTier, setSelectedTier] = useState<"free" | "premium" | "premium_plus">("premium");
  const [payLoading, setPayLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState(template.id);

  const allTemplatesInCollection = TEMPLATES.filter((t) => t.collectionId === selectedCollectionId);
  const activeTemplate = allTemplatesInCollection.find((t) => t.id === activeTemplateId) ?? template;
  const isPremiumTemplate = activeTemplate.isPremium === true;
  const effectiveTier = isPremiumTemplate ? "premium" : selectedTier;
  const availablePlans = PRICING_PLANS.filter((plan) =>
    isPremiumTemplate ? plan.id === "premium" : plan.id !== "free"
  );

  const handleDownloadFree = useCallback(async () => {
    setDownloadLoading(true);
    try {
      const el = document.getElementById("biodata-preview");
      if (!el) {
        alert("Preview not ready. Please wait and try again.");
        setDownloadLoading(false);
        return;
      }

      // Add temporary watermark overlay for free preview
      const watermark = document.createElement("div");
      watermark.style.cssText = "position:absolute;inset:0;z-index:9999;pointer-events:none;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(6,1fr);place-items:center;";
      for (let i = 0; i < 12; i++) {
        const mark = document.createElement("div");
        mark.style.cssText = "transform:rotate(-35deg);font-size:42px;color:rgba(0,0,0,0.08);font-weight:900;white-space:nowrap;letter-spacing:4px;font-family:sans-serif;";
        mark.textContent = "SHAADIBIO";
        watermark.appendChild(mark);
      }
      el.style.position = "relative";
      el.appendChild(watermark);

      const blob = await generatePdfFromElement(el, `biodata-${formData.personal?.fullName ?? "preview"}.pdf`);

      // Remove watermark after capture
      el.removeChild(watermark);

      downloadBlob(blob, `biodata-${formData.personal?.fullName ?? "preview"}-watermark.pdf`);
    } catch (err) {
      console.error("Free download error:", err);
      alert("PDF generation failed. Please try again.");
    }
    setDownloadLoading(false);
  }, [formData]);

  const handlePayAndDownload = useCallback(async () => {
    setPayLoading(true);

    // 1. Save biodata + create Razorpay order
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData,
        templateId: activeTemplateId,
        collectionId: selectedCollectionId,
        tier: effectiveTier,
      }),
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.json().catch(() => null);
      alert(errorData?.error || "Failed to create payment order. Please try again.");
      setPayLoading(false);
      return;
    }

    const { orderId, amount, currency, biodataId, key } = await orderRes.json();

    // Razorpay script is already loaded from layout.tsx — open directly
    const razorpayKey = key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    const openCheckout = () => {
      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount,
        currency,
        name: "ShaadiBio",
        description: effectiveTier === "premium" ? "Premium HD Biodata — ₹49" : "Premium Plus Biodata — ₹99",
        order_id: orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            // Verify payment signature on server
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, biodataId, tier: effectiveTier }),
            });

            if (verifyRes.ok) {
              setPaymentStatus("paid");

              // Trigger PDF download directly after payment
              const el = document.getElementById("biodata-preview");
              if (el) {
                try {
                  const { generatePdfFromElement, downloadBlob } = await import("@/lib/generatePdfClient");
                  const blob = await generatePdfFromElement(el, `shaadibio-${formData.personal?.fullName ?? "biodata"}.pdf`);
                  downloadBlob(blob, `shaadibio-${formData.personal?.fullName ?? "biodata"}.pdf`);
                } catch (pdfErr) {
                  console.error("PDF generation after payment:", pdfErr);
                  // Fallback: open print dialog
                  window.print();
                }
              }
            } else {
              const errData = await verifyRes.json().catch(() => null);
              alert(errData?.error || "Payment verification failed. Please contact support at support@shaadibio.com");
            }
          } catch (err) {
            console.error("Payment handler error:", err);
            alert("Something went wrong after payment. Please contact support with your payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: {},
        theme: { color: "#B91C1C" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Handle modal dismiss
      rzp.open();
      setPayLoading(false);
    };

    // If script already loaded (from layout preload), open immediately
    if (window.Razorpay) {
      openCheckout();
    } else {
      // Fallback: load script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = openCheckout;
      script.onerror = () => {
        alert("Failed to load payment gateway. Check your internet connection.");
        setPayLoading(false);
      };
      document.body.appendChild(script);
    }
  }, [formData, activeTemplateId, selectedCollectionId, effectiveTier, setPaymentStatus]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Preview Your Biodata</h2>
        <Button variant="outline" size="sm" onClick={prevStep}>
          ← Edit Details
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Preview Panel */}
        <div className="flex-1">
          {/* Template Switcher */}
          {allTemplatesInCollection.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Switch Template — your details stay the same:
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allTemplatesInCollection.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTemplateId(t.id);
                      setTemplate(t.id);
                    }}
                    className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      t.id === activeTemplateId ? "border-red-600 shadow-lg" : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div
                      className="w-20 h-28 flex flex-col items-center justify-center gap-1 p-2"
                      style={{ backgroundColor: t.colors.background }}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
                        style={{ borderColor: t.colors.secondary, color: t.colors.secondary }}
                      >
                        👤
                      </div>
                      {[70, 90, 60, 80].map((w, i) => (
                        <div key={i} className="h-1 rounded" style={{ width: `${w}%`, background: t.colors.text + "20" }} />
                      ))}
                    </div>
                    <div className="bg-white px-2 py-1.5">
                      <p className="text-[10px] font-bold text-gray-700 text-center">{t.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Biodata Preview */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white">
            <div className="overflow-x-auto">
              <div style={{ minWidth: "794px" }}>
                <TemplateRenderer template={activeTemplate} data={formData} />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Panel */}
        <div className="xl:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Plan Selector */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Choose Your Plan</h3>

              <div className="space-y-3">
                {availablePlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedTier(plan.id as "premium" | "premium_plus")}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      effectiveTier === plan.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{plan.name}</span>
                      <span className="text-xl font-bold text-red-700">₹{plan.price}</span>
                    </div>
                    <ul className="space-y-0.5">
                      {plan.features.map((f) => (
                        <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="text-green-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <Button
                className="w-full mt-4"
                variant="gold"
                size="lg"
                onClick={handlePayAndDownload}
                loading={payLoading}
              >
                💳 Pay & Download HD PDF
              </Button>

              <div className="text-center mt-3">
                <p className="text-xs text-gray-400">Secure payment via Razorpay 🔒</p>
              </div>
            </div>

            {/* Free Download */}
            {!isPremiumTemplate && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">Try Free First</p>
                <p className="text-xs text-gray-400 mb-3">Download a watermarked preview to check the layout.</p>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={handleDownloadFree}
                  loading={downloadLoading}
                >
                  Download Free Preview
                </Button>
              </div>
            )}

            {/* Share */}
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">📱 Share on WhatsApp</p>
              <p className="text-xs text-gray-500 mb-3">Generate a shareable link for this biodata preview.</p>
              <Button variant="secondary" size="md" className="w-full">
                Share Preview Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
