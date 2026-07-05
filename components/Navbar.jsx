"use client";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: "56px",
      background: "rgba(8, 11, 18, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 800, color: "white",
          fontFamily: "var(--font-display)",
        }}>M</div>
        <span style={{
          fontSize: "16px", fontWeight: 700, color: "var(--text-primary)",
          fontFamily: "var(--font-display)", letterSpacing: "0.5px",
        }}>MAGNA</span>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {session?.user ? (
          <>
            <a href="/dashboard" className="nav-link" style={{
              fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)",
              textDecoration: "none", padding: "6px 12px", borderRadius: "8px",
              border: "1px solid var(--border)", fontFamily: "var(--font-body)",
            }}>
              My Resumes
            </a>
            <a href="/api/auth/signout?callbackUrl=/" style={{
              fontSize: "13px", fontWeight: 500, color: "var(--text-muted)",
              textDecoration: "none", padding: "6px 12px", fontFamily: "var(--font-body)",
            }}>
              Sign out
            </a>
          </>
        ) : (
          <>
            <a href="/login" style={{
              fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)",
              textDecoration: "none", padding: "6px 12px", fontFamily: "var(--font-body)",
            }}>
              Sign in
            </a>
            <a href="/register" className="btn-glow" style={{
              fontSize: "13px", fontWeight: 600, color: "white",
              textDecoration: "none", padding: "8px 16px", borderRadius: "8px",
              fontFamily: "var(--font-body)",
            }}>
              Get Started
            </a>
          </>
        )}
      </div>
    </nav>
  );
}