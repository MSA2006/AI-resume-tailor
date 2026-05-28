import pdfParse from "pdf-parse";

export async function parseResumePDF(fileBuffer) {
  const data = await pdfParse(fileBuffer);
  return data.text;
}

// Keep old export for backwards compatibility
export async function parseResume(fileBuffer) {
  return parseResumePDF(fileBuffer);
}