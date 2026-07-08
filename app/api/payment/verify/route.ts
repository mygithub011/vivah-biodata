import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      biodataId,
      tier,
    } = await request.json() as {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      biodataId: string;
      tier: string;
    };

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // HMAC-SHA256 signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Generate secure download token
    const downloadToken = uuidv4();

    // Persist to DB if available (non-blocking)
    try {
      await Promise.all([
        prisma.biodata.update({
          where: { id: biodataId },
          data: { paymentStatus: "paid", tier, downloadToken, paidAt: new Date() },
        }),
        prisma.paymentOrder.updateMany({
          where: { razorpayOrderId: razorpay_order_id },
          data: { status: "paid", paymentId: razorpay_payment_id, signature: razorpay_signature },
        }),
      ]);
    } catch {
      console.warn("DB update skipped (no database configured)");
    }

    return NextResponse.json({ downloadToken, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    console.error("verify error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
