"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Captures the #biodata-preview element and generates a PDF.
 * Works entirely client-side — no Puppeteer needed.
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  filename: string
): Promise<Blob> {
  // Capture at high resolution for print quality
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // A4 dimensions in mm
  const A4_WIDTH = 210;
  const A4_HEIGHT = 297;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Calculate scaling to fit A4
  const imgWidth = A4_WIDTH;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // If content is taller than one page, split across pages
  let heightLeft = imgHeight;
  let position = 0;
  const pageHeight = A4_HEIGHT;

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf.output("blob");
}

/**
 * Triggers a browser download of the PDF blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
