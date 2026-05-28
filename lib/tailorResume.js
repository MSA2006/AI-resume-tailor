import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
- Education: NO bullet points — just degree, school, date on one line
- Projects: MAX 1 bullet per project — one concise line only
- Experience: MAX 1 bullet per entry
- Certifications: NO bullet points — just title, org, date
- Keep all entries but make each one very concise
` : `
- TARGET: 2 PAGES MAXIMUM
- Education: max 2 bullets per entry
- Projects: max 2 bullets per project
- Experience: max 3 bullets per entry
- Keep content detailed but not bloated
`}

Return this EXACT JSON — every field must exist:
{
  "name": "Full Name",
  "tagline": "short title under name or empty string",
  "contact": "phone | email | address",
  "linkedin": "linkedin url or empty string",
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

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleaned);

  return data;
}