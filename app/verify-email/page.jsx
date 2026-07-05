"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!email) { router.push("/register"); return; }
    const stored = sessionStorage.getItem("magna_pending_password");
    if (stored) {
      setPassword(stored);
      sessionStorage.removeItem("magna_pending_password");
    }
  }, [email, router]);

  async function handleVerify(e) {
    e.preventDefault();
    if (code.length !== 6) { setError("Enter the 6-digit code"); return; }
    setError("");
    setLoading(true);

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid code");
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    router.push("/login");
  }

  async function handleResend() {
    setResending(true);
    setResent(false);
    setError("");
    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResending(false);
    setResent(true);
  }

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px", position: "relative",
    }}>
      <div className="hero-bg"><div className="hero-bg-3" /></div>
      <div className="grid-overlay" />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", margin: "0 auto 12px",
          }}>✉️</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "6px" }}>
            Check your email
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{email}</span>
          </p>
        </div>

        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 600,
                color: "var(--text-secondary)", marginBottom: "6px",
                textTransform: "uppercase", letterSpacing: "0.8px",
                fontFamily: "var(--font-mono)",
              }}>Verification code</label>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                style={{
                  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "11px 14px", fontSize: "24px",
                  color: "var(--text-primary)", outline: "none",
                  fontFamily: "var(--font-mono)", letterSpacing: "8px",
                  textAlign: "center", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px", padding: "10px 12px",
                fontSize: "12px", color: "var(--danger)",
              }}>{error}</div>
            )}

            {resent && (
              <div style={{
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "8px", padding: "10px 12px",
                fontSize: "12px", color: "var(--success)",
              }}>New code sent — check your inbox.</div>
            )}

            <button
              onClick={handleVerify} disabled={loading || code.length !== 6}
              className={loading || code.length !== 6 ? "" : "btn-glow"}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px",
                border: "none", cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
                fontWeight: 700, fontSize: "14px", color: "white", marginTop: "4px",
                background: loading || code.length !== 6 ? "rgba(59,130,246,0.3)" : "linear-gradient(135deg, var(--accent), var(--accent-2))",
                fontFamily: "var(--font-display)", opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Verifying..." : "Verify email →"}
            </button>

            <button
              onClick={handleResend} disabled={resending}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                fontSize: "12px", color: "var(--text-muted)", padding: "4px",
              }}
            >
              {resending ? "Sending..." : "Didn't get the code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Loading...</p>
      </main>
    }>
      <VerifyEmailPage />
    </Suspense>
  );
}