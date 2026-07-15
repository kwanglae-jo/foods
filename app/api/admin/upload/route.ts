import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdminProfile } from "../../../../lib/admin-auth";
import { createAdminSupabaseClient } from "../../../../lib/supabase/admin";
import { uploadRequestSchema } from "../../../../lib/press-schema";
import { handleAdminApiError } from "../../../../lib/api-error";

const BUCKET = "press-media";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_ATTACHMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

function safeExtension(filename: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
  return match ? `.${match[1].toLowerCase()}` : "";
}

export async function POST(req: Request) {
  try {
    await requireAdminProfile("editor");

    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일이 필요합니다." }, { status: 400 });
    }

    const parsedFolder = uploadRequestSchema.safeParse({ folder: folderRaw });
    if (!parsedFolder.success) {
      return NextResponse.json({ error: "허용되지 않은 업로드 위치입니다." }, { status: 400 });
    }
    const { folder } = parsedFolder.data;

    const isAttachment = folder === "attachments";
    const allowedTypes = isAttachment ? ALLOWED_ATTACHMENT_TYPES : ALLOWED_IMAGE_TYPES;
    const maxBytes = isAttachment ? MAX_ATTACHMENT_BYTES : MAX_IMAGE_BYTES;

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: `허용되지 않은 파일 형식입니다: ${file.type}` }, { status: 400 });
    }
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `파일 용량이 너무 큽니다. 최대 ${Math.floor(maxBytes / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    const path = `${folder}/${randomUUID()}${safeExtension(file.name)}`;
    const admin = createAdminSupabaseClient();
    const { error } = await admin.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: `업로드에 실패했습니다: ${error.message}` }, { status: 500 });
    }

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (err) {
    return handleAdminApiError(err);
  }
}
