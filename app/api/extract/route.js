import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = file.name.toLowerCase();
    let text = "";

    if (fileName.endsWith(".pdf")) {
      const { parseResumePDF } = await import("@/lib/parseResume");
      text = await parseResumePDF(buffer);
    } else if (fileName.endsWith(".docx")) {
      const { parseResumeDOCX } = await import("@/lib/parseResumeDOCX");
      text = await parseResumeDOCX(buffer);
    }

    return NextResponse.json({ text });

  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json({ error: "Failed to extract text" }, { status: 500 });
  }
}