"use client";

import { useState, useEffect } from "react";

function InternshipInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-purple-950 border border-purple-700 rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-900 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <span>🎓</span>
          <span className="text-purple-300 font-semibold text-sm">What is Internship Mode?</span>
        </div>
        <span className={`text-purple-400 text-xs transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>▼</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-purple-200 text-xs leading-relaxed mb-3">
            Built for students and fresh grads with little to no work experience.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["📚", "Highlights coursework & projects"],
              ["🏆", "Focuses on skills over experience"],
              ["🎯", "Matches intern job descriptions"],
              ["⚡", "ATS optimized for entry level"],
            ].map(([icon, text]) => (
              <div key={text} className="bg-purple-900 rounded-lg px-3 py-2 flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-purple-200 text-xs">{text}</span>
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

  const toggle = (skill) => {
    setAnswers((prev) => ({ ...prev, [skill]: !prev[skill] }));
  };

  const confirmedSkills = Object.entries(answers)
    .filter(([, val]) => val)
    .map(([skill]) => skill);

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400 text-xl">⚠️</span>
        <h2 className="text-red-400 font-bold text-lg">Skills Gap Detected</h2>
      </div>
      <p className="text-gray-400 text-xs mb-4 leading-relaxed">
        {gapData.gapSummary}
      </p>

      <div className="border-t border-red-900 mb-4" />

      <p className="text-gray-300 text-sm font-medium mb-3">
        Do you have experience with these critical skills?
      </p>

      {/* Skills */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {gapData.missingSkills.map((item) => (
          <div
            key={item.skill}
            className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
              answers[item.skill]
                ? "border-green-500 bg-green-950"
                : "border-red-800 bg-red-950 hover:border-red-600"
            }`}
            onClick={() => toggle(item.skill)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-semibold text-sm">{item.skill}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                answers[item.skill]
                  ? "border-green-400 bg-green-500 text-white"
                  : "border-red-500 text-transparent"
              }`}>
                ✓
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{item.reason}</p>
            {!answers[item.skill] && (
              <p className="text-red-400 text-xs mt-1 font-medium">
                ⚠ May not pass ATS without this
              </p>
            )}
            {answers[item.skill] && (
              <p className="text-green-400 text-xs mt-1 font-medium">
                ✓ Will be added to your resume
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 mt-4 pt-4 flex flex-col gap-2">
        <button
          onClick={() => {
            if (confirmedSkills.length === 0) {
              alert("Please select at least one skill, or click 'Skip' to tailor without changes.");
              return;
            }
            onConfirm(confirmedSkills);
          }}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 ${
            mode === "internship"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Continue & Tailor Resume →
        </button>
        <button
          onClick={onSkip}
          className={`w-full py-2 rounded-lg lg font-semibold text-sm text-white transition-all duration-200 ${
            mode === "internship"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
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
      if (start >= score) {
        start = score;
        clearInterval(interval);
      }
      setAnimated(Math.round(start));
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const radius = 80;
  const cx = 100;
  const cy = 100;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const needleAngle = 180 - (animated / 100) * 180;
  const needleX = cx + (radius - 15) * Math.cos(toRad(needleAngle));
  const needleY = cy - (radius - 15) * Math.sin(toRad(needleAngle));

  const getColor = (s) => {
    if (s <= 40) return "#ef4444";
    if (s <= 70) return "#f59e0b";
    return "#22c55e";
  };

  const color = getColor(animated);

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="120" viewBox="0 0 220 120">
        {/* Background arc */}
        <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none" stroke="#374151" strokeWidth="16" strokeLinecap="round"
          transform="translate(10, 0)"
        />
        {/* Score arc */}
        <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none" stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${(animated / 100) * Math.PI * radius} ${Math.PI * radius}`}
          transform="translate(10, 0)"
        />
        {/* Poor label - bottom left */}
        <text x="8" y="118" fill="#ef4444" fontSize="9" fontFamily="sans-serif">Poor</text>
        {/* OK label - top middle */}
        <text x="105" y="16" fill="#f59e0b" fontSize="9" fontFamily="sans-serif" textAnchor="middle">OK</text>
        {/* Strong label - bottom right */}
        <text x="212" y="118" fill="#22c55e" fontSize="9" fontFamily="sans-serif" textAnchor="end">Strong</text>
        {/* Needle */}
        <line x1={cx + 10} y1={cy} x2={needleX + 10} y2={needleY}
          stroke="white" strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx={cx + 10} cy={cy} r="5" fill="white" />
      </svg>
      <div className="text-4xl font-bold mt-1" style={{ color }}>{animated}%</div>
    </div>
  );
}

