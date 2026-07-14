import { NextResponse } from "next/server";
import { createPressArticle, listPressArticles } from "../../../../lib/db";

export async function GET() {
  const articles = await listPressArticles();
  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { date, source, title, content } = body;

  if (!date || !source || !title || !content) {
    return NextResponse.json(
      { error: "모든 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  const id = await createPressArticle({ date, source, title, content });
  return NextResponse.json({ id });
}
