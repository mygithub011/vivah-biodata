import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import DownloadClient from "./DownloadClient";

interface Params {
  params: Promise<{ token: string }>;
}

export default async function DownloadPage({ params }: Params) {
  const { token } = await params;

  const biodata = await prisma.biodata.findUnique({
    where: { downloadToken: token },
  });

  if (!biodata || biodata.paymentStatus !== "paid") {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      {/* Success header */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-6">
        ✅
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
      <p className="text-gray-500 text-lg mb-8">
        Your premium biodata is ready. Download it now in HD quality.
      </p>

      <DownloadClient
        biodataId={biodata.id}
        templateId={biodata.templateId}
        tier={biodata.tier}
        token={token}
        formData={biodata.formData as object}
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
        <p>Download link is valid for 7 days. Order ID: {biodata.paymentOrderId}</p>
        <Link href="/" className="text-red-700 hover:underline mt-2 block">
          ← Create Another Biodata
        </Link>
      </div>
    </div>
  );
}
