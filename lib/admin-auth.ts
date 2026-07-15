import "server-only";
import { createServerSupabaseClient } from "./supabase/server";

export type AdminRole = "admin" | "editor";

export type AdminProfile = {
  userId: string;
  email: string | null;
  role: AdminRole;
  displayName: string | null;
};

export class AdminAuthError extends Error {
  code: "UNAUTHENTICATED" | "FORBIDDEN";
  constructor(code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code === "UNAUTHENTICATED" ? "로그인이 필요합니다." : "권한이 없습니다.");
    this.name = "AdminAuthError";
    this.code = code;
  }
}

/**
 * 현재 세션 사용자의 관리자 프로필을 조회한다.
 * auth.getUser()는 Supabase Auth 서버에 토큰을 재검증하므로 getSession()보다 안전하다.
 * press_admin_profiles에 행이 없으면(=초대되지 않은 사용자) null을 반환한다.
 */
export async function getAdminProfile(): Promise<AdminProfile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("press_admin_profiles")
      .select("role, display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return null;

    return {
      userId: user.id,
      email: user.email ?? null,
      role: profile.role as AdminRole,
      displayName: (profile.display_name as string | null) ?? null,
    };
  } catch {
    // Supabase 환경변수 미설정 등 초기화 실패 시 "미인증"으로 취급한다.
    return null;
  }
}

/** 모든 admin API 라우트/서버 컴포넌트는 이 함수로 직접 권한을 재검증해야 한다(미들웨어만 신뢰하지 않음). */
export async function requireAdminProfile(minRole: AdminRole = "editor"): Promise<AdminProfile> {
  const profile = await getAdminProfile();
  if (!profile) throw new AdminAuthError("UNAUTHENTICATED");
  if (minRole === "admin" && profile.role !== "admin") throw new AdminAuthError("FORBIDDEN");
  return profile;
}
