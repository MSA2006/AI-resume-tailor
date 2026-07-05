import { NextResponse } from "next/server";
import { tailorResume } from "@/lib/tailorResume";
import { generatePDF } from "@/lib/generatePDF";
import { generateDOCX } from "@/lib/generateDOCX";
import { auth } from "@/auth";
import { uploadResumeFile } from "@/lib/uploadResume";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FREEFORM_HEADING_KEYWORDS = ["additional information", "interests", "publications", "hobbies", "extracurricular"];

export async function POST(req) {
  try {
    let savedResumeId = null;
    const formData = await req.formData();
    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");
    const format = formData.get("format") || "pdf";
    const mode = formData.get("mode") || "professional";
    const confirmedSkillsRaw = formData.get("confirmedSkills");
    const confirmedSkills = confirmedSkillsRaw ? JSON.parse(confirmedSkillsRaw) : [];

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 });
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
      return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });
    }

    if (!resumeText || resumeText.trim() === "") {
      return NextResponse.json({ error: "Could not extract text from file." }, { status: 400 });
    }

    const tailoredData = await tailorResume(resumeText, jobDescription, mode, confirmedSkills);

    // Safety net: strip any free-form section the AI invented that wasn't in the original.
    tailoredData.sections = tailoredData.sections.filter((section) => {
      const headingLower = section.heading.toLowerCase();
      const isFreeformType = FREEFORM_HEADING_KEYWORDS.some((kw) => headingLower.includes(kw));
      if (!isFreeformType) return true;
      const originalLower = resumeText.toLowerCase();
      return FREEFORM_HEADING_KEYWORDS.some((kw) => headingLower.includes(kw) && originalLower.includes(kw));
    });

    let outputBuffer;
    let contentType;
    let downloadName;

    if (format === "docx") {
      outputBuffer = Buffer.from(await generateDOCX(tailoredData));
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      downloadName = "tailored-resume.docx";
    } else {
      outputBuffer = Buffer.from(await generatePDF(tailoredData, mode));
      contentType = "application/pdf";
      downloadName = "tailored-resume.pdf";
    }

    // Save to history if logged in — never block the download on save failure.
    try {
      
      const session = await auth();
      if (session?.user?.id) {
        const { url } = await uploadResumeFile(outputBuffer, session.user.id, format);
const savedResume = await prisma.tailoredResume.create({
  data: {
    userId: session.user.id,
    companyName: tailoredData.companyName || null,
    roleTitle: tailoredData.roleTitle || null,
    mode,
    format,
    changesSummary: tailoredData.changesSummary || null,
    fileUrl: url,
    tailoredJson: JSON.stringify(tailoredData),
  },
});
savedResumeId = savedResume.id;
      }
    } catch (saveError) {
      console.error("History save failed (non-blocking):", saveError);
    }

    return new Response(outputBuffer, {
  status: 200,
  headers: {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${downloadName}"`,
    ...(savedResumeId ? { "X-Resume-Id": savedResumeId } : {}),
  },
});
  } catch (error) {
    console.error("Error in /api/tailor:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}