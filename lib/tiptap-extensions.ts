import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

/**
 * 관리자 에디터와 공개 페이지 렌더러가 "동일하게" 사용하는 확장 목록.
 * 여기 포함되지 않은 노드/마크(iframe, table, raw HTML 등)는 애초에
 * 파싱/렌더링될 수 없으므로 이 화이트리스트 자체가 1차 방어선이 된다.
 */
export function getPressEditorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      protocols: ["http", "https"],
      HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
    }),
    Image.configure({ inline: false }),
  ];
}

export const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };
