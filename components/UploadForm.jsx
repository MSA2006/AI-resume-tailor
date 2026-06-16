"use client";

import { useState, useEffect, useRef } from "react";

function InternshipInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: "1px solid rgba(139, 92, 246, 0.3)",
      borderRadius: "12px", overflow: "hidden",
      background: "rgba(139, 92, 246, 0.05)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "12px 16px",
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🎓</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#a78bfa" }}>What is Internship Mode?</span>
        </div>
        <span style={{
          color: "#a78bfa", fontSize: "11px",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: 1.6 }}>
            Built for students and fresh grads with little to no work experience.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              ["📚", "Highlights coursework & projects"],
              ["🏆", "Focuses on skills over experience"],
              ["🎯", "Matches intern job descriptions"],
              ["⚡", "ATS optimized for entry level"],
            ].map(([icon, text]) => (
              <div key={text} style={{
                background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px",
                padding: "8px 10px", display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span style={{ fontSize: "12px" }}>{icon}</span>
                <span style={{ fontSize: "11px", color: "#c4b5fd" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GapPanel({ gapData, onConfirm, onSkip, mode }) {
  const [answers, setAnswers] = useState({});
  const toggle = (skill) => setAnswers(prev => ({ ...prev, [skill]: !prev[skill] }));
  const confirmedSkills = Object.entries(answers).filter(([, v]) => v).map(([k]) => k);

  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "16px", padding: "24px",
      display: "flex", flexDirection: "column", height: "100%",
      boxShadow: "0 0 40px rgba(239, 68, 68, 0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span style={{ fontSize: "20px" }}>⚠️</span>
        <h2 style={{ color: "var(--danger)", fontWeight: 700, fontSize: "18px", fontFamily: "var(--font-display)" }}>
          Skills Gap Detected
        </h2>
      </div>
      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.6 }}>
        {gapData.gapSummary}
      </p>
      <div style={{ height: "1px", background: "rgba(239, 68, 68, 0.2)", marginBottom: "16px" }} />
      <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>
        Do you have experience with these critical skills?
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflowY: "auto" }}>
        {gapData.missingSkills.map(item => (
          <div key={item.skill} onClick={() => toggle(item.skill)} style={{
            borderRadius: "12px", padding: "12px",
            border: `1px solid ${answers[item.skill] ? "var(--success)" : "rgba(239, 68, 68, 0.3)"}`,
            background: answers[item.skill] ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.05)",
            cursor: "pointer", transition: "all 0.2s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>{item.skill}</span>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%",
                border: `2px solid ${answers[item.skill] ? "var(--success)" : "var(--danger)"}`,
                background: answers[item.skill] ? "var(--success)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", color: "white", fontWeight: 700,
              }}>
                {answers[item.skill] ? "✓" : ""}
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.reason}</p>
            <p style={{ fontSize: "11px", marginTop: "4px", fontWeight: 500, color: answers[item.skill] ? "var(--success)" : "var(--danger)" }}>
              {answers[item.skill] ? "✓ Will be added to your resume" : "⚠ May not pass ATS without this"}
            </p>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", marginTop: "16px", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button onClick={() => {
          if (confirmedSkills.length === 0) {
            alert("Please select at least one skill, or click Skip.");
            return;
          }
          onConfirm(confirmedSkills);
        }} style={{
          width: "100%", padding: "12px", borderRadius: "10px",
          border: "none", cursor: "pointer", fontWeight: 700,
          fontSize: "13px", color: "white",
          background: mode === "internship"
            ? "linear-gradient(135deg, #7c3aed, #8b5cf6)"
            : "linear-gradient(135deg, var(--accent), var(--accent-2))",
        }} className="btn-glow">
          Continue & Tailor Resume →
        </button>
        <button onClick={onSkip} style={{
          width: "100%", padding: "10px", borderRadius: "10px",
          border: "1px solid var(--border)", background: "transparent",
          cursor: "pointer", fontSize: "12px", color: "var(--text-secondary)",
          transition: "all 0.2s ease",
        }}>
          Skip — tailor without adding missing skills
        </button>
      </div>
    </div>
  );
}

