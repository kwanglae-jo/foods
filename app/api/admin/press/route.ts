import { NextResponse } from "next/server";
import { requireAdminProfile } from "../../../../lib/admin-auth";
import { createPressItem, listAdminPressItems, listArchivedPressItems } from "../../../../lib/press";
import { pressItemInputSchema } from "../../../../lib/press-schema";
import { handleAdminApiError } from "../../../../lib/api-error";

export async function GET(req: Request) {
  try {
    await requireAdminProfile("editor");
    const { searchParams } = new URL(req.url);
    const items =
      searchParams.get("trash") === "true" ? await listArchivedPressItems() : await listAdminPressItems();
    return NextResponse.json({ items });
  } catch (err) {
    return handleAdminApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const actor = await requireAdminProfile("editor");
    const body = await req.json().catch(() => null);
    const parsed = pressItemInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(" ") },
        { status: 400 }
      );
    }
    const record = await createPressItem(parsed.data, actor);
    return NextResponse.json({ item: record });
  } catch (err) {
    return handleAdminApiError(err);
  }
}
