import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabase/server";
import { createAdminSupabaseClient } from "./supabase/admin";
import { renderPressBodyHtml } from "./press-render";
import type { AdminProfile } from "./admin-auth";
import type { PressItemInput } from "./press-schema";
import { slugify, type PressItem, type PressRecord, type PressStatus, type PressType } from "./press-types";

export * from "./press-types";

export function toPressItem(record: PressRecord): PressItem {
  return {
    id: record.id,
    slug: record.slug,
    type: record.type,
    title: record.title,
    summary: record.summary,
    body: renderPressBodyHtml(record.bodyJson),
    publishedAt: record.publishAt ?? record.createdAt,
    updatedAt: record.updatedAt,
    sourceName: record.sourceName,
    sourceUrl: record.sourceUrl,
    thumbnail: record.thumbnailUrl,
    heroImage: record.heroImageUrl,
    imageAlt: record.imageAlt,
    attachmentUrl: record.attachmentUrl,
    attachmentLabel: record.attachmentLabel,
    author: record.author,
    featured: record.featured,
    tags: record.tags,
    relatedIds: record.relatedIds,
    status: record.status,
  };
}

type PressRow = {
  id: string;
  slug: string;
  type: string;
  status: string;
  title: string;
  summary: string;
  body_json: unknown;
  publish_at: string | null;
  ended_at: string | null;
  source_name: string;
  source_url: string | null;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  image_alt: string | null;
  attachment_url: string | null;
  attachment_label: string | null;
  author: string | null;
  featured: boolean;
  tags: string[] | null;
  related_ids: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

function mapRow(row: PressRow): PressRecord {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type as PressType,
    status: row.status as PressStatus,
    title: row.title,
    summary: row.summary,
    bodyJson: row.body_json,
    publishAt: row.publish_at,
    endedAt: row.ended_at,
    sourceName: row.source_name,
    sourceUrl: row.source_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    heroImageUrl: row.hero_image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    attachmentLabel: row.attachment_label ?? undefined,
    author: row.author ?? undefined,
    featured: row.featured,
    tags: row.tags ?? [],
    relatedIds: row.related_ids ?? [],
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
    createdBy: row.created_by ?? undefined,
    updatedBy: row.updated_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at ?? undefined,
  };
}

/* ---------------------------------- 공개 조회 ---------------------------------- */

/**
 * Supabase 미설정(빌드 시점, 또는 서비스 장애) 상황에서도 공개 페이지가 500으로 죽지 않고
 * "등록된 콘텐츠 없음" 빈 상태로 안전하게 대체되도록 오류를 삼킨다.
 */
export async function listPublishedPressItems(): Promise<PressItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("press_items")
      .select("*")
      .eq("status", "published")
      .lte("publish_at", new Date().toISOString())
      .is("deleted_at", null)
      .order("publish_at", { ascending: false });

    if (error) {
      console.error("listPublishedPressItems error:", error.message);
      return [];
    }
    return ((data as PressRow[] | null) ?? []).map(mapRow).map(toPressItem);
  } catch (err) {
    console.error("listPublishedPressItems 초기화 실패:", err);
    return [];
  }
}

/* ---------------------------------- 관리자 조회 ---------------------------------- */

export async function listAdminPressItems(): Promise<PressRecord[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("press_items")
    .select("*")
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data as PressRow[] | null) ?? []).map(mapRow);
}

export async function listArchivedPressItems(): Promise<PressRecord[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("press_items")
    .select("*")
    .eq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data as PressRow[] | null) ?? []).map(mapRow);
}

export async function getAdminPressItemById(id: string): Promise<PressRecord | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("press_items").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapRow(data as PressRow);
}

/* ------------------------------- 슬러그 생성 ------------------------------- */

async function slugTaken(supabase: SupabaseClient, slug: string, excludeId?: string): Promise<boolean> {
  let query = supabase.from("press_items").select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return Boolean(data && data.length > 0);
}

