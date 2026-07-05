"use client";

import { useState, useEffect, useMemo } from "react";

function ScorePill({ before, after }) {
  if (after == null) return null;
  const color = after <= 40 ? "var(--danger)" : after <= 70 ? "var(--warning)" : "var(--success)";
  const bgColor = after <= 40 ? "rgba(239,68,68,0.1)" : after <= 70 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "4px",
      fontFamily: "var(--font-mono)", fontSize: "11px",
    }}>
      {before != null && (
        <>
          <span style={{ color: "var(--text-muted)" }}>{before}%</span>
          <span style={{ color: "var(--text-muted)" }}>→</span>
        </>
      )}
      <span style={{
        color, fontWeight: 700, background: bgColor,
        padding: "2px 7px", borderRadius: "20px",
        border: `1px solid ${color}22`,
      }}>{after}%</span>
    </div>
  );
}

function ModeBadge({ mode }) {
  const isInternship = mode === "internship";
  return (
    <span style={{
      fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px",
      fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px",
      color: isInternship ? "#a78bfa" : "var(--accent)",
      background: isInternship ? "rgba(139,92,246,0.1)" : "var(--accent-glow)",
      border: `1px solid ${isInternship ? "rgba(139,92,246,0.3)" : "rgba(59,130,246,0.3)"}`,
    }}>
      {isInternship ? "Internship" : "Professional"}
    </span>
  );
}

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function DetailsModal({ resume, onClose }) {
  return (
    
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
      animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg-card)", border: "1px solid var(--border-bright)",
        borderRadius: "20px", width: "100%", maxWidth: "440px",
        padding: "28px", boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        animation: "slideUp 0.25s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "4px" }}>
              {resume.companyName || "Untitled application"}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{resume.roleTitle || "Role not specified"}</p>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
            borderRadius: "8px", cursor: "pointer", color: "var(--text-secondary)",
            fontSize: "14px", padding: "6px 10px", transition: "all 0.2s",
          }}>✕</button>
        </div>
        {resume.atsScoreBefore != null && resume.atsScoreAfter != null && (
          <div style={{
            display: "flex", gap: "8px", marginBottom: "20px",
          }}>
            <div style={{
              flex: 1, background: "var(--bg)", borderRadius: "10px",
              padding: "12px", textAlign: "center", border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Before</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--danger)", fontFamily: "var(--font-display)" }}>{resume.atsScoreBefore}%</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)" }}>→</div>
            <div style={{
              flex: 1, background: "var(--bg)", borderRadius: "10px",
              padding: "12px", textAlign: "center", border: "1px solid var(--success)",
              boxShadow: "0 0 20px rgba(16,185,129,0.08)",
            }}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>After</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--success)", fontFamily: "var(--font-display)" }}>{resume.atsScoreAfter}%</div>
            </div>
          </div>
        )}
        <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
          What changed
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.7 }}>
          {resume.changesSummary || "No summary available."}
        </p>
      </div>
    </div>
  );
}

function ResumeCard({ resume, onShowDetails, index }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div style={{
      animation: `fadeInUp 0.5s ease forwards`,
      animationDelay: `${index * 0.07}s`,
      opacity: 0,
    }}>
      <a 
        href={resume.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block", padding: "20px", textDecoration: "none",
          color: "inherit", cursor: "pointer", position: "relative",
          background: "var(--bg-card)",
          border: `1px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "16px",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "all 0.25s ease",
          boxShadow: hovered ? "0 12px 40px rgba(59,130,246,0.12)" : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <ModeBadge mode={resume.mode} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {timeAgo(resume.createdAt)}
            </span>
            {resume.changesSummary && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onShowDetails(resume); }}
                style={{
                  background: hovered ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${hovered ? "rgba(59,130,246,0.4)" : "var(--border)"}`,
                  borderRadius: "50%", width: "22px", height: "22px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: hovered ? "var(--accent)" : "var(--text-secondary)",
                  fontSize: "11px", fontWeight: 700, padding: 0, flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >i</button>
            )}
          </div>
        </div>

        <h3 style={{
          fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-display)",
          color: "var(--text-primary)", marginBottom: "3px",
        }}>
          {resume.companyName || "Untitled application"}
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
          {resume.roleTitle || "Role not specified"}
        </p>

        {resume.changesSummary && (
          <p style={{
            fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5,
            marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {resume.changesSummary}
          </p>
        )}

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: "12px", borderTop: "1px solid var(--border)",
        }}>
          <ScorePill before={resume.atsScoreBefore} after={resume.atsScoreAfter} />
          <span style={{
            fontSize: "11px", fontWeight: 600, fontFamily: "var(--font-mono)",
            color: hovered ? "var(--accent)" : "var(--text-muted)",
            transition: "color 0.2s",
          }}>
            {resume.format?.toUpperCase()} ↓
          </span>
        </div>
      </a>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "16px 24px", background: "var(--bg-card)",
      border: "1px solid var(--border)", borderRadius: "12px", minWidth: "100px",
    }}>
      <span style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-display)", color: color || "var(--text-primary)" }}>
        {value}
      </span>
      <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>
        {label}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: "center", padding: "80px 20px",
      border: "1px dashed var(--border-bright)", borderRadius: "20px",
      animation: "fadeInUp 0.5s ease forwards",
    }}>
      <div style={{ fontSize: "40px", marginBottom: "16px" }}>📄</div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-display)" }}>
        No tailored resumes yet
      </h3>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "300px", margin: "0 auto 24px", lineHeight: 1.6 }}>
        Tailor your first resume and it'll show up here automatically — no extra steps.
      </p>
      <a href="/" className="btn-glow" style={{
        display: "inline-block", padding: "11px 24px", borderRadius: "10px",
        fontSize: "13px", fontWeight: 700, textDecoration: "none",
      }}>
        Tailor a resume →
      </a>
    </div>
  );
}

