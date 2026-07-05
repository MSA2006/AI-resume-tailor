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
    const tailoredText = formData.get("tailoredText");
    const jobDescription = formData.get("jobDescription");

    const prompt = `
You are an ATS (Applicant Tracking System) expert.

Analyze how well these resumes match the job description and return ONLY valid JSON.

Original Resume:
${resumeText}

Tailored Resume:
${tailoredText}

Job Description:
${jobDescription}

Calculate:
1. Original resume ATS score (0-100)
2. Tailored resume ATS score (0-100)
3. Top 3 keywords that matched in the tailored resume
4. Top 3 keywords still missing or weak

Return ONLY this JSON:
{
  "originalScore": 45,
  "tailoredScore": 78,
  "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "verdict": "Strong Match" 
}

Verdict options: "Poor Match", "Decent Match", "Good Match", "Strong Match"
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
    
    // Find JSON object in response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/score:", error);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}