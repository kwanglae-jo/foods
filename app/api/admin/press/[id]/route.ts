import { NextResponse } from "next/server";
import { requireAdminProfile } from "../../../../../lib/admin-auth";
import { getAdminPressItemById, softDeletePressItem, updatePressItem } from "../../../../../lib/press";
import { pressItemInputSchema } from "../../../../../lib/press-schema";
import { handleAdminApiError } from "../../../../../lib/api-error";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminProfile("editor");
    const { id } = await params;
    const item = await getAdminPressItemById(id);
    if (!item) return NextResponse.json({ error: "존재하지 않는 항목입니다." }, { status: 404 });
    return NextResponse.json({ item });
  } catch (err) {
    return handleAdminApiError(err);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminProfile("editor");
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = pressItemInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(" ") },
        { status: 400 }
      );
    }
    const record = await updatePressItem(id, parsed.data, actor);
    return NextResponse.json({ item: record });
  } catch (err) {
    return handleAdminApiError(err);
  }
}

/** 물리 삭제가 아닌 휴지통 이동(soft delete). admin 권한 필요(lib/press.ts에서 재검증). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminProfile("admin");
    const { id } = await params;
    await softDeletePressItem(id, actor);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminApiError(err);
  }
}
