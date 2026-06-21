import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

function safeParseJSON(raw) {
  let cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const lastValidIndex = cleaned.lastIndexOf('"}');
    if (lastValidIndex !== -1) {
      let repaired = cleaned.substring(0, lastValidIndex + 2);
      const openBraces = (repaired.match(/\{/g) || []).length;
      const closeBraces = (repaired.match(/\}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;
      repaired += "]".repeat(Math.max(0, openBrackets - closeBrackets));
      repaired += "}".repeat(Math.max(0, openBraces - closeBraces));
      try {
        return JSON.parse(repaired);
      } catch (err2) {
        throw new Error("AI response was too long and got cut off. Please try again.");
      }
    }
    throw new Error("AI response was too long and got cut off. Please try again.");
  }
}

const getPrompt = (originalText, jobDescription, mode, confirmedSkills) => `
You are an expert resume editor. Your job is SURGICAL EDITING, not rewriting from scratch.

Original Resume:
${originalText}

Job Description:
${jobDescription}

Mode: ${mode === "internship" ? "INTERNSHIP" : "PROFESSIONAL"}

YOUR APPROACH — read carefully:
- Copy the resume's structure, sections, formatting, and order EXACTLY as given
- Do NOT restructure, reformat, merge, or reorganize ANY section
- Education, Certifications, Additional Information, Interests — copy these sections with ZERO changes to their wording or structure, exactly as they appear in the original
- ONLY make targeted edits to: (1) Experience/Project bullet points, (2) Skills section, (3) a short 2-3 line summary at the top

SURGICAL BULLET EDITING (Experience & Projects sections only):
- For each job/project, look at its bullets. If a bullet is weak or irrelevant to the job description, you MAY replace it with a different bullet that better matches the JD
- New bullets must be based on TRUE information already present elsewhere in the resume (skills, other roles, education) — rephrased naturally to highlight relevance to the JD. Do NOT invent fake achievements, tools, or experience that has no basis in the original resume
- New bullets must describe a SPECIFIC, concrete action or tool usage — never a vague generic statement like "applied best practices" or "ensured high quality". If you cannot make a specific true claim, keep the original bullet instead of replacing it with something vague
- You do NOT need to replace bullets 1-for-1 — if you remove 3 weak bullets you might add only 1-2 strong ones, whatever keeps it natural and relevant
- Most bullets that are ALREADY relevant should be kept completely unchanged
- Keep the TOTAL bullet count per job roughly similar to the original (within 1-2 of the original count) so the resume length doesn't grow

SKILLS EDITING:
- You may add a few relevant keywords from the JD into the existing skill categories if they are plausible given the candidate's background
- Do not invent entire new skill categories
- Keep the original skill categories and their order

SUMMARY:
- Write a short 2-3 line summary that fits the job, place it in the "summary" field only
- If the original has a summary section, skip it from "sections" (it's replaced by the new one)

CRITICAL CONSTRAINTS:
- Preserve ALL contact info exactly (name, phone, email, address, LinkedIn, GitHub)
- Preserve ALL dates exactly as in the original, matched to the correct entry
- Preserve section headings and their order exactly as in the original
- The overall resume length must stay close to the original — do NOT make it longer by adding extra entries or extra sections
- For "ADDITIONAL INFORMATION", "INTERESTS", "PUBLICATIONS", or any other free-form fact-listing section: put the ENTIRE section content as ONE single entry with an empty "title", empty "organization", empty "date", and the full original text (preserving original line breaks as \n within the string) in the "text" field. Do NOT create multiple entries for this section. Do NOT split it. One section, one entry, one text block, copied exactly as it appeared in the original resume.
- Education, Additional Info, Certifications, Interests sections: copy verbatim, do not split single citations/facts into multiple entries, preserve them exactly as single complete text blocks matching the original wording and grouping
${confirmedSkills && confirmedSkills.length > 0 ? `- The candidate confirmed they have these skills which were missing — incorporate naturally where relevant: ${confirmedSkills.join(", ")}` : ""}

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
          "title": "degree or job title or project name ONLY (empty for standalone facts)",
          "organization": "school or company ONLY (empty for standalone facts)",
          "date": "exact date from original for THIS entry, empty string if none",
          "bullets": ["bullet 1"],
          "text": "use for skills, OR for a standalone fact/citation that has no title/org structure — keep it as ONE complete sentence/block exactly as worded in the original, never split"
        }
      ]
    }
  ]
}

Return ONLY JSON — no markdown, no backticks, no explanation.
`;

export async function tailorResume(originalText, jobDescription, mode = "professional", confirmedSkills = []) {
  const prompt = getPrompt(originalText, jobDescription, mode, confirmedSkills);

  const completion = await client.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 6000,
  });

  const data = safeParseJSON(completion.choices[0].message.content);

  return data;
}