import mammoth from "mammoth";

export async function parseResumeDOCX(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}