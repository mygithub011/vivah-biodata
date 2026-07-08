import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/templates/collections";
import { BiodataFormData } from "@/types";
import { formatDate, calculateAge } from "@/lib/utils";

// Increase function timeout for PDF generation on Vercel
export const maxDuration = 60;

async function getBrowser() {
  const isVercel = !!process.env.VERCEL || process.env.NODE_ENV === "production";

  if (isVercel) {
    // Serverless-compatible Chromium for Vercel / AWS Lambda
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1200, height: 900 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  // Local development — use bundled Chromium
  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
}

// POST /api/generate-pdf
export async function POST(request: NextRequest) {
  const { formData, templateId, tier } = await request.json() as {
    formData: Partial<BiodataFormData>;
    templateId: string;
    tier: "free" | "premium" | "premium_plus";
  };

  const template = getTemplateById(templateId);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const html = buildBiodataHTML(formData, template, tier === "free");

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="shaadibio-${formData.personal?.fullName ?? "biodata"}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation failed, returning HTML fallback:", err);
    // Graceful fallback — user can print from browser
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
}

function buildBiodataHTML(
  data: Partial<BiodataFormData>,
  template: ReturnType<typeof getTemplateById>,
  watermark: boolean
): string {
  if (!template) return "";

  const { colors, fonts } = template;
  const personal = data.personal;
  const family = data.family;
  const education = data.education;
  const career = data.career;
  const contact = data.contact;
  const expectations = data.expectations;
  const age = personal?.dateOfBirth ? calculateAge(personal.dateOfBirth) : null;

  const photoHtml = data.photoUrl
    ? `<img src="${data.photoUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />`
    : `<div style="color:${colors.secondary};font-size:40px;text-align:center;">👤</div>`;

  const infoRow = (label: string, value: string | undefined | null) =>
    value
      ? `<div style="display:flex;gap:6px;margin-bottom:4px;">
           <span style="font-size:10px;color:${colors.secondary};font-weight:600;min-width:90px;text-transform:uppercase;">${label}</span>
           <span style="font-size:11px;color:${colors.text};">: ${value}</span>
         </div>`
      : "";

  const sectionHtml = (title: string, content: string) => `
    <div style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="height:2px;flex:1;background:${colors.accent};"></div>
        <h2 style="font-family:'${fonts.heading}',serif;font-size:12px;font-weight:700;color:${colors.primary};letter-spacing:2px;text-transform:uppercase;white-space:nowrap;">✦ ${title} ✦</h2>
        <div style="height:2px;flex:1;background:${colors.accent};"></div>
      </div>
      <div style="background:${colors.lightBg};border-radius:8px;padding:12px;border:1px solid ${colors.accent};">
        ${content}
      </div>
    </div>
  `;

  const personalInfo = [
    infoRow("Date of Birth", personal?.dateOfBirth ? formatDate(personal.dateOfBirth) : null),
    infoRow("Age", age ? `${age} Years` : null),
    infoRow("Height", personal?.height),
    infoRow("Complexion", personal?.complexion),
    infoRow("Religion", personal?.religion),
    infoRow("Caste", personal?.caste),
    infoRow("Gotra", personal?.gotra),
    infoRow("Nakshatra", personal?.nakshatra),
    infoRow("Rashi", personal?.rashi),
    infoRow("Manglik", personal?.manglik),
    infoRow("Qualification", education?.highestQualification),
    infoRow("Profession", career?.currentDesignation),
    infoRow("Company", career?.company),
    infoRow("Income", career?.annualIncome),
    infoRow("City", contact?.city),
  ]
    .filter(Boolean)
    .join("");

  const familyInfo = [
    infoRow("Father", family?.fatherName),
    infoRow("Father's Job", family?.fatherOccupation),
    infoRow("Mother", family?.motherName),
    infoRow("Mother's Job", family?.motherOccupation),
    infoRow("Siblings", family?.siblings),
    infoRow("Family Type", family?.familyType),
    infoRow("Native Place", family?.nativePlace),
  ]
    .filter(Boolean)
    .join("");

  const watermarkHtml = watermark
    ? `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);font-size:72px;color:#0002;font-weight:900;pointer-events:none;z-index:999;white-space:nowrap;">SHAADIBIO</div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fonts.heading)}:wght@400;700&family=${encodeURIComponent(fonts.body)}:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'${fonts.body}',sans-serif; background:${colors.background}; color:${colors.text}; }
    .page { width:794px; min-height:1123px; margin:0 auto; padding:32px; position:relative; background:${colors.background}; }
    .border-outer { position:absolute;inset:12px;border:2px solid ${colors.secondary};border-radius:4px;pointer-events:none; }
    .border-inner { position:absolute;inset:8px;border:1px solid ${colors.accent};border-radius:6px;pointer-events:none; }
  </style>
</head>
<body>
  ${watermarkHtml}
  <div class="page">
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div style="position:relative;z-index:1;">
      <!-- Header -->
      <div style="text-align:center;margin-bottom:20px;">
        <p style="font-size:10px;letter-spacing:4px;color:${colors.secondary};text-transform:uppercase;">|| श्री गणेशाय नमः ||</p>
        <h1 style="font-family:'${fonts.heading}',serif;font-size:32px;font-weight:700;color:${colors.primary};margin:4px 0;">${personal?.fullName ?? "Your Name"}</h1>
        <p style="font-size:12px;color:${colors.secondary};font-weight:600;letter-spacing:2px;">── MARRIAGE BIODATA ──</p>
      </div>

      <!-- Photo + Personal Info -->
      <div style="display:flex;gap:24px;margin-bottom:16px;">
        <div style="width:140px;flex-shrink:0;">
          <div style="width:140px;height:140px;border-radius:${template.photoShape === "circle" ? "50%" : "50% / 40%"};border:3px solid ${colors.secondary};overflow:hidden;background:${colors.lightBg};display:flex;align-items:center;justify-content:center;">
            ${photoHtml}
          </div>
        </div>
        <div style="flex:1;background:${colors.lightBg};border-radius:10px;padding:14px;border:1px solid ${colors.accent};">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;">
            ${personalInfo}
          </div>
        </div>
      </div>

      ${data.aboutMe ? sectionHtml("About Me", `<p style="font-size:12px;line-height:1.7;">${data.aboutMe}</p>${data.hobbies ? `<p style="font-size:12px;margin-top:6px;"><strong>Hobbies:</strong> ${data.hobbies}</p>` : ""}`) : ""}
      ${familyInfo ? sectionHtml("Family Details", `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;">${familyInfo}</div>`) : ""}
      ${sectionHtml("Contact Details", `
        ${contact?.contactName ? `<p style="font-size:12px;margin-bottom:4px;">👤 ${contact.contactName}</p>` : ""}
        ${contact?.phone ? `<p style="font-size:12px;margin-bottom:4px;">📞 ${contact.phone}</p>` : ""}
        ${contact?.email ? `<p style="font-size:12px;margin-bottom:4px;">✉️ ${contact.email}</p>` : ""}
        ${contact?.city ? `<p style="font-size:12px;">📍 ${contact.city}, ${contact.state ?? ""}</p>` : ""}
      `)}
    </div>
  </div>
</body>
</html>`;
}
