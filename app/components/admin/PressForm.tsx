"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import PressEditor from "./PressEditor";
import ImageUploadField from "./ImageUploadField";
import { uploadPressMedia } from "../../../lib/upload-client";
import { renderPressBodyHtml } from "../../../lib/press-render";
import {
  PRESS_STATUS_LABELS,
  PRESS_TYPE_LABELS,
  fromKstDateTimeLocalValue,
  toKstDateTimeLocalValue,
  type PressRecord,
  type PressStatus,
  type PressType,
} from "../../../lib/press-types";
import { EMPTY_DOC } from "../../../lib/tiptap-extensions";
import type { AdminRole } from "../../../lib/admin-auth";

const TYPE_OPTIONS: PressType[] = ["press-release", "media-coverage", "brand-news"];

function statusOptionsForRole(role: AdminRole): PressStatus[] {
  return role === "admin"
    ? ["draft", "in_review", "scheduled", "published", "ended"]
    : ["draft", "in_review"];
}

type FormState = {
  slug: string;
  type: PressType;
  status: PressStatus;
  title: string;
  summary: string;
  bodyJson: JSONContent;
  publishAtLocal: string;
  sourceName: string;
  sourceUrl: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  imageAlt: string;
  attachmentUrl: string;
  attachmentLabel: string;
  author: string;
  featured: boolean;
  tags: string;
  relatedIds: string[];
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
};

function toFormState(record?: PressRecord): FormState {
  return {
    slug: record?.slug ?? "",
    type: record?.type ?? "media-coverage",
    status: record?.status ?? "draft",
    title: record?.title ?? "",
    summary: record?.summary ?? "",
    bodyJson: (record?.bodyJson as JSONContent) ?? EMPTY_DOC,
    publishAtLocal: record?.publishAt ? toKstDateTimeLocalValue(record.publishAt) : "",
    sourceName: record?.sourceName ?? "",
    sourceUrl: record?.sourceUrl ?? "",
    thumbnailUrl: record?.thumbnailUrl ?? "",
    heroImageUrl: record?.heroImageUrl ?? "",
    imageAlt: record?.imageAlt ?? "",
    attachmentUrl: record?.attachmentUrl ?? "",
    attachmentLabel: record?.attachmentLabel ?? "",
    author: record?.author ?? "",
    featured: record?.featured ?? false,
    tags: (record?.tags ?? []).join(", "),
    relatedIds: record?.relatedIds ?? [],
    seoTitle: record?.seoTitle ?? "",
    seoDescription: record?.seoDescription ?? "",
    ogImageUrl: record?.ogImageUrl ?? "",
  };
}

