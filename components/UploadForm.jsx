"use client";

import { useState, useEffect } from "react";

export default function UploadForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume and enter a job description!");
      return;
    }

    setLoading(true);

    try {
      // Build form data to send to API
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      // Call our API route
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

      // Get the PDF blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div
        className={`bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-xl transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Title */}
        <div className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-3xl font-bold text-white mb-2">AI Resume Tailor</h1>
          <p className="text-gray-400 mb-8">Upload your resume and paste the job description. We'll tailor it for you.</p>
        </div>

        {/* Resume Upload */}
        <div className={`mb-6 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer"
          />
          {resumeFile && (
            <p className="text-green-400 text-sm mt-2">✓ {resumeFile.name}</p>
          )}
        </div>

        {/* Job Description */}
        <div className={`mb-8 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Description
          </label>
          <textarea
            rows={6}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full text-gray-300 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className={`transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Tailoring your resume...
              </span>
            ) : (
              "Tailor My Resume →"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}