export default function DashboardClient({ userName }) {
  const [resumes, setResumes] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [detailsResume, setDetailsResume] = useState(null);

  useEffect(() => {
    fetch("/api/resumes")
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setResumes(data.resumes);
      })
      .catch(() => setError("Failed to load your resume history."));
  }, []);

  const filtered = useMemo(() => {
    if (!resumes) return [];
    if (!search.trim()) return resumes;
    const q = search.toLowerCase();
    return resumes.filter(r =>
      r.companyName?.toLowerCase().includes(q) ||
      r.roleTitle?.toLowerCase().includes(q)
    );
  }, [resumes, search]);

  const avgScore = resumes?.length
    ? Math.round(resumes.filter(r => r.atsScoreAfter).reduce((acc, r) => acc + r.atsScoreAfter, 0) / resumes.filter(r => r.atsScoreAfter).length)
    : null;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .search-input:focus { border-color: var(--accent) !important; }
        .nav-link { transition: color 0.2s ease; }
        .nav-link:hover { color: var(--text-primary) !important; }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 20px 80px", minHeight: "calc(100vh - 56px)", backgroundColor: "var(--bg)", background: "var(--bg)", color: "var(--text-primary)" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px", animation: "fadeInUp 0.4s ease forwards" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>
                Resume History
              </p>
              <h1 style={{ fontSize: "28px", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "6px" }}>
                {userName ? `${userName.split(" ")[0]}'s resumes` : "Your resumes"}
              </h1>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Every tailored resume, saved automatically.
              </p>
            </div>

            {resumes && resumes.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <StatBadge label="Tailored" value={resumes.length} color="var(--accent)" />
                {avgScore != null && <StatBadge label="Avg Score" value={`${avgScore}%`} color="var(--success)" />}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {resumes && resumes.length > 0 && (
          <div style={{ position: "relative", marginBottom: "24px", animation: "fadeInUp 0.4s ease 0.1s forwards", opacity: 0 }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)", fontSize: "14px", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search by company or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
              style={{
                width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "12px 16px 12px 38px", fontSize: "13px",
                color: "var(--text-primary)", outline: "none",
                fontFamily: "var(--font-body)", transition: "border-color 0.2s",
              }}
            />
          </div>
        )}

        {/* States */}
        {error && <p style={{ color: "var(--danger)", fontSize: "13px" }}>{error}</p>}

        {resumes === null && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: "180px", borderRadius: "16px", background: "var(--bg-card)",
                border: "1px solid var(--border)", animation: "fadeInUp 0.4s ease forwards",
                animationDelay: `${i * 0.1}s`, opacity: 0,
              }} />
            ))}
          </div>
        )}

        {resumes?.length === 0 && <EmptyState />}

        {resumes?.length > 0 && filtered.length === 0 && (
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", textAlign: "center", padding: "60px 0" }}>
            No resumes match "{search}"
          </p>
        )}

        {filtered.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {filtered.map((resume, i) => (
              <ResumeCard key={resume.id} resume={resume} onShowDetails={setDetailsResume} index={i} />
            ))}
          </div>
        )}
      </div>

      {detailsResume && (
        <DetailsModal resume={detailsResume} onClose={() => setDetailsResume(null)} />
      )}
    </>
  );
}