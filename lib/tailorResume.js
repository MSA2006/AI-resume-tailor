import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const getPrompt = (originalText, jobDescription, mode, confirmedSkills) => `
You are an expert resume writer. Tailor the resume below for the given job description and return ONLY a valid JSON object — no extra text, no markdown, no backticks.

Original Resume:
${originalText}

Job Description:
${jobDescription}

Mode: ${mode === "internship" ? "INTERNSHIP" : "PROFESSIONAL"}

STRICT RULES:
- Preserve ALL contact info exactly (name, phone, email, address, LinkedIn, GitHub)
- If there is a short title or role directly under the name (like "Software Engineering Student"), put it in the "tagline" field
- Preserve ALL original sections in the SAME ORDER
- Preserve ALL entries — do NOT remove any
- Preserve LinkedIn URL exactly in the "linkedin" field
- Preserve GitHub URL exactly in the "github" field  
- NEVER drop any contact links
- For EACH entry, find its date in the original and copy it EXACTLY to the "date" field
- The date in the original may appear BEFORE the entry title — still copy it to the date field of that entry
- Do NOT place dates inside "title" or "organization" fields
- Summary goes ONLY in the "summary" field — do NOT add a summary section inside sections array
- Skip any existing summary section from the original — do not include it in sections
- Only add keywords where they genuinely fit — do not stuff
${confirmedSkills && confirmedSkills.length > 0 ? `- The candidate has confirmed they have these skills which were missing from their resume — incorporate them naturally: ${confirmedSkills.join(", ")}` : ""}
- Do not invent anything

PAGE LENGTH RULES:
${mode === "internship" ? `
- TARGET: 1 PAGE MAXIMUM
- First assess how much content the resume has
- If the resume is already short (1 page or less worth of content) — preserve ALL bullets and details, do not cut anything, just tailor the wording
- Only apply cuts if the resume is genuinely long (more than 6 projects, more than 4 experience entries, etc)
- If cuts are needed: Education max 1 bullet, Projects max 1 bullet, Experience max 1 bullet, Certifications no bullets
- NEVER remove entire entries — only reduce bullet points if absolutely necessary
- When in doubt, keep the content
` : `
- TARGET: 2 PAGES MAXIMUM
- First assess how much content the resume has
- If the resume is already short (1-2 pages worth of content) — preserve ALL bullets and details, do not cut anything, just tailor the wording
- Only apply cuts if the resume is genuinely very long (more than 5 jobs, more than 6 projects, etc)
- If cuts are needed: Education max 2 bullets, Projects max 2 bullets, Experience max 3 bullets
- NEVER remove entire entries — only reduce bullet points if absolutely necessary
- When in doubt, keep the content — a detailed resume is better than a stripped one
`}

Return this EXACT JSON — every field must exist:
{
  "name": "Full Name",
  "tagline": "short title under name or empty string",
  "contact": "phone | email | address",
  "linkedin": "linkedin url or empty string",
  "github": "github url or empty string",
  "summary": "2-3 line summary",
  "sections": [
    {
      "heading": "SECTION NAME",
      "type": "education | experience | projects | skills | certifications | other",
      "entries": [
        {
          "title": "degree or job title or project name ONLY",
          "organization": "school or company ONLY",
          "date": "exact date from original for THIS entry",
          "bullets": ["bullet 1"],
          "text": "for skills section only"
        }
      ]
    }
  ],
  "changes": ["change 1"]
}

CRITICAL:
- "title" = degree/role/project name only — no dates, no company
- "organization" = school/company only — no dates
- "date" = exact date for that specific entry from original
- Empty bullets array [] for education in internship mode
- Empty bullets array [] for certifications in internship mode
- Return ONLY JSON — no markdown, no backticks, no explanation
`;

export async function tailorResume(originalText, jobDescription, mode = "professional", confirmedSkills = []) {
  const prompt = getPrompt(originalText, jobDescription, mode, confirmedSkills);

  const completion = await client.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 3000,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleaned);

  return data;
}