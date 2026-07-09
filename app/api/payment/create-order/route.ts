import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { BiodataFormData } from "@/types";
import { v4 as uuidv4 } from "uuid";

const TIER_PRICES: Record<string, number> = {
  premium: 4900,       // ₹49 in paise
  premium_plus: 9900,  // ₹99 in paise
};

export async function POST(request: NextRequest) {
  try {
    const { formData, templateId, collectionId, tier } = await request.json() as {
      formData: Partial<BiodataFormData>;
      templateId: string;
      collectionId: string;
      tier: "premium" | "premium_plus";
    };

    const amount = TIER_PRICES[tier];
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid tier or amount too small" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured. Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID in Vercel Environment Variables and redeploy.",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Generate a local biodataId — works with or without a database
    const biodataId = uuidv4();

    // Persist to DB if available (non-blocking — won't fail if DB is not set up)
    try {
      const biodata = await prisma.biodata.create({
        data: {
          formData: formData as object,
          templateId,
          collectionId,
          tier,
          paymentStatus: "pending",
          contactPhone: formData.contact?.phone,
          contactEmail: formData.contact?.email,
        },
      });
      // Use DB-assigned id if available
      if (biodata?.id) {
        // We'll use the local UUID as receipt key regardless
      }
    } catch {
      // DB unavailable — continue with local UUID
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `bio_${biodataId.slice(0, 20)}`,
      notes: { biodataId, tier },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      biodataId,
      key: keyId,
    });
  } catch (err: unknown) {
    const statusCode = typeof (err as { statusCode?: number }).statusCode === "number"
      ? (err as { statusCode?: number }).statusCode
      : undefined;
    const razorpayDescription = typeof (err as { error?: { description?: string } }).error?.description === "string"
      ? (err as { error?: { description?: string } }).error?.description
      : undefined;
    const msg = razorpayDescription || (err instanceof Error ? err.message : "Failed to create order");

    console.error("create-order error:", {
      message: msg,
      statusCode,
      error: (err as { error?: unknown })?.error,
    });

    const friendlyMessage = statusCode === 401
      ? "Razorpay authentication failed. Please use valid Razorpay test keys from your Razorpay dashboard."
      : msg;

    return NextResponse.json({ error: friendlyMessage }, { status: 500 });
  }
}

