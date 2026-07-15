import "server-only";
import { NextResponse } from "next/server";
import { AdminAuthError } from "./admin-auth";

export function handleAdminApiError(err: unknown) {
  if (err instanceof AdminAuthError) {
    return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
  }
  const message = err instanceof Error ? err.message : "요청을 처리하지 못했습니다.";
  return NextResponse.json({ error: message }, { status: 400 });
}
