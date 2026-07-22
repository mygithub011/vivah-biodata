import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import DownloadClient from "./DownloadClient";
import { BiodataFormData } from "@/types";

interface Params {
  params: Promise<{ token: string }>;
}

export default async function DownloadPage({ params }: Params) {
  const { token } = await params;

  let biodata = null;
  try {
    biodata = await prisma.biodata.findUnique({
      where: { downloadToken: token },
    });
  } catch {
    biodata = null;
  }

  const serverDataAvailable = Boolean(biodata && biodata.paymentStatus === "paid");

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-6">
        ✅
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
      <p className="text-gray-500 text-lg mb-4">
        Your premium biodata is ready. Download it now in HD quality.
      </p>
      {!serverDataAvailable && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-100 text-left text-sm text-yellow-900">
          <p className="font-semibold">Server record not found.</p>
          <p>
            If you just completed a payment in this browser, your biodata can still be restored from this session. Please do not refresh the page while the download completes.
          </p>
        </div>
      )}

      <DownloadClient
        token={token}
        tier={(biodata?.tier as string) ?? "premium"}
        formData={biodata?.formData as Partial<BiodataFormData> | null}
        templateId={biodata?.templateId ?? null}
      />

      <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100">
        <h3 className="font-semibold text-gray-900 mb-3">📱 Share Your Biodata</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            📲 Share on WhatsApp
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            🔗 Copy Share Link
          </button>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-400">
        <p>Download link is valid for 7 days. Order ID: {biodata?.paymentOrderId ?? "N/A"}</p>
        <Link href="/" className="text-red-700 hover:underline mt-2 block">
          ← Create Another Biodata
        </Link>
      </div>
    </div>
  );
}
