import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    const token = await prisma.verificationToken.findFirst({
      where: { email },
    });

    if (!token) return NextResponse.json({ error: "No verification code found. Please register again." }, { status: 400 });
    if (token.expiresAt < new Date()) {
      await prisma.verificationToken.deleteMany({ where: { email } });
      return NextResponse.json({ error: "Code expired. Please register again." }, { status: 400 });
    }
    if (token.attempts >= 5) {
      await prisma.verificationToken.deleteMany({ where: { email } });
      return NextResponse.json({ error: "Too many attempts. Please register again." }, { status: 429 });
    }

    const isValidCode = await bcrypt.compare(code, token.code);
    if (!isValidCode) {
      await prisma.verificationToken.update({
        where: { id: token.id },
        data: { attempts: token.attempts + 1 },
      });
      const remaining = 4 - token.attempts;
      return NextResponse.json({ error: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    await prisma.verificationToken.deleteMany({ where: { email } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}