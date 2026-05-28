import { NextResponse } from "next/server";
import { tailorResume } from "@/lib/tailorResume";
import { generatePDF } from "@/lib/generatePDF";
import { generateDOCX } from "@/lib/generateDOCX";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");
    const format = formData.get("format") || "pdf";
    const mode = formData.get("mode") || "professional";
    const confirmedSkillsRaw = formData.get("confirmedSkills");
    const confirmedSkills = confirmedSkillsRaw ? JSON.parse(confirmedSkillsRaw) : [];

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = file.name.toLowerCase();
    let resumeText = "";

    if (fileName.endsWith(".pdf")) {
      const { parseResumePDF } = await import("@/lib/parseResume");
      resumeText = await parseResumePDF(buffer);
    } else if (fileName.endsWith(".docx")) {
      const { parseResumeDOCX } = await import("@/lib/parseResumeDOCX");
      resumeText = await parseResumeDOCX(buffer);
    } else {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported" },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim() === "") {
      return NextResponse.json(
        { error: "Could not extract text from file." },
        { status: 400 }
      );
    }

    const tailoredData = await tailorResume(resumeText, jobDescription, mode, confirmedSkills);

    if (format === "docx") {
      const docxBuffer = await generateDOCX(tailoredData);
      return new Response(docxBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": 'attachment; filename="tailored-resume.docx"',
        },
      });
    } else {
      const pdfBytes = await generatePDF(tailoredData, mode);
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="tailored-resume.pdf"',
        },
      });
    }

  } catch (error) {
    console.error("Error in /api/tailor:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}