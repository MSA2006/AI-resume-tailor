import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const resumeText = formData.get("resumeText");
    const jobDescription = formData.get("jobDescription");

    const prompt = `
You are an expert technical recruiter and ATS specialist.

Analyze the gap between this resume and job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Your job:
1. Identify if there is a MAJOR skill gap between the resume and JD
2. A MAJOR gap means completely different domains (e.g. frontend dev applying for backend role, designer applying for engineering role)
3. A MINOR gap means same domain different tools (e.g. knows React but JD wants Vue, knows MySQL but JD wants MongoDB) — this is NOT a major gap
4. If major gap exists, find the top 3-5 most critical missing skills that the JD specifically requires
5. For each missing skill explain in one short sentence why it is critically needed

Return ONLY this exact JSON — no markdown, no backticks:
{
  "hasMajorGap": true or false,
  "gapSummary": "one sentence explaining the overall gap if major, empty string if not",
  "missingSkills": [
    {
      "skill": "Node.js",
      "reason": "The JD requires backend API development and Node.js is explicitly mentioned 3 times",
      "criticality": "critical"
    }
  ]
}

If hasMajorGap is false, return empty array for missingSkills and empty string for gapSummary.
Return ONLY the JSON.
`;

    const completion = await client.chat.completions.create({
  model: "gpt-oss-120b",
  messages: [{ role: "user", content: prompt }],
  temperature: 0.3,
  max_tokens: 6000,
  reasoning_effort: "low",
});

    const raw = completion.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}