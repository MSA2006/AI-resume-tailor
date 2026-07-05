import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function uploadResumeFile(buffer, userId, format) {
  const timestamp = Date.now();
  const ext = format === "docx" ? "docx" : "pdf";
  const path = `${userId}/${timestamp}.${ext}`;

  const contentType =
    format === "docx"
      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : "application/pdf";

  const { error } = await supabaseAdmin.storage
    .from("resumes")
    .upload(path, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: signedData, error: signedError } = await supabaseAdmin.storage
    .from("resumes")
    .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year

  if (signedError) {
    throw new Error(`Signed URL creation failed: ${signedError.message}`);
  }

  return { path, url: signedData.signedUrl };
}