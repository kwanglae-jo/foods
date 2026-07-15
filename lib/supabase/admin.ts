import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _adminClient: SupabaseClient | null = null;

/**
 * Service Role 키로 RLS를 우회하는 관리자 전용 클라이언트.
 * 반드시 서버 코드(Route Handler, Cron)에서만 사용하고 클라이언트 번들에 절대 포함하지 않는다.
 * (권한 검사는 이 클라이언트를 사용하기 "전"에 requireAdminProfile()로 반드시 먼저 수행할 것)
 *
 * 반환 타입을 ReturnType<typeof createClient>로 추론하면 제네릭 기본값(Database = any) 대신
 * 제약조건이 사용되어 스키마가 never로 붕괴하는 TS 이슈가 있어, SupabaseClient를 명시한다.
 */
export function createAdminSupabaseClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase 관리자 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 를 확인하세요."
    );
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _adminClient;
}