async function generateUniqueSlug(supabase: SupabaseClient, source: string, excludeId?: string): Promise<string> {
  const base = slugify(source);
  let candidate = base;
  let n = 2;
  while (await slugTaken(supabase, candidate, excludeId)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

/* ---------------------------------- 감사 로그 ---------------------------------- */

async function logAudit(
  pressItemId: string,
  actorId: string | null,
  action: string,
  metadata: Record<string, unknown>
): Promise<void> {
  try {
    const admin = createAdminSupabaseClient();
    await admin.from("press_audit_log").insert({ press_item_id: pressItemId, actor_id: actorId, action, metadata });
  } catch (err) {
    console.error("press_audit_log insert 실패:", err);
  }
}

const ADMIN_ONLY_STATUSES: PressStatus[] = ["published", "scheduled", "ended", "archived"];

/** 발행/예약/게시종료/보관 처리는 admin 역할만 수행할 수 있다(editor는 초안/검수 대기까지). */
function assertStatusAllowed(status: PressStatus, actor: AdminProfile): void {
  if (ADMIN_ONLY_STATUSES.includes(status) && actor.role !== "admin") {
    throw new Error("발행·예약·게시종료·보관 처리는 admin 권한이 필요합니다.");
  }
}

function statusTransitionAction(from: PressStatus, to: PressStatus): string {
  if (to === "published") return "publish";
  if (to === "ended") return "end";
  if (to === "archived") return "archive";
  if (from === "archived") return "restore";
  return "update";
}

/* ------------------------------ 등록/수정/복제/삭제 ------------------------------ */

function toRow(input: PressItemInput, slug: string) {
  return {
    slug,
    type: input.type,
    status: input.status,
    title: input.title,
    summary: input.summary,
    body_json: input.bodyJson,
    publish_at: input.publishAt ?? null,
    source_name: input.sourceName,
    source_url: input.sourceUrl ?? null,
    thumbnail_url: input.thumbnailUrl ?? null,
    hero_image_url: input.heroImageUrl ?? null,
    image_alt: input.imageAlt ?? null,
    attachment_url: input.attachmentUrl ?? null,
    attachment_label: input.attachmentLabel ?? null,
    author: input.author ?? null,
    featured: input.featured ?? false,
    tags: input.tags ?? [],
    related_ids: input.relatedIds ?? [],
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
    og_image_url: input.ogImageUrl ?? null,
  };
}

export async function createPressItem(input: PressItemInput, actor: AdminProfile): Promise<PressRecord> {
  assertStatusAllowed(input.status, actor);
  const supabase = await createServerSupabaseClient();
  const slug = await generateUniqueSlug(supabase, input.slug?.trim() || input.title);

  const { data, error } = await supabase
    .from("press_items")
    .insert({ ...toRow(input, slug), created_by: actor.userId, updated_by: actor.userId })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "생성에 실패했습니다.");

  const record = mapRow(data as PressRow);
  await logAudit(record.id, actor.userId, record.status === "published" ? "publish" : "create", {
    status: record.status,
  });
  return record;
}

export async function updatePressItem(
  id: string,
  input: PressItemInput,
  actor: AdminProfile
): Promise<PressRecord> {
  assertStatusAllowed(input.status, actor);
  const supabase = await createServerSupabaseClient();
  const current = await getAdminPressItemById(id);
  if (!current) throw new Error("존재하지 않는 항목입니다.");
  if (ADMIN_ONLY_STATUSES.includes(current.status) && current.status !== input.status && actor.role !== "admin") {
    throw new Error("발행·예약·게시종료·보관 상태의 글을 변경하려면 admin 권한이 필요합니다.");
  }

  const requestedSlug = input.slug?.trim();
  const slug =
    requestedSlug && requestedSlug !== current.slug
      ? await generateUniqueSlug(supabase, requestedSlug, id)
      : current.slug;

  const { data, error } = await supabase
    .from("press_items")
    .update({ ...toRow(input, slug), updated_by: actor.userId })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "수정에 실패했습니다.");

  const record = mapRow(data as PressRow);
  const action = current.status !== record.status ? statusTransitionAction(current.status, record.status) : "update";
  await logAudit(record.id, actor.userId, action, { from: current.status, to: record.status });
  return record;
}

export async function duplicatePressItem(id: string, actor: AdminProfile): Promise<PressRecord> {
  const supabase = await createServerSupabaseClient();
  const source = await getAdminPressItemById(id);
  if (!source) throw new Error("존재하지 않는 항목입니다.");

  const slug = await generateUniqueSlug(supabase, `${source.title}-사본`);

  const { data, error } = await supabase
    .from("press_items")
    .insert({
      slug,
      type: source.type,
      status: "draft",
      title: `${source.title} (사본)`,
      summary: source.summary,
      body_json: source.bodyJson,
      publish_at: null,
      source_name: source.sourceName,
      source_url: source.sourceUrl ?? null,
      thumbnail_url: source.thumbnailUrl ?? null,
      hero_image_url: source.heroImageUrl ?? null,
      image_alt: source.imageAlt ?? null,
      attachment_url: source.attachmentUrl ?? null,
      attachment_label: source.attachmentLabel ?? null,
      author: source.author ?? null,
      featured: false,
      tags: source.tags,
      related_ids: [],
      seo_title: source.seoTitle ?? null,
      seo_description: source.seoDescription ?? null,
      og_image_url: source.ogImageUrl ?? null,
      created_by: actor.userId,
      updated_by: actor.userId,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "복제에 실패했습니다.");
  const record = mapRow(data as PressRow);
  await logAudit(record.id, actor.userId, "duplicate", { sourceId: id });
  return record;
}

export async function softDeletePressItem(id: string, actor: AdminProfile): Promise<void> {
  if (actor.role !== "admin") throw new Error("휴지통 이동은 admin 권한이 필요합니다.");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("press_items")
    .update({ status: "archived", deleted_at: new Date().toISOString(), updated_by: actor.userId })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await logAudit(id, actor.userId, "archive", {});
}

export async function restorePressItem(id: string, actor: AdminProfile): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("press_items")
    .update({ status: "draft", deleted_at: null, updated_by: actor.userId })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await logAudit(id, actor.userId, "restore", {});
}

/** Vercel Cron이 호출: 예약 발행 시각이 지난 글을 발행 처리한다. actor가 없으므로 service role 사용. */
export async function publishDueScheduledItems(): Promise<number> {
  const admin = createAdminSupabaseClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await admin
    .from("press_items")
    .update({ status: "published" })
    .eq("status", "scheduled")
    .lte("publish_at", nowIso)
    .select("id");

  if (error) throw new Error(error.message);

  const ids = (data ?? []) as { id: string }[];
  if (ids.length > 0) {
    await admin
      .from("press_audit_log")
      .insert(ids.map((row) => ({ press_item_id: row.id, actor_id: null, action: "auto_publish", metadata: {} })));
  }
  return ids.length;
}
