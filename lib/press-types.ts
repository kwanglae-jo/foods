/**
 * 서버/클라이언트 어디서나 안전하게 import 가능한 순수 타입·유틸.
 * Supabase I/O가 필요한 함수는 여기 두지 않는다 — 그런 함수는 lib/press.ts("server-only")에 있다.
 * 클라이언트 컴포넌트는 반드시 lib/press.ts가 아니라 이 파일에서 import해야 한다.
 */

export type PressType = "press-release" | "media-coverage" | "brand-news";
export type PressStatus = "draft" | "in_review" | "scheduled" | "published" | "ended" | "archived";
export type PressSort = "latest" | "oldest";

export const PRESS_TYPE_LABELS: Record<PressType, string> = {
  "press-release": "공식 보도자료",
  "media-coverage": "언론 보도",
  "brand-news": "브랜드 소식",
};

export const PRESS_TYPE_FILTER_OPTIONS: { value: PressType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "press-release", label: "공식 보도자료" },
  { value: "media-coverage", label: "언론 보도" },
  { value: "brand-news", label: "브랜드 소식" },
];

export const PRESS_STATUS_LABELS: Record<PressStatus, string> = {
  draft: "초안",
  in_review: "검수 대기",
  scheduled: "예약",
  published: "발행",
  ended: "게시 종료",
  archived: "휴지통",
};

export const PRESS_PAGE_SIZE = 9;

/* ---------------------------------- 포맷터/유틸 ---------------------------------- */

export function formatDateDisplay(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}

export function formatDateTimeDisplay(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")} ${get("hour")}:${get("minute")} (KST)`;
}

export function getYearInSeoul(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric" }).format(new Date(iso));
}

export function toKstDateTimeLocalValue(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function fromKstDateTimeLocalValue(value: string): string {
  const normalized = value.length === 16 ? `${value}:00` : value;
  return new Date(`${normalized}+09:00`).toISOString();
}

export function slugify(title: string): string {
  const base = title
    .normalize("NFC")
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return base || "press";
}

/* ---------------------------------- 타입 ---------------------------------- */

/** DB 원본에 가까운 관리자용 레코드 (bodyJson 포함). */
export type PressRecord = {
  id: string;
  slug: string;
  type: PressType;
  status: PressStatus;
  title: string;
  summary: string;
  bodyJson: unknown;
  publishAt: string | null;
  endedAt: string | null;
  sourceName: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  imageAlt?: string;
  attachmentUrl?: string;
  attachmentLabel?: string;
  author?: string;
  featured: boolean;
  tags: string[];
  relatedIds: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

/** 공개 페이지에서 사용하는 경량 타입 (본문은 렌더링된 안전한 HTML). */
export type PressItem = {
  id: string;
  slug: string;
  type: PressType;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  sourceName: string;
  sourceUrl?: string;
  thumbnail?: string;
  heroImage?: string;
  imageAlt?: string;
  attachmentUrl?: string;
  attachmentLabel?: string;
  author?: string;
  featured: boolean;
  tags: string[];
  relatedIds: string[];
  status: PressStatus;
};

/* ------------------------------ 공개 목록 필터/정렬/페이지 ------------------------------ */

export type PressListQuery = {
  type: PressType | "all";
  year: string;
  q: string;
  sort: PressSort;
  page: number;
};

export type PressListResult = {
  items: PressItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  availableYears: string[];
};

export function getAvailableYears(all: PressItem[]): string[] {
  const years = new Set(all.map((item) => getYearInSeoul(item.publishedAt)));
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function queryPressItems(all: PressItem[], query: PressListQuery): PressListResult {
  const q = query.q.trim().toLowerCase();

  let filtered = all.filter((item) => {
    if (query.type !== "all" && item.type !== query.type) return false;
    if (query.year !== "all" && getYearInSeoul(item.publishedAt) !== query.year) return false;
    if (q) {
      const haystack = `${item.title} ${item.summary} ${item.sourceName}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered = filtered.sort((a, b) =>
    query.sort === "oldest"
      ? a.publishedAt.localeCompare(b.publishedAt)
      : b.publishedAt.localeCompare(a.publishedAt)
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PRESS_PAGE_SIZE));
  const page = Math.min(Math.max(1, query.page), totalPages);
  const items = filtered.slice(0, page * PRESS_PAGE_SIZE);

  return {
    items,
    total,
    page,
    pageSize: PRESS_PAGE_SIZE,
    totalPages,
    hasMore: items.length < total,
    availableYears: getAvailableYears(all),
  };
}

export function getAdjacentItems(
  all: PressItem[],
  id: string
): { prev: PressItem | null; next: PressItem | null } {
  const sorted = [...all].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const index = sorted.findIndex((item) => item.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export function getRelatedItems(all: PressItem[], item: PressItem, limit = 3): PressItem[] {
  const byId = new Map(all.map((i) => [i.id, i]));
  if (item.relatedIds.length > 0) {
    const explicit = item.relatedIds
      .map((id) => byId.get(id))
      .filter((i): i is PressItem => i !== undefined && i.id !== item.id);
    if (explicit.length > 0) return explicit.slice(0, limit);
  }
  return all
    .filter((i) => i.id !== item.id && i.type === item.type)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/* ------------------------------ 관리자 목록 필터/정렬 ------------------------------ */

export type AdminListQuery = {
  q: string;
  type: PressType | "all";
  status: PressStatus | "all";
  sort: "updated_desc" | "updated_asc";
};

export function filterAdminRecords(records: PressRecord[], query: AdminListQuery): PressRecord[] {
  const q = query.q.trim().toLowerCase();
  let filtered = records.filter((r) => {
    if (query.type !== "all" && r.type !== query.type) return false;
    if (query.status !== "all" && r.status !== query.status) return false;
    if (q) {
      const haystack = `${r.title} ${r.summary} ${r.sourceName} ${r.slug}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered = filtered.sort((a, b) =>
    query.sort === "updated_asc"
      ? a.updatedAt.localeCompare(b.updatedAt)
      : b.updatedAt.localeCompare(a.updatedAt)
  );

  return filtered;
}