function ScoreModal({ scoreData, onDownload, onBack, mode }) {
  const verdictColor = {
    "Poor Match": "text-red-400",
    "Decent Match": "text-yellow-400",
    "Good Match": "text-blue-400",
    "Strong Match": "text-green-400",
  }[scoreData.verdict] || "text-gray-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">

        {/* Fixed header with back arrow */}
        <div className="flex items-center px-6 pt-6 pb-2 shrink-0">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors mr-3 text-lg"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-white font-bold text-xl">ATS Score</h2>
            <p className="text-gray-400 text-xs">How well your tailored resume matches the job</p>
          </div>
          <div className="w-6" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          <Speedometer score={scoreData.tailoredScore} />

          <p className={`text-center font-semibold text-lg mt-2 mb-6 ${verdictColor}`}>
            {scoreData.verdict}
          </p>

          {/* Before vs After */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Before Tailoring</p>
              <p className="text-red-400 font-bold text-2xl">{scoreData.originalScore}%</p>
            </div>
            <div className="flex items-center text-gray-500 text-lg">→</div>
            <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">After Tailoring</p>
              <p className="text-green-400 font-bold text-2xl">{scoreData.tailoredScore}%</p>
            </div>
          </div>

          {/* Matched keywords */}
          <div className="mb-3">
            <p className="text-gray-400 text-xs font-medium mb-2">✅ Matched Keywords</p>
            <div className="flex flex-wrap gap-2">
              {scoreData.matchedKeywords.map((k) => (
                <span key={k} className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-lg">{k}</span>
              ))}
            </div>
          </div>

          {/* Missing keywords */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs font-medium mb-2">⚠️ Still Missing</p>
            <div className="flex flex-wrap gap-2">
              {scoreData.missingKeywords.map((k) => (
                <span key={k} className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded-lg">{k}</span>
              ))}
            </div>
          </div>

          {/* Download button only */}
          <button
            onClick={onDownload}
            className={`w-full py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02] ${
              mode === "internship" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Download Resume →
          </button>

        </div>
      </div>
    </div>
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

  // Gap analysis state
  const [showGap, setShowGap] = useState(false);
  const [gapData, setGapData] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const extractTextFromFile = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", "placeholder");
    formData.append("format", "pdf");
    formData.append("mode", mode);
    formData.append("extractOnly", "true");

    const res = await fetch("/api/extract", { method: "POST", body: formData });
    const data = await res.json();
    return data.text;
  };

  const [scoreData, setScoreData] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [pendingBlob, setPendingBlob] = useState(null);

  const doTailor = async (confirmedSkills = []) => {
    setLoading(true);
    setLoadingMsg("Tailoring your resume — this may take 30–40 seconds, sit tight...");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("format", format);
      formData.append("mode", mode);
      formData.append("confirmedSkills", JSON.stringify(confirmedSkills));

      const response = await fetch("/api/tailor", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      setPendingBlob(blob);
      setShowGap(false);

      // Calculate ATS score
      
      setLoadingMsg("Calculating ATS score...");

      const scoreFormData = new FormData();
      scoreFormData.append("resumeText", extractedText);
      scoreFormData.append("tailoredText", jobDescription); // compare JD against original to get real gap score
      scoreFormData.append("jobDescription", jobDescription);

      const scoreRes = await fetch("/api/score", {
        method: "POST",
        body: scoreFormData,
      });

      if (scoreRes.ok) {
        const score = await scoreRes.json();
        setScoreData(score);
        setShowScore(true);
      } else {
        // If scoring fails just download directly
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

//   Reset all previous state
    setScoreData(null);
    setShowScore(false);
    setPendingBlob(null);
    setGapData(null);
    setShowGap(false);
    setExtractedText("");

    setLoading(true);
    setLoadingMsg("Analysing your resume — won't take long...");

    try {
      // Step 1 — extract text
      const text = await extractTextFromFile(resumeFile);
      setExtractedText(text);

      // Step 2 — gap analysis
      setLoadingMsg("Checking skills gap(Hold tight)...");
      const analyzeFormData = new FormData();
      analyzeFormData.append("resumeText", text);
      analyzeFormData.append("jobDescription", jobDescription);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: analyzeFormData,
      });
      const gap = await analyzeRes.json();

      setLoading(false);
      setLoadingMsg("");

      // Step 3 — if major gap show panel, else tailor directly
      if (gap.hasMajorGap && gap.missingSkills.length > 0) {
        setGapData(gap);
        setShowGap(true);
        // Auto scroll to gap panel on mobile
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

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className={`flex flex-col md:flex-row gap-6 w-full max-w-4xl transition-all duration-500`}>

        {/* Main Form */}
        <div className={`bg-gray-900 rounded-2xl shadow-xl p-8 transition-all duration-500 ease-in-out ${
          showGap ? "md:w-1/2 w-full" : "w-full max-w-xl mx-auto"
        } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

          <div className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h1 className="text-3xl font-bold text-white mb-2">AI Resume Tailor</h1>
            <p className="text-gray-400 mb-6">Upload your resume and paste the job description. We'll tailor it for you.</p>
          </div>

          {/* Mode Toggle */}
          <div className={`mb-6 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mode</label>
            <div className="flex gap-3 mb-3">
              {["professional", "internship"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    mode === m
                      ? m === "internship" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {m === "professional" ? "💼 Professional" : "🎓 Internship"}
                </button>
              ))}
            </div>
            {mode === "internship" && <InternshipInfo />}
          </div>

          {/* Resume Upload */}
          <div className={`mb-6 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume (PDF or DOCX)</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer"
            />
            {resumeFile && <p className="text-green-400 text-sm mt-2">✓ {resumeFile.name}</p>}
          </div>

          {/* Job Description */}
          <div className={`mb-6 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {mode === "internship" ? "Internship Description" : "Job Description"}
            </label>
            <textarea
              rows={5}
              placeholder={mode === "internship" ? "Paste the internship description here..." : "Paste the job description here..."}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Format Toggle */}
          <div className={`mb-8 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Download Format</label>
            <div className="flex gap-3">
              {["pdf", "docx"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    format === f ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {f === "pdf" ? "PDF" : "Word (DOCX)"}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className={`transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 text-white ${
                mode === "internship"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {loadingMsg || "Processing..."}
                </span>
              ) : mode === "internship" ? "Tailor for Internship →" : "Tailor My Resume →"}
            </button>
          </div>
        </div>

        {/* Gap Panel */}
        {showGap && gapData && (
          <div id="gap-panel" className="md:w-1/2 w-full animate-slide-in">
          <div className="md:w-1/2 w-full animate-slide-in">
            <GapPanel
              gapData={gapData}
              mode={mode}
              onConfirm={(skills) => doTailor(skills)}
              onSkip={() => doTailor([])}
            />
          </div>
          </div>
        )}

      </div>
      {/* Score Modal */}
        {showScore && scoreData && (
          <ScoreModal
            scoreData={scoreData}
            mode={mode}
            onDownload={() => {
              triggerDownload(pendingBlob);
              setShowScore(false);
            }}
            onBack={() => setShowScore(false)}
          />
        )}
    </div>
  );
}