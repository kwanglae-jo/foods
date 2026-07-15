"use client";

import { useEffect, useState } from "react";
import { PRESS_TYPE_LABELS, formatDateTimeDisplay, type PressRecord } from "../../../lib/press-types";

export default function AdminTrashListClient() {
  const [items, setItems] = useState<PressRecord[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setError("");
    const res = await fetch("/api/admin/press?trash=true");
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error || "휴지통 목록을 불러오지 못했습니다.");
      return;
    }
    setItems(body.items ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRestore(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/press/${id}/restore`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      window.alert(body.error || "복원에 실패했습니다.");
      return;
    }
    load();
  }

  if (items === null) return <p className="section-subtitle">불러오는 중...</p>;
  if (error) return <p className="form-message form-message--err">{error}</p>;
  if (items.length === 0) return <p className="section-subtitle">휴지통이 비어 있습니다.</p>;

  return (
    <div className="board board--admin">
      <div className="board__head">
        <span className="board__col board__col--title">제목</span>
        <span className="board__col board__col--source">유형</span>
        <span className="board__col board__col--date">이동일(KST)</span>
        <span className="board__col">관리</span>
      </div>
      {items.map((item) => (
        <div key={item.id} className="board__row">
          <span className="board__col board__col--title">{item.title}</span>
          <span className="board__col board__col--source">{PRESS_TYPE_LABELS[item.type]}</span>
          <span className="board__col board__col--date">{formatDateTimeDisplay(item.updatedAt)}</span>
          <span className="board__col board__actions">
            <button type="button" disabled={busyId === item.id} onClick={() => handleRestore(item.id)}>
              복원
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
