"use client";

import { useCallback, useRef } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { getPressEditorExtensions, EMPTY_DOC } from "../../../lib/tiptap-extensions";
import { uploadPressMedia } from "../../../lib/upload-client";

type Props = {
  content: JSONContent;
  onChange: (json: JSONContent) => void;
};

export default function PressEditor({ content, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: getPressEditorExtensions(),
    content: content && Object.keys(content).length > 0 ? content : EMPTY_DOC,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: "press-editor__prosemirror press-detail__body",
        "aria-label": "본문 편집기",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL을 입력하세요 (비우면 링크 해제)", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    try {
      const { url } = await uploadPressMedia(file, "body");
      editor.chain().focus().setImage({ src: url, alt: "" }).run();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
    }
  }

  if (!editor) return null;

  return (
    <div className="press-editor">
      <div className="press-editor__toolbar" role="toolbar" aria-label="본문 서식">
        <ToolbarButton
          label="굵게"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="기울임"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          label="취소선"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </ToolbarButton>
        <ToolbarButton
          label="제목 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="제목 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="글머리 목록"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •••
        </ToolbarButton>
        <ToolbarButton
          label="번호 목록"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          123
        </ToolbarButton>
        <ToolbarButton
          label="인용구"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “”
        </ToolbarButton>
        <ToolbarButton label="구분선" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </ToolbarButton>
        <ToolbarButton label="링크" active={editor.isActive("link")} onClick={setLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton label="이미지 삽입" onClick={() => fileInputRef.current?.click()}>
          🖼
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleImageSelect}
          aria-hidden="true"
          tabIndex={-1}
        />
        <ToolbarButton label="실행 취소" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolbarButton>
        <ToolbarButton label="다시 실행" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="press-editor__btn"
      aria-label={label}
      aria-pressed={active ?? false}
      data-active={active ? "true" : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
