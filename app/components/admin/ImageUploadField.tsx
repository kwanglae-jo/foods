"use client";

import { useState } from "react";
import { uploadPressMedia, type UploadFolder } from "../../../lib/upload-client";

export default function ImageUploadField({
  id,
  label,
  value,
  onChange,
  folder,
  accept = "image/png,image/jpeg,image/webp",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadPressMedia(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="field field--full">
      <label htmlFor={id}>{label}</label>
      <div className="admin-image-field">
        <input
          id={id}
          type="text"
          placeholder="/path 또는 https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="btn-outline admin-image-field__upload">
          {uploading ? "업로드 중..." : "파일 업로드"}
          <input type="file" accept={accept} className="sr-only" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- 관리자 전용 미확정 URL 미리보기
        <img src={value} alt="" className="admin-image-field__preview" />
      )}
      {error && <p className="form-message form-message--err">{error}</p>}
    </div>
  );
}
