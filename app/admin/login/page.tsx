"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
      body: JSON.stringify({ email, password }),
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
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field field--full">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary form-submit" disabled={loading}>
            {loading ? "확인 중..." : "로그인"}
          </button>
          {error && <p className="form-message form-message--err">{error}</p>}
        </form>
        <p className="press-admin-hint">
          계정이 없다면 Supabase Dashboard에서 초대받은 이메일로 로그인하세요. 설정 방법은{" "}
          <code>supabase/README.md</code> 참고.
        </p>
      </div>
    </main>
  );
}
