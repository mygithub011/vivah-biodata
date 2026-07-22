import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/templates/collections";
import { prisma } from "@/lib/db";
import { BiodataFormData } from "@/types";

// Increase function timeout for PDF generation on Vercel
export const maxDuration = 60;

async function getBrowser() {
  const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === "production";

  if (isVercel) {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1200, height: 900 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
}

// POST /api/generate-pdf
export async function POST(request: NextRequest) {
  const { downloadToken, formData, templateId, tier } = await request.json() as {
    downloadToken?: string;
    formData?: Partial<BiodataFormData>;
    templateId?: string;
    tier: "free" | "premium" | "premium_plus";
  };

  let trustedFormData: Partial<BiodataFormData> | undefined = formData;
  let trustedTemplateId: string | undefined = templateId;

  if (tier !== "free") {
    if (!downloadToken) {
      return NextResponse.json({ error: "Download token required for paid PDF generation" }, { status: 401 });
    }

    const biodata = await prisma.biodata.findUnique({
      where: { downloadToken },
      select: { formData: true, templateId: true, tier: true, paymentStatus: true },
    });

    if (!biodata || biodata.paymentStatus !== "paid" || biodata.tier !== tier) {
      return NextResponse.json({ error: "Invalid or expired download token" }, { status: 403 });
    }

    trustedFormData = biodata.formData as Partial<BiodataFormData>;
    trustedTemplateId = biodata.templateId;
  }

  if (!trustedTemplateId) {
    return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
  }

  const template = getTemplateById(trustedTemplateId);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  if (!trustedFormData) {
    return NextResponse.json({ error: "Form data is required" }, { status: 400 });
  }

  // Navigate Puppeteer to the print-preview page which renders the actual TemplateRenderer
  const baseUrl = request.nextUrl.origin || `http://localhost:${process.env.PORT || 3000}`;
  const isWatermarked = tier === "free";

  // Encode the data as base64 JSON for the print page
  const payload = JSON.stringify({ formData: trustedFormData, templateId: trustedTemplateId, watermark: isWatermarked });
  const encodedPayload = Buffer.from(payload).toString("base64");

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Navigate to the print-preview page with data
    const printUrl = `${baseUrl}/print-preview?data=${encodeURIComponent(encodedPayload)}`;
    await page.goto(printUrl, { waitUntil: "load", timeout: 30000 });

    // Wait a bit for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="shaadibio-${trustedFormData.personal?.fullName ?? "biodata"}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: "PDF generation failed. Please try again." }, { status: 500 });
  }
}
