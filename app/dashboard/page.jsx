import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, name: true, email: true },
  });

  if (!user?.emailVerified) redirect("/verify-email?email=" + encodeURIComponent(session.user.email));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <DashboardClient userName={user.name || user.email} />
    </div>
  );
}