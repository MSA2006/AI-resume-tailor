import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionWrapper from "@/components/SessionWrapper";
import Navbar from "@/components/Navbar";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Resume Tailor — Beat the ATS",
  description: "Upload your resume, paste a job description. AI rewrites it to beat ATS and land interviews.",
};


export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
  <SessionWrapper>
    <Navbar />
    <div style={{ paddingTop: "56px" }}>
      {children}
    </div>
  </SessionWrapper>
</body>
    </html>
  );
}