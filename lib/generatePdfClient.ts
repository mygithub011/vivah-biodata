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
  // Clone the element so we can modify without affecting the page
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = "absolute";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = "794px";
  clone.style.overflow = "visible";
  clone.style.transform = "none";
  clone.style.zIndex = "-9999";
  clone.style.opacity = "1";

  // Create a container off-screen
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:0;top:0;width:794px;overflow:visible;z-index:-9999;opacity:0;pointer-events:none;";
  container.appendChild(clone);
  document.body.appendChild(container);

  // Wait for rendering
  await new Promise((r) => setTimeout(r, 500));

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 794,
      windowWidth: 794,
    });

    // A4 dimensions in mm
    const A4_WIDTH = 210;
    const A4_HEIGHT = 297;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = A4_WIDTH;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/png");

    if (imgHeight <= A4_HEIGHT) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page: slice the canvas
      const pageCanvasHeight = (A4_HEIGHT / imgHeight) * canvas.height;
      let yOffset = 0;
      let pageNum = 0;

      while (yOffset < canvas.height) {
        if (pageNum > 0) pdf.addPage();

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - yOffset);
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        }

        const pageData = pageCanvas.toDataURL("image/png");
        const pageImgHeight = (sliceHeight * imgWidth) / canvas.width;
        pdf.addImage(pageData, "PNG", 0, 0, imgWidth, pageImgHeight);

        yOffset += pageCanvasHeight;
        pageNum++;
      }
    }

    const arrayBuffer = pdf.output("arraybuffer");
    return new Blob([arrayBuffer], { type: "application/pdf" });
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Triggers a browser download of the PDF blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
