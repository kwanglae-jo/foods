"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "로그인에 실패했습니다.");
      setLoading(false);
      return;
    }

    router.push("/admin/press");
    router.refresh();
  }

  return (
    <main className="section" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: 360 }}>
        <p className="eyebrow">ADMIN</p>
        <h1 className="section-title">관리자 로그인</h1>
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="field field--full">
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field field--full">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary form-submit"
            disabled={loading}
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
          {error && <p className="form-message form-message--err">{error}</p>}
        </form>
      </div>
    </main>
  );
}
