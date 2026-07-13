import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type InquiryPayload = {
  name?: string;
  phone?: string;
  province?: string;
  district?: string;
  budget?: string;
  message?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: InquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const province = body.province?.trim();
  const budget = body.budget?.trim();
  const district = body.district?.trim() || "-";
  const message = body.message?.trim() || "-";

  // 필수값 검증
  if (!name || !phone || !province || !budget) {
    return NextResponse.json(
      { error: "이름, 연락처, 희망 지역(시/도), 창업 가능 예산은 필수입니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from =
    process.env.INQUIRY_FROM_EMAIL || "샤브광 가맹문의 <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error(
      "메일 발송 환경변수가 설정되지 않았습니다. RESEND_API_KEY / INQUIRY_TO_EMAIL 를 확인하세요."
    );
    return NextResponse.json(
      { error: "서버 설정 오류로 접수에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const rows: Array<[string, string]> = [
    ["이름", name],
    ["연락처", phone],
    ["희망 지역", `${province} ${district === "-" ? "" : district}`.trim()],
    ["창업 가능 예산", budget],
    ["문의 내용", message],
  ];

  const html = `
    <div style="font-family: -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 560px; margin: 0 auto; color: #212121;">
      <h2 style="font-size: 18px; border-bottom: 2px solid #ff385c; padding-bottom: 12px;">샤브광 가맹 상담 신청</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 10px 12px; background: #f7f7f7; font-weight: 600; width: 130px; border-bottom: 1px solid #eee; vertical-align: top;">${label}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${escapeHtml(
              value
            )}</td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="font-size: 12px; color: #939393; margin-top: 20px;">샤브광 가맹 랜딩페이지 문의 폼을 통해 접수되었습니다.</p>
    </div>
  `;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((addr) => addr.trim()),
      subject: `[가맹문의] ${name} / ${province}${
        district !== "-" ? " " + district : ""
      }`,
      html,
      text,
    });

    if (error) {
      console.error("Resend 발송 오류:", error);
      return NextResponse.json(
        { error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("메일 발송 예외:", err);
    return NextResponse.json(
      { error: "메일 발송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
