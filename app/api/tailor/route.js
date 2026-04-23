import { NextResponse } from "next/server";
import { parseResume } from "@/lib/parseResume";
import { tailorResume } from "@/lib/tailorResume";
import { generatePDF } from "@/lib/generatePDF";

export async function POST(req) {
  try {
    // Step 1 — Get the form data (PDF file + job description)
    const formData = await req.formData();
    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    // Step 2 — Convert the file to a buffer so pdf-parse can read it
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 3 — Extract text from the PDF
    const resumeText = await parseResume(buffer);

    if (!resumeText || resumeText.trim() === "") {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Make sure it is not a scanned image." },
        { status: 400 }
      );
    }

    // Step 4 — Send to Gemini and get tailored resume back
    const tailoredText = await tailorResume(resumeText, jobDescription);

    // Step 5 — Convert tailored text to PDF
    const pdfBytes = await generatePDF(tailoredText);

    // Step 6 — Return the PDF as a downloadable file
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tailored-resume.pdf"',
      },
    });

  } catch (error) {
    console.error("Error in /api/tailor:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}