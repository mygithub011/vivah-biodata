import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? process.env.RAZORPAY_KEY_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured. Add RAZORPAY_WEBHOOK_SECRET to environment variables." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Razorpay webhook signature." }, { status: 400 });
  }

  const body = await request.text();
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Invalid Razorpay webhook signature.");
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch (err) {
    console.error("Failed to parse webhook payload", err);
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const event = payload.event as string;
  const orderId = payload.payload?.order?.entity?.id as string | undefined;
  const payment = payload.payload?.payment?.entity;

  try {
    if (event === "payment.captured" && payment?.order_id) {
      const razorpayOrderId = payment.order_id;
      const paymentId = payment.id;

      const paymentOrder = await prisma.paymentOrder.update({
        where: { razorpayOrderId },
        data: {
          status: "paid",
          paymentId,
          signature,
        },
      });

      // Generate a download token if one doesn't already exist
      const existingBiodata = await prisma.biodata.findUnique({
        where: { id: paymentOrder.biodataId },
        select: { downloadToken: true },
      });

      const downloadToken = existingBiodata?.downloadToken ?? uuidv4();

      await prisma.biodata.updateMany({
        where: { id: paymentOrder.biodataId, paymentStatus: { not: "paid" } },
        data: { paymentStatus: "paid", downloadToken, paidAt: new Date() },
      });

      return NextResponse.json({ success: true });
    }

    if (event === "order.paid" && orderId) {
      await prisma.paymentOrder.updateMany({
        where: { razorpayOrderId: orderId },
        data: { status: "paid" },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
