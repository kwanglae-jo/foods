import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 확인하세요."
    );
  }
  return { url, anonKey };
}

/**
 * 로그인한 사용자의 세션(RLS)으로 동작하는 서버 클라이언트.
 * Server Component에서는 쿠키를 다시 쓸 수 없으므로 setAll 실패는 무시한다
 * (세션 갱신은 middleware가 담당).
 */
export async function createServerSupabaseClient() {
  const { url, anonKey } = getEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component 렌더링 중 호출된 경우 무시한다.
        }
      },
    },
  });
}
