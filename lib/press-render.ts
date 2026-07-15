import { generateHTML } from "@tiptap/html";
import { getPressEditorExtensions } from "./tiptap-extensions";

/**
 * 순수 함수(비밀값 없음)이므로 서버(lib/press.ts)와 관리자 미리보기(클라이언트) 양쪽에서
 * 동일하게 import해 사용한다 — 렌더링 로직이 하나로 유지되어야 저장 전 미리보기와
 * 실제 공개 페이지 출력이 어긋나지 않는다.
 */

/**
 * href/src 속성이 허용된 프로토콜(http/https/mailto/tel)이거나 상대경로/앵커일 때만 통과시킨다.
 * generateHTML은 등록된 확장(노드/마크)만 렌더링하므로 script 등 임의 태그는 애초에 나올 수 없지만,
 * 속성값(URL)은 그대로 옮겨지므로 javascript: 등 위험한 스킴에 대한 방어를 한 겹 더 둔다.
 */
function sanitizeAttributes(html: string): string {
  return html.replace(/(href|src)="([^"]*)"/gi, (match, attr: string, value: string) => {
    const isSafe = /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(value.trim());
    return isSafe ? match : `${attr}="#"`;
  });
}

export function renderPressBodyHtml(bodyJson: unknown): string {
  if (!bodyJson || typeof bodyJson !== "object") return "";
  try {
    const html = generateHTML(bodyJson as Parameters<typeof generateHTML>[0], getPressEditorExtensions());
    return sanitizeAttributes(html);
  } catch {
    return "";
  }
}

/** JSON-LD description, 목록 요약 등에 사용할 순수 텍스트 추출(태그 제거). */
export function extractPlainText(bodyJson: unknown, maxLength = 200): string {
  const html = renderPressBodyHtml(bodyJson);
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
