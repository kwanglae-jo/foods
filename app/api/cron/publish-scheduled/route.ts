import { NextResponse } from "next/server";
import { publishDueScheduledItems } from "../../../../lib/press";

/**
 * Vercel Cron 전용 엔드포인트. vercel.json의 crons 설정으로 주기 호출되며,
 * CRON_SECRET 환경변수가 설정되어 있으면 Vercel이 자동으로 Authorization 헤더를 붙여준다.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const published = await publishDueScheduledItems();
    return NextResponse.json({ ok: true, published });
  } catch (err) {
    const message = err instanceof Error ? err.message : "예약 발행 처리에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