function Speedometer({ score }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const interval = setInterval(() => {
      start += step;
      if (start >= score) { start = score; clearInterval(interval); }
      setAnimated(Math.round(start));
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const radius = 80;
  const cx = 110;
  const cy = 100;
  const toRad = deg => (deg * Math.PI) / 180;
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const needleAngle = 180 - (animated / 100) * 180;
  const needleX = cx + (radius - 15) * Math.cos(toRad(needleAngle));
  const needleY = cy - (radius - 15) * Math.sin(toRad(needleAngle));
  const color = animated <= 40 ? "#ef4444" : animated <= 70 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="220" height="115" viewBox="0 0 220 115">
        <path d={arcPath} fill="none" stroke="#1e2a3a" strokeWidth="14" strokeLinecap="round" />
        <path d={arcPath} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(animated / 100) * Math.PI * radius} ${Math.PI * radius}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="12" y="114" fill="#ef4444" fontSize="9" fontFamily="monospace">Poor</text>
        <text x="110" y="16" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">OK</text>
        <text x="208" y="114" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="end">Strong</text>
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="white" style={{ filter: "drop-shadow(0 0 4px white)" }} />
      </svg>
      <div style={{ fontSize: "40px", fontWeight: 800, fontFamily: "var(--font-display)", color, marginTop: "4px", letterSpacing: "-2px" }}>
        {animated}%
      </div>
    </div>
  );
}

