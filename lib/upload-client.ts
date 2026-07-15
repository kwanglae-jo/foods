"use client";

export type UploadFolder = "thumbnails" | "hero" | "body" | "attachments";

export async function uploadPressMedia(file: File, folder: UploadFolder): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || "업로드에 실패했습니다.");
  }
  return body as { url: string; path: string };
}
