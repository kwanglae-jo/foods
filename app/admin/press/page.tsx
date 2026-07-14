"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Article = {
  id: number;
  date: string;
  source: string;
  title: string;
  content: string;
};

const EMPTY = { date: "", source: "", title: "", content: "" };

export default function AdminPressPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/press");
    const data = await res.json();
    setArticles(data.articles ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    const url = editingId ? `/api/admin/press/${editingId}` : "/api/admin/press";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setMessage(body.error || "저장에 실패했습니다.");
      return;
    }

    setForm(EMPTY);
    setEditingId(null);
    load();
  }

  function startEdit(a: Article) {
    setEditingId(a.id);
    setForm({ date: a.date, source: a.source, title: a.title, content: a.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleDelete(id: number) {
    if (!confirm("이 보도자료를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/press/${id}`, { method: "DELETE" });
    load();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main>
      <section className="section page-header" style={{ paddingBottom: 24 }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              textAlign: "left",
            }}
          >
            <div>
              <p className="eyebrow" style={{ textAlign: "left" }}>
                ADMIN
              </p>
              <h1 className="section-title section-title--left">
                보도자료 관리
              </h1>
            </div>
            <button type="button" className="btn-outline" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="date">날짜</label>
                <input
                  id="date"
                  type="text"
                  placeholder="2026.07"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="source">매체명</label>
                <input
                  id="source"
                  type="text"
                  placeholder="푸드투데이"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="field field--full">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="field field--full">
              <label htmlFor="content">본문</label>
              <textarea
                id="content"
                style={{ height: 160 }}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary form-submit" disabled={saving}>
              {saving ? "저장 중..." : editingId ? "수정하기" : "등록하기"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-outline"
                style={{ width: "100%", marginTop: 12 }}
                onClick={cancelEdit}
              >
                취소
              </button>
            )}
            {message && <p className="form-message form-message--err">{message}</p>}
          </form>

          <div style={{ marginTop: 48 }}>
            {loading ? (
              <p className="section-subtitle">불러오는 중...</p>
            ) : articles.length === 0 ? (
              <p className="section-subtitle">등록된 보도자료가 없습니다.</p>
            ) : (
              <div className="board board--admin">
                <div className="board__head">
                  <span className="board__col board__col--title">제목</span>
                  <span className="board__col board__col--source">매체</span>
                  <span className="board__col board__col--date">날짜</span>
                  <span className="board__col">관리</span>
                </div>
                {articles.map((a) => (
                  <div key={a.id} className="board__row">
                    <span className="board__col board__col--title">{a.title}</span>
                    <span className="board__col board__col--source">{a.source}</span>
                    <span className="board__col board__col--date">{a.date}</span>
                    <span className="board__col board__actions">
                      <button type="button" onClick={() => startEdit(a)}>
                        수정
                      </button>
                      <button type="button" onClick={() => handleDelete(a.id)}>
                        삭제
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
