"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Captures a DOM element and generates a PDF.
 * Works entirely client-side — no Puppeteer needed.
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  filename: string
): Promise<Blob> {
  // Temporarily make the element fully visible for capture
  const origStyles = {
    position: element.style.position,
    overflow: element.style.overflow,
    width: element.style.width,
    height: element.style.height,
    transform: element.style.transform,
  };

  // Ensure element is fully expanded for capture
  element.style.overflow = "visible";
  element.style.width = "794px";
  element.style.transform = "none";

  // Wait for any reflow
  await new Promise((r) => setTimeout(r, 100));

  // Capture at high resolution for print quality
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: 794,
    windowWidth: 794,
  });

  // Restore original styles
  element.style.position = origStyles.position;
  element.style.overflow = origStyles.overflow;
  element.style.width = origStyles.width;
  element.style.height = origStyles.height;
  element.style.transform = origStyles.transform;

  // A4 dimensions in mm
  const A4_WIDTH = 210;
  const A4_HEIGHT = 297;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Calculate scaling to fit A4 width
  const imgWidth = A4_WIDTH;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const imgData = canvas.toDataURL("image/png");

  // If content fits in one page
  if (imgHeight <= A4_HEIGHT) {
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    // Multi-page: slice the canvas into page-sized chunks
    const pageCanvasHeight = (A4_HEIGHT / imgHeight) * canvas.height;
    let yOffset = 0;
    let pageNum = 0;

    while (yOffset < canvas.height) {
      if (pageNum > 0) pdf.addPage();

      // Create a page-sized canvas slice
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      const sliceHeight = Math.min(pageCanvasHeight, canvas.height - yOffset);
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, yOffset, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        );
      }

      const pageImgData = pageCanvas.toDataURL("image/png");
      const pageImgHeight = (sliceHeight * imgWidth) / canvas.width;
      pdf.addImage(pageImgData, "PNG", 0, 0, imgWidth, pageImgHeight);

      yOffset += pageCanvasHeight;
      pageNum++;
    }
  }

  return new Blob([pdf.output("arraybuffer")], { type: "application/pdf" });
}

/**
 * Triggers a browser download of the PDF blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
