"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PRESS_STATUS_LABELS,
  PRESS_TYPE_FILTER_OPTIONS,
  PRESS_TYPE_LABELS,
  filterAdminRecords,
  formatDateTimeDisplay,
  type AdminListQuery,
  type PressRecord,
  type PressStatus,
} from "../../../lib/press-types";
import type { AdminRole } from "../../../lib/admin-auth";

const STATUS_OPTIONS: { value: PressStatus | "all"; label: string }[] = [
  { value: "all", label: "전체 상태" },
  { value: "draft", label: "초안" },
  { value: "in_review", label: "검수 대기" },
  { value: "scheduled", label: "예약" },
  { value: "published", label: "발행" },
  { value: "ended", label: "게시 종료" },
];

export default function AdminPressListClient({ role }: { role: AdminRole }) {
  const [items, setItems] = useState<PressRecord[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState<AdminListQuery>({ q: "", type: "all", status: "all", sort: "updated_desc" });
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setError("");
    const res = await fetch("/api/admin/press");
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || "목록을 불러오지 못했습니다.");
      return;
    }
    setItems(body.items ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => (items ? filterAdminRecords(items, query) : []), [items, query]);

  async function handleDuplicate(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/press/${id}/duplicate`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      window.alert(body.error || "복제에 실패했습니다.");
      return;
    }
    load();
  }

  async function handleTrash(id: string) {
    if (!window.confirm("이 항목을 휴지통으로 이동하시겠습니까?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/press/${id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      window.alert(body.error || "휴지통 이동에 실패했습니다.");
      return;
    }
    load();
  }

  return (
    <div>
      <div className="admin-filters">
        <div className="field">
          <label htmlFor="admin-q">검색</label>
          <input
            id="admin-q"
            type="search"
            placeholder="제목, 요약, 매체명, slug"
            value={query.q}
            onChange={(e) => setQuery((q) => ({ ...q, q: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="admin-type">유형</label>
          <select
            id="admin-type"
            value={query.type}
            onChange={(e) => setQuery((q) => ({ ...q, type: e.target.value as typeof q.type }))}
          >
            {PRESS_TYPE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="admin-status">상태</label>
          <select
            id="admin-status"
            value={query.status}
            onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value as typeof q.status }))}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="admin-sort">정렬</label>
          <select
            id="admin-sort"
            value={query.sort}
            onChange={(e) => setQuery((q) => ({ ...q, sort: e.target.value as typeof q.sort }))}
          >
            <option value="updated_desc">최근 수정순</option>
            <option value="updated_asc">오래된 수정순</option>
          </select>
        </div>
      </div>

      {error && <p className="form-message form-message--err">{error}</p>}

      {items === null ? (
        <p className="section-subtitle">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="section-subtitle">조건에 맞는 보도자료가 없습니다.</p>
      ) : (
        <div className="board board--admin">
          <div className="board__head">
            <span className="board__col board__col--title">제목</span>
            <span className="board__col board__col--source">유형 / 상태</span>
            <span className="board__col board__col--date">수정일(KST)</span>
            <span className="board__col">관리</span>
          </div>
          {filtered.map((item) => (
            <div key={item.id} className="board__row">
              <span className="board__col board__col--title">{item.title}</span>
              <span className="board__col board__col--source">
                {PRESS_TYPE_LABELS[item.type]} · {PRESS_STATUS_LABELS[item.status]}
              </span>
              <span className="board__col board__col--date">{formatDateTimeDisplay(item.updatedAt)}</span>
              <span className="board__col board__actions">
                <Link href={`/admin/press/${item.id}/edit`}>수정</Link>
                <Link href={`/admin/press/${item.id}/preview`}>미리보기</Link>
                <button type="button" disabled={busyId === item.id} onClick={() => handleDuplicate(item.id)}>
                  복제
                </button>
                {role === "admin" && (
                  <button type="button" disabled={busyId === item.id} onClick={() => handleTrash(item.id)}>
                    휴지통
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
