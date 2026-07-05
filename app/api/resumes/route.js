import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const resumes = await prisma.tailoredResume.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        companyName: true,
        roleTitle: true,
        mode: true,
        format: true,
        atsScoreBefore: true,
        atsScoreAfter: true,
        changesSummary: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Error in GET /api/resumes:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}