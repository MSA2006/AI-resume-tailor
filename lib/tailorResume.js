import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

function safeParseJSON(raw) {
  let cleaned = raw.replace(/```json|```/g, "").trim();
// Strip any reasoning/thinking tokens that reasoning models prepend
cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
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
- Before removing ANY bullet, check: does it mention a concrete skill, tool, technique, or responsibility that appears in the job description (even indirectly)? If YES, this bullet is RELEVANT and must NEVER be removed or replaced, no matter how long the resume gets
- Only remove/replace a bullet if it is about something with ZERO connection to the job description's responsibilities or requirements (e.g. a bullet about a completely unrelated domain, or pure trivia with no transferable skill)
- It is better to keep an extra relevant bullet (going slightly over the original length) than to cut a relevant bullet to save space
- If you genuinely find a replacement opportunity, the new bullet must be based on TRUE information already present elsewhere in the resume — rephrased to highlight relevance to the JD. Never invent fake achievements
- New bullets must describe a SPECIFIC, concrete action or tool usage — never a vague generic statement like "applied best practices" or "ensured high quality". If you cannot make a specific true claim, keep the original bullet instead
- Expect that in most resumes, very FEW bullets will actually qualify for removal — most experienced candidates' bullets are at least somewhat relevant. Do not aggressively prune just to make room for new keyword bullets.
- This rule takes priority over page-length targets — a resume with all relevant content and 1 extra page beats a resume that lost relevant content to stay shorter

SKILLS EDITING:
- You may add a few relevant keywords from the JD into the existing skill categories if they are plausible given the candidate's background
- Do not invent entire new skill categories
- Keep the original skill categories and their order
- NEVER add a skill, language, certification, or qualification that has NO basis anywhere in the original resume. Adding "Chinese language" or "import/customs experience" to a candidate's skills when nothing in their actual resume supports it is FABRICATION and strictly forbidden, even if the job description requires it. If the candidate doesn't have a skill, it is better to leave it out and let the gap show, than to lie about it.

SUMMARY:
- Write a short 2-3 line summary that fits the job, place it in the "summary" field only
- CRITICAL: If the original resume has a Summary or Professional Summary section, you MUST exclude it entirely from the "sections" array. Do NOT include it as an entry. The "summary" field at the top level replaces it completely. Having both will cause a duplicate summary to appear — this is a serious formatting error. When in doubt, exclude any section whose heading contains the word "summary" from the sections array.

CRITICAL CONSTRAINTS:
- Preserve ALL contact info exactly (name, phone, email, address, LinkedIn, GitHub)
- Preserve ALL dates exactly as in the original, matched to the correct entry
- Preserve section headings and their order exactly as in the original
- The overall resume length must stay close to the original — do NOT make it longer by adding extra entries or extra sections
- For "ADDITIONAL INFORMATION", "INTERESTS", "PUBLICATIONS", or any other free-form fact-listing section: put the ENTIRE section content as ONE single entry with an empty "title", empty "organization", empty "date", and the full original text (preserving original line breaks as \n within the string) in the "text" field. Do NOT create multiple entries for this section. Do NOT split it. One section, one entry, one text block, copied exactly as it appeared in the original resume.
- CRITICAL, NON-NEGOTIABLE: If the original resume does NOT contain an "Additional Information", "Interests", "Publications", or similar free-form section, you MUST NOT create one in your output. Check the original resume's actual sections before deciding. If you do not see this section literally present in the original text, exclude it completely. This applies even if you think the job description suggests the candidate might have such qualifications — you do not have permission to add a new section based on inference.
- The Job Description provided above is for your reference ONLY, to guide which skills/bullets to emphasize. It is NEVER to be copied, in whole or in part, into any field of the output JSON.
- Education, Additional Info, Certifications, Interests sections: copy verbatim, do not split single citations/facts into multiple entries, preserve them exactly as single complete text blocks matching the original wording and grouping
${confirmedSkills && confirmedSkills.length > 0 ? `
CONFIRMED MISSING SKILLS — SPECIAL INSTRUCTION:
The candidate has confirmed they genuinely have ALL of the following skills, even though they were not explicitly written in the original resume: ${confirmedSkills.join(", ")}
- Add EVERY one of these exact skills, worded exactly as given, to the Skills section's "text" field, appended after the existing skills.
- Do NOT add any other skill, tool, or qualification beyond what is listed here and what already exists in the original resume.
- Do NOT create any new section for these skills. They go in the existing Skills section only.
- Do NOT elaborate, expand, or invent additional related skills around these confirmed ones (e.g. if "Chinese language" is confirmed, do not also add "WeChat" or "international shipping" unless those exact terms are also in this confirmed list).
` : ""}

EXTRACTION TASK (in addition to editing):
- Extract the company name from the job description. If not clearly stated, return empty string. Do NOT guess.
- Extract the role/job title from the job description. If not clearly stated, return empty string. Do NOT guess.
- Write a short changes summary (1-2 sentences, specific) describing what was actually changed, e.g. "Added Docker and Kubernetes to Skills. Rewrote 2 bullets in latest role to highlight backend work. Removed 1 unrelated bullet about event planning." Be specific about what was added/removed/reworded, not vague.

Return this EXACT JSON — every field must exist:
{
  "name": "Full Name",
  "tagline": "short title under name or empty string",
  "contact": "phone | email | address",
  "linkedin": "linkedin url or empty string",
  "github": "github url or empty string",
  "summary": "2-3 line summary",
  "companyName": "extracted company name or empty string",
  "roleTitle": "extracted role title or empty string",
  "changesSummary": "1-2 sentence specific summary of changes made",
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

  let completion;
let lastError;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    completion = await client.chat.completions.create({
      model: "gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 6000,
      reasoning_effort: "low",
    });
    break; // success, exit retry loop
  } catch (err) {
    lastError = err;
    if (attempt < 3) {
      await new Promise(res => setTimeout(res, 2000 * attempt)); // 2s, 4s
    }
  }
}
if (!completion) throw lastError;

  const data = safeParseJSON(completion.choices[0].message.content);

  return data;
}