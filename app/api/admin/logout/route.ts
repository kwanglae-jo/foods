import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase 미설정 상태에서도 로그아웃 요청 자체는 성공으로 처리한다.
  }
  return NextResponse.json({ ok: true });
}