export default function PressForm({
  mode,
  role,
  initial,
  otherItems,
}: {
  mode: "new" | "edit";
  role: AdminRole;
  initial?: PressRecord;
  otherItems: PressRecord[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const statusOptions = useMemo(() => statusOptionsForRole(role), [role]);
  const previewHtml = useMemo(() => renderPressBodyHtml(form.bodyJson), [form.bodyJson]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAttachmentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { url } = await uploadPressMedia(file, "attachments");
      update("attachmentUrl", url);
      if (!form.attachmentLabel) update("attachmentLabel", file.name);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "첨부파일 업로드에 실패했습니다.");
    }
  }

  async function submit(overrideStatus?: PressStatus) {
    setMessage("");
    setSaving(true);

    const status = overrideStatus ?? form.status;
    const publishAtLocal =
      status === "published" && !form.publishAtLocal
        ? toKstDateTimeLocalValue(new Date().toISOString())
        : form.publishAtLocal;

    const payload = {
      slug: form.slug || undefined,
      type: form.type,
      status,
      title: form.title,
      summary: form.summary,
      bodyJson: form.bodyJson,
      publishAt: publishAtLocal ? fromKstDateTimeLocalValue(publishAtLocal) : null,
      sourceName: form.sourceName,
      sourceUrl: form.sourceUrl || undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
      heroImageUrl: form.heroImageUrl || undefined,
      imageAlt: form.imageAlt || undefined,
      attachmentUrl: form.attachmentUrl || undefined,
      attachmentLabel: form.attachmentLabel || undefined,
      author: form.author || undefined,
      featured: form.featured,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      relatedIds: form.relatedIds,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      ogImageUrl: form.ogImageUrl || undefined,
    };

    const url = mode === "edit" && initial ? `/api/admin/press/${initial.id}` : "/api/admin/press";
    const method = mode === "edit" ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setMessage(body.error || "저장에 실패했습니다.");
      return;
    }

    router.push("/admin/press");
    router.refresh();
  }

  return (
    <div>
      <div className="admin-form-actions">
        <button type="button" className="btn-outline" onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? "편집으로 돌아가기" : "미리보기"}
        </button>
      </div>

      {showPreview ? (
        <div className="press-detail-preview">
          <span className="press-badge">{PRESS_TYPE_LABELS[form.type]}</span>
          <h1 className="press-detail__title">{form.title || "(제목 없음)"}</h1>
          <p className="press-detail__summary">{form.summary}</p>
          <p className="press-detail__meta">
            {form.sourceName || "(작성 주체 없음)"} ·{" "}
            {form.publishAtLocal ? form.publishAtLocal.replace("T", " ") : "(발행일 미지정)"}
          </p>
          <div className="press-detail__body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      ) : (
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="form-row">
            <div className="field">
              <label htmlFor="type">콘텐츠 유형</label>
              <select id="type" value={form.type} onChange={(e) => update("type", e.target.value as PressType)}>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {PRESS_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="status">공개 상태</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => update("status", e.target.value as PressStatus)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {PRESS_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field field--full">
            <label htmlFor="title">제목</label>
            <input id="title" type="text" value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>

          <div className="field field--full">
            <label htmlFor="slug">슬러그(URL, 비우면 제목으로 자동 생성)</label>
            <input id="slug" type="text" value={form.slug} onChange={(e) => update("slug", e.target.value)} />
          </div>

          <div className="field field--full">
            <label htmlFor="summary">한 줄 요약</label>
            <textarea id="summary" value={form.summary} onChange={(e) => update("summary", e.target.value)} required />
          </div>

          <div className="field field--full">
            <label htmlFor="press-body">본문</label>
            <PressEditor content={form.bodyJson} onChange={(json) => update("bodyJson", json)} />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="publishAt">발행 시각(KST)</label>
              <input
                id="publishAt"
                type="datetime-local"
                value={form.publishAtLocal}
                onChange={(e) => update("publishAtLocal", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="sourceName">매체명 / 작성 주체</label>
              <input
                id="sourceName"
                type="text"
                placeholder="샤브광 또는 매체명"
                value={form.sourceName}
                onChange={(e) => update("sourceName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field field--full">
            <label htmlFor="sourceUrl">원문 링크(언론 보도인 경우)</label>
            <input
              id="sourceUrl"
              type="text"
              placeholder="https://..."
              value={form.sourceUrl}
              onChange={(e) => update("sourceUrl", e.target.value)}
            />
          </div>

          <ImageUploadField
            id="thumbnailUrl"
            label="목록 썸네일 이미지"
            value={form.thumbnailUrl}
            onChange={(v) => update("thumbnailUrl", v)}
            folder="thumbnails"
          />
          <ImageUploadField
            id="heroImageUrl"
            label="상세페이지 대표 이미지"
            value={form.heroImageUrl}
            onChange={(v) => update("heroImageUrl", v)}
            folder="hero"
          />
          <div className="field field--full">
            <label htmlFor="imageAlt">대표 이미지 대체 텍스트(alt)</label>
            <input id="imageAlt" type="text" value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} />
          </div>

          <div className="field field--full">
            <label htmlFor="attachmentUrl">첨부파일(PDF/이미지) URL</label>
            <div className="admin-image-field">
              <input
                id="attachmentUrl"
                type="text"
                value={form.attachmentUrl}
                onChange={(e) => update("attachmentUrl", e.target.value)}
              />
              <label className="btn-outline admin-image-field__upload">
                파일 업로드
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  className="sr-only"
                  onChange={handleAttachmentUpload}
                />
              </label>
            </div>
          </div>
          <div className="field field--full">
            <label htmlFor="attachmentLabel">첨부파일 표시 이름</label>
            <input
              id="attachmentLabel"
              type="text"
              placeholder="보도자료 원문.pdf"
              value={form.attachmentLabel}
              onChange={(e) => update("attachmentLabel", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="author">작성자(선택)</label>
              <input id="author" type="text" value={form.author} onChange={(e) => update("author", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="tags">태그(쉼표로 구분)</label>
              <input id="tags" type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            </div>
          </div>

          <div className="field field--full press-admin-checkbox">
            <label htmlFor="featured">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />
              대표(Featured) 콘텐츠로 지정
            </label>
          </div>

          <div className="field field--full">
            <label htmlFor="relatedIds">관련 콘텐츠(Ctrl/Cmd+클릭으로 다중 선택, 비우면 자동 추천)</label>
            <select
              id="relatedIds"
              multiple
              size={Math.min(6, Math.max(3, otherItems.length))}
              value={form.relatedIds}
              onChange={(e) =>
                update(
                  "relatedIds",
                  Array.from(e.target.selectedOptions).map((o) => o.value)
                )
              }
            >
              {otherItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {PRESS_TYPE_LABELS[item.type]} · {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="field field--full">
            <label htmlFor="seoTitle">SEO 제목(선택, 비우면 제목 사용)</label>
            <input id="seoTitle" type="text" value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
          </div>
          <div className="field field--full">
            <label htmlFor="seoDescription">SEO 설명(선택, 비우면 요약 사용)</label>
            <textarea
              id="seoDescription"
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
            />
          </div>
          <ImageUploadField
            id="ogImageUrl"
            label="OG 공유 이미지(선택, 비우면 대표 이미지 사용)"
            value={form.ogImageUrl}
            onChange={(v) => update("ogImageUrl", v)}
            folder="hero"
          />

          <div className="admin-form-actions">
            <button type="button" className="btn-outline" disabled={saving} onClick={() => submit("draft")}>
              초안으로 저장
            </button>
            {role === "admin" && (
              <button type="button" className="btn-primary" disabled={saving} onClick={() => submit("published")}>
                지금 발행
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
          {message && <p className="form-message form-message--err">{message}</p>}
        </form>
      )}
    </div>
  );
}

