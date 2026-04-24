import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function tailorResume(originalText, jobDescription) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
You are an expert professional resume writer.

Here is the candidate's original resume:
${originalText}

Here is the job description they are applying for:
${jobDescription}

Your task:
- Rewrite the resume to perfectly match this job description
- Incorporate exact keywords and phrases from the job description naturally
- Quantify achievements wherever possible (e.g. "increased sales by 30%")
- Keep it under 2 page, use bullet point format for experience sections
- Write a summary section at the top highlighting the top 3 to 5 matches between the candidate and the job
- Only use information already in the resume — do NOT invent or assume anything
- Keep it professional and clean
- Output plain text only, no markdown, no asterisks, no special characters

After the resume, add a section called "CHANGES MADE" that lists what was changed from the original resume and why.

Output the full tailored resume followed by the changes section now:
        `,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const fullText = completion.choices[0].message.content;

  // Split resume and changes into separate parts
  const splitIndex = fullText.toLowerCase().indexOf("changes made");
  const resumeText = splitIndex !== -1 ? fullText.substring(0, splitIndex).trim() : fullText;
  const changesText = splitIndex !== -1 ? fullText.substring(splitIndex).trim() : "";

  return { resumeText, changesText };
}