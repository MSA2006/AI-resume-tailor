import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { resumeId, atsScoreBefore, atsScoreAfter } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId required" }, { status: 400 });
    }

    // Only update the row if it belongs to this user — security check
    await prisma.tailoredResume.updateMany({
      where: { id: resumeId, userId: session.user.id },
      data: {
        atsScoreBefore: atsScoreBefore ?? null,
        atsScoreAfter: atsScoreAfter ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in PATCH /api/resumes/patch:", error);
    return NextResponse.json({ error: "Failed to update scores" }, { status: 500 });
  }
}