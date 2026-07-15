import { NextResponse } from "next/server";
import { requireAdminProfile } from "../../../../../../lib/admin-auth";
import { duplicatePressItem } from "../../../../../../lib/press";
import { handleAdminApiError } from "../../../../../../lib/api-error";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminProfile("editor");
    const { id } = await params;
    const record = await duplicatePressItem(id, actor);
    return NextResponse.json({ item: record });
  } catch (err) {
    return handleAdminApiError(err);
  }
}
