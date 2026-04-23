import pdfParse from "pdf-parse";

export async function parseResume(fileBuffer) {
  const data = await pdfParse(fileBuffer);
  return data.text;
}