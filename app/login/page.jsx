"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Invalid email or password"); return; }
    router.push("/");
  }

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 600,
    color: "var(--text-secondary)", marginBottom: "6px",
    textTransform: "uppercase", letterSpacing: "0.8px",
    fontFamily: "var(--font-mono)",
  };

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
          }}>⚡</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Sign in to access your resume history
          </p>
        </div>

        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                style={{
                  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "11px 14px", fontSize: "13px",
                  color: "var(--text-primary)", outline: "none",
                  fontFamily: "var(--font-body)", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  style={{
                    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "10px", padding: "11px 40px 11px 14px", fontSize: "13px",
                    color: "var(--text-primary)", outline: "none",
                    fontFamily: "var(--font-body)", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "transparent",
                    border: "none", cursor: "pointer", color: "var(--text-muted)",
                    fontSize: "14px", padding: "4px",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px", padding: "10px 12px",
                fontSize: "12px", color: "var(--danger)",
              }}>{error}</div>
            )}

            <button
              onClick={handleSubmit} disabled={loading}
              className={loading ? "" : "btn-glow"}
              style={{
                width: "100%", padding: "13px", borderRadius: "10px",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700, fontSize: "14px", color: "white", marginTop: "4px",
                background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, var(--accent), var(--accent-2))",
                fontFamily: "var(--font-display)", opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            Create one
          </a>
        </p>
      </div>
    </main>
  );
}