function ScoreModal({ scoreData, onDownload, onBack, mode }) {
  const verdictColor = {
    "Poor Match": "var(--danger)",
    "Decent Match": "var(--warning)",
    "Good Match": "var(--accent)",
    "Strong Match": "var(--success)",
  }[scoreData.verdict] || "var(--text-secondary)";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-bright)",
        borderRadius: "20px", width: "100%", maxWidth: "420px",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", padding: "20px 24px 12px",
          borderBottom: "1px solid var(--border)",
        }}>
          <button onClick={onBack} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-secondary)", fontSize: "18px", marginRight: "12px",
            padding: "4px 8px", borderRadius: "6px",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}
          >←</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ fontWeight: 700, fontSize: "18px", fontFamily: "var(--font-display)" }}>ATS Score</h2>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>How well your resume matches the job</p>
          </div>
          <div style={{ width: "40px" }} />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px 24px" }}>
          <Speedometer score={scoreData.tailoredScore} />

          <p style={{ textAlign: "center", fontWeight: 700, fontSize: "18px", marginTop: "8px", marginBottom: "24px", color: verdictColor, fontFamily: "var(--font-display)" }}>
            {scoreData.verdict}
          </p>

          {/* Before vs After */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center" }}>
            <div style={{ flex: 1, background: "var(--bg)", borderRadius: "12px", padding: "14px", textAlign: "center", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Before</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--danger)", fontFamily: "var(--font-display)" }}>{scoreData.originalScore}%</div>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "18px" }}>→</div>
            <div style={{ flex: 1, background: "var(--bg)", borderRadius: "12px", padding: "14px", textAlign: "center", border: "1px solid var(--success)", boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>After</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--success)", fontFamily: "var(--font-display)" }}>{scoreData.tailoredScore}%</div>
            </div>
          </div>

          {/* Keywords */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>✅ Matched Keywords</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {scoreData.matchedKeywords.map(k => (
                <span key={k} style={{
                  background: "rgba(16, 185, 129, 0.1)", color: "#6ee7b7",
                  fontSize: "11px", padding: "4px 10px", borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  fontFamily: "var(--font-mono)",
                }}>{k}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>⚠️ Still Missing</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {scoreData.missingKeywords.map(k => (
                <span key={k} style={{
                  background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5",
                  fontSize: "11px", padding: "4px 10px", borderRadius: "20px",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  fontFamily: "var(--font-mono)",
                }}>{k}</span>
              ))}
            </div>
          </div>

          <button onClick={onDownload} style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            border: "none", cursor: "pointer", fontWeight: 700,
            fontSize: "14px", color: "white",
            background: mode === "internship"
              ? "linear-gradient(135deg, #7c3aed, #8b5cf6)"
              : "linear-gradient(135deg, var(--accent), var(--accent-2))",
          }} className="btn-glow">
            Download Resume →
          </button>
        </div>
      </div>
    </div>
  );
}

// Label component
function Label({ children }) {
  return (
    <label style={{
      display: "block", fontSize: "12px", fontWeight: 600,
      color: "var(--text-secondary)", marginBottom: "8px",
      textTransform: "uppercase", letterSpacing: "0.8px",
      fontFamily: "var(--font-mono)",
    }}>{children}</label>
  );
}

export default function UploadForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [format, setFormat] = useState("pdf");
  const [mode, setMode] = useState("professional");
  const [visible, setVisible] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showGap, setShowGap] = useState(false);
  const [gapData, setGapData] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [scoreData, setScoreData] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [pendingBlob, setPendingBlob] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const extractTextFromFile = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch("/api/extract", { method: "POST", body: formData });
    const data = await res.json();
    return data.text;
  };

  const doTailor = async (confirmedSkills = []) => {
    setLoading(true);
    setLoadingMsg("Tailoring your resume — this may take up to 1-2 minutes, sit tight...");
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("format", format);
      formData.append("mode", mode);
      formData.append("confirmedSkills", JSON.stringify(confirmedSkills));

      const response = await fetch("/api/tailor", { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        alert(`Error: ${err.error}`);
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      setPendingBlob(blob);
      setShowGap(false);

      setLoadingMsg("Calculating ATS score...");
      const scoreFormData = new FormData();
      scoreFormData.append("resumeText", extractedText);
      scoreFormData.append("tailoredText", extractedText);
      scoreFormData.append("jobDescription", jobDescription);

      const scoreRes = await fetch("/api/score", { method: "POST", body: scoreFormData });
      if (scoreRes.ok) {
        const score = await scoreRes.json();
        setScoreData(score);
        setShowScore(true);
      } else {
        triggerDownload(blob);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
    setLoadingMsg("");
  };

  const triggerDownload = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "docx" ? "tailored-resume.docx" : "tailored-resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume and enter a job description!");
      return;
    }
    setScoreData(null);
    setShowScore(false);
    setPendingBlob(null);
    setGapData(null);
    setShowGap(false);
    setExtractedText("");

    setLoading(true);
    setLoadingMsg("Analysing your resume — won't take long...");
    try {
      // Run extract and analyze in parallel
      setLoadingMsg("Analysing your resume and checking skills gap...");
      const extractFormData = new FormData();
      extractFormData.append("resume", resumeFile);

      const analyzeFormData = new FormData();
      analyzeFormData.append("jobDescription", jobDescription);

      // Extract text first then immediately analyze
      const text = await extractTextFromFile(resumeFile);
      setExtractedText(text);

      analyzeFormData.append("resumeText", text);
      const analyzeRes = await fetch("/api/analyze", { method: "POST", body: analyzeFormData });
      const gap = await analyzeRes.json();

      setLoading(false);
      setLoadingMsg("");

      if (gap.hasMajorGap && gap.missingSkills.length > 0) {
        setGapData(gap);
        setShowGap(true);
        setTimeout(() => {
          document.getElementById("gap-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        await doTailor([]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".pdf") || file.name.endsWith(".docx"))) {
      setResumeFile(file);
    }
  };

  const isInternship = mode === "internship";
  const accentColor = isInternship ? "#8b5cf6" : "var(--accent)";
  const gradientBtn = isInternship
    ? "linear-gradient(135deg, #7c3aed, #8b5cf6)"
    : "linear-gradient(135deg, var(--accent), var(--accent-2))";

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{
        display: "flex", flexDirection: "column", gap: "20px",
        maxWidth: "900px", margin: "0 auto",
      }}
        className={showGap ? "md-row" : ""}
      >

        {/* MAIN FORM */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "32px",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s ease",
          flex: showGap ? "1" : "unset",
          width: showGap ? "100%" : "100%",
          maxWidth: showGap ? "unset" : "600px",
          margin: showGap ? "0" : "0 auto",
        }}>

          {/* Mode Toggle */}
          <div style={{ marginBottom: "24px" }}>
            <Label>Mode</Label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {["professional", "internship"].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: `1px solid ${mode === m ? accentColor : "var(--border)"}`,
                  background: mode === m
                    ? m === "internship" ? "rgba(139, 92, 246, 0.15)" : "rgba(59, 130, 246, 0.15)"
                    : "transparent",
                  cursor: "pointer", fontWeight: 600, fontSize: "13px",
                  color: mode === m ? (m === "internship" ? "#a78bfa" : "var(--accent)") : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-body)",
                }}>
                  {m === "professional" ? "💼 Professional" : "🎓 Internship"}
                </button>
              ))}
            </div>
            {isInternship && <InternshipInfo />}
          </div>

          {/* Drag Drop Upload */}
          <div style={{ marginBottom: "20px" }}>
            <Label>Upload Resume</Label>
            <div
              className={`drop-zone ${dragOver ? "drag-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "28px 20px", textAlign: "center",
                borderColor: resumeFile ? "var(--success)" : dragOver ? "var(--accent)" : "var(--border-bright)",
                background: resumeFile ? "rgba(16, 185, 129, 0.05)" : dragOver ? "var(--accent-glow)" : "transparent",
              }}
            >
              <input
                ref={fileInputRef}
                type="file" accept=".pdf,.docx"
                onChange={e => setResumeFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              {resumeFile ? (
                <div>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--success)" }}>{resumeFile.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Click to change</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
                    Drop your resume here
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>PDF or DOCX — click to browse</div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: "20px" }}>
            <Label>{isInternship ? "Internship Description" : "Job Description"}</Label>
            <textarea
              rows={6}
              placeholder={isInternship ? "Paste the internship description here..." : "Paste the job description here..."}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              style={{
                width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "14px 16px", resize: "vertical",
                fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6,
                outline: "none", transition: "border-color 0.2s ease",
                fontFamily: "var(--font-body)",
              }}
              onFocus={e => e.target.style.borderColor = accentColor}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* Format Toggle */}
          <div style={{ marginBottom: "24px" }}>
            <Label>Download Format</Label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["pdf", "docx"].map(f => (
                <button key={f} onClick={() => setFormat(f)} style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: `1px solid ${format === f ? "var(--accent)" : "var(--border)"}`,
                  background: format === f ? "rgba(59, 130, 246, 0.15)" : "transparent",
                  cursor: "pointer", fontWeight: 600, fontSize: "13px",
                  color: format === f ? "var(--accent)" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-body)",
                }}>
                  {f === "pdf" ? "📄 PDF" : "📝 Word (DOCX)"}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "15px", borderRadius: "12px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: "15px", color: "white",
              background: loading ? "rgba(59, 130, 246, 0.4)" : gradientBtn,
              fontFamily: "var(--font-display)", letterSpacing: "0.3px",
              transition: "all 0.3s ease",
              opacity: loading ? 0.8 : 1,
            }}
            className={loading ? "" : "btn-glow"}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <svg style={{ animation: "spin 1s linear infinite", width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" />
                </svg>
                {loadingMsg || "Processing..."}
              </span>
            ) : isInternship ? "🎓 Tailor for Internship →" : "⚡ Tailor My Resume →"}
          </button>

        </div>

        {/* GAP PANEL */}
        {showGap && gapData && (
          <div id="gap-panel" style={{ width: "100%" }}>
            <GapPanel gapData={gapData} mode={mode} onConfirm={doTailor} onSkip={() => doTailor([])} />
          </div>
        )}

      </div>

      {/* SCORE MODAL */}
      {showScore && scoreData && (
        <ScoreModal
          scoreData={scoreData}
          mode={mode}
          onDownload={() => { triggerDownload(pendingBlob); setShowScore(false); }}
          onBack={() => setShowScore(false)}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .md-row {
            flex-direction: row !important;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}