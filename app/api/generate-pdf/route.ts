import { NextRequest, NextResponse } from "next/server";

// PDF generation is now handled client-side using html2canvas + jsPDF.
// This route is kept as a stub for backward compatibility.
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "PDF generation has moved to client-side. Please refresh the page and try again." },
    { status: 410 }
  );
}
