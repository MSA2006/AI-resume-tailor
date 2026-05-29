import UploadForm from "@/components/UploadForm";

const steps = [
  {
    num: "01",
    title: "Upload Resume",
    desc: "PDF or DOCX — we read it all",
    icon: "📄",
  },
  {
    num: "02",
    title: "Paste Job Description",
    desc: "The role you're gunning for",
    icon: "🎯",
  },
  {
    num: "03",
    title: "AI Does the Work",
    desc: "Keywords matched, ATS optimized",
    icon: "⚡",
  },
  {
    num: "04",
    title: "Download & Apply",
    desc: "PDF or Word, ready to send",
    icon: "🚀",
  },
];

const stats = [
  { value: "3x", label: "More interview callbacks" },
  { value: "ATS", label: "Optimized for every system" },
  { value: "30s", label: "Average tailoring time" },
];

export default function Home() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(8, 11, 18, 0.85)",
        backdropFilter: "blur(12px)",
        padding: "0 24px",
        height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>⚡</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>
            ResumeForge
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="tag">Free forever</span>
          <a href="#tailor" style={{
            padding: "7px 18px", borderRadius: "8px", fontSize: "13px",
            fontWeight: 600, color: "white", textDecoration: "none",
          }} className="btn-glow">
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        paddingTop: "60px", overflow: "hidden",
      }}>
        <div className="hero-bg">
          <div className="hero-bg-3" />
        </div>
        <div className="grid-overlay" />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: "800px" }}>

          {/* Badge */}
          <div className="fade-in-up delay-1" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "20px", marginBottom: "32px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            background: "rgba(59, 130, 246, 0.08)",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block", boxShadow: "0 0 8px var(--success)" }} />
            <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
              AI-Powered Resume Optimization
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-in-up delay-2" style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: "-2px", marginBottom: "24px",
            color: "var(--text-primary)",
          }}>
            Your Resume,{" "}
            <span className="shimmer">Rewritten</span>
            <br />to Beat the ATS
          </h1>

          {/* Subtext */}
          <p className="fade-in-up delay-3" style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: "560px", margin: "0 auto 40px",
            lineHeight: 1.6, fontWeight: 300,
          }}>
            Paste a job description. Our AI rewrites your resume with the exact keywords recruiters and ATS systems are scanning for.
          </p>

          {/* CTA Buttons */}
          <div className="fade-in-up delay-4" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
            <a href="#tailor" style={{
              padding: "14px 32px", borderRadius: "12px",
              fontSize: "15px", fontWeight: 700,
              color: "white", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }} className="btn-glow">
              Tailor My Resume
              <span style={{ fontSize: "18px" }}>→</span>
            </a>
            <a href="#how" style={{
              padding: "14px 32px", borderRadius: "12px",
              fontSize: "15px", fontWeight: 500,
              color: "var(--text-secondary)", textDecoration: "none",
              border: "1px solid var(--border-bright)",
              transition: "all 0.3s ease",
            }} className="hover-link">
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="fade-in-up delay-5" style={{
            display: "flex", gap: "0", justifyContent: "center",
            border: "1px solid var(--border)", borderRadius: "16px",
            background: "var(--bg-card)", overflow: "hidden",
            maxWidth: "480px", margin: "0 auto",
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                flex: 1, padding: "20px 16px", textAlign: "center",
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          color: "var(--text-muted)", fontSize: "11px",
          animation: "float2 2s ease-in-out infinite",
        }}>
          <span style={{ fontFamily: "var(--font-mono)" }}>scroll</span>
          <span>↓</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{
        padding: "100px 24px",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "12px",
            color: "var(--accent)", letterSpacing: "2px",
            textTransform: "uppercase", display: "block", marginBottom: "12px",
          }}>The Process</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
            Four steps to your
            <span className="shimmer"> dream job</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}>
          {steps.map((step, i) => (
            <div key={step.num} className="card fade-in-up" style={{
              padding: "28px 24px",
              animationDelay: `${i * 0.1}s`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                fontFamily: "var(--font-mono)", fontSize: "11px",
                color: "var(--text-muted)",
              }}>{step.num}</div>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{step.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-display)" }}>{step.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.desc}</p>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", right: "-8px", top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)", fontSize: "16px",
                  display: "none",
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FORM SECTION */}
      <section id="tailor" style={{ padding: "40px 0 100px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px", padding: "0 24px" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "12px",
            color: "var(--accent)", letterSpacing: "2px",
            textTransform: "uppercase", display: "block", marginBottom: "12px",
          }}>Let's Go</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
            Tailor your resume
            <span className="shimmer"> right now</span>
          </h2>
        </div>
        <UploadForm />
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "24px", height: "24px", borderRadius: "6px",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px",
          }}>⚡</div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px" }}>ResumeForge</span>
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          built with 🤖 + ☕ — free forever
        </span>
      </footer>

    </main>
  );
}