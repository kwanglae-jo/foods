import { NextResponse } from "next/server";
import { deletePressArticle, updatePressArticle } from "../../../../../lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { date, source, title, content } = body;

  if (!date || !source || !title || !content) {
    return NextResponse.json(
      { error: "모든 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  await updatePressArticle(Number(id), { date, source, title, content });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deletePressArticle(Number(id));
  return NextResponse.json({ ok: true });
}
