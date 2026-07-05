import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { sendOTPEmail } from "@/lib/sendOTP";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await prisma.verificationToken.deleteMany({ where: { email } });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { email, code: hashedCode, expiresAt },
    });

    await sendOTPEmail(email, code); // send real code, store hash

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Send OTP error full:", JSON.stringify(error, null, 2));
    console.error("Send OTP error message:", error.message);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}