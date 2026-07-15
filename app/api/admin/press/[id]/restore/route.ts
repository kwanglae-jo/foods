import { NextResponse } from "next/server";
import { requireAdminProfile } from "../../../../../../lib/admin-auth";
import { restorePressItem } from "../../../../../../lib/press";
import { handleAdminApiError } from "../../../../../../lib/api-error";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminProfile("admin");
    const { id } = await params;
    await restorePressItem(id, actor);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminApiError(err);
  }
}
