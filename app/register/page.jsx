"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    sessionStorage.setItem("magna_pending_password", password);
router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 600,
    color: "var(--text-secondary)", marginBottom: "6px",
    textTransform: "uppercase", letterSpacing: "0.8px",
    fontFamily: "var(--font-mono)",
  };

  const inputStyle = {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: "10px", padding: "11px 14px", fontSize: "13px",
    color: "var(--text-primary)", outline: "none",
    fontFamily: "var(--font-body)", transition: "border-color 0.2s",
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
            Create your account
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Start tailoring resumes that actually get callbacks
          </p>
        </div>

        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text" placeholder="Your name"
                value={name} onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
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
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}