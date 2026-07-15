import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";
import { getAdminProfile } from "../../../../lib/admin-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 입력해주세요." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return NextResponse.json({ error: "관리자 시스템이 아직 설정되지 않았습니다." }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const profile = await getAdminProfile();
  if (!profile) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "관리자로 초대되지 않은 계정입니다." }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
