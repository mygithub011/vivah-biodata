import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { BiodataFormData } from "@/types";
import { v4 as uuidv4 } from "uuid";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create order";
    console.error("create-order error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

