"use client";

import { useState } from "react";

const PROVINCES = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const BUDGETS = [
  "5천만원 이하",
  "5천만원 ~ 1억원",
  "1억원 ~ 1.5억원",
  "1.5억원 이상",
];

type Status = "idle" | "loading" | "ok" | "error";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "전송에 실패했습니다.");
      }

      setStatus("ok");
      setMessage("상담 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">이름</label>
          <input id="name" name="name" type="text" placeholder="홍길동" required />
        </div>
        <div className="field">
          <label htmlFor="phone">연락처</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="010-0000-0000"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="province">희망 지역 (시/도)</label>
          <select id="province" name="province" defaultValue="" required>
            <option value="" disabled>
              선택해주세요
            </option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="district">희망 지역 (시/군/구)</label>
          <input
            id="district"
            name="district"
            type="text"
            placeholder="예) 강남구"
          />
        </div>
      </div>

      <div className="field field--full">
        <label htmlFor="budget">창업 가능 예산</label>
        <select id="budget" name="budget" defaultValue="" required>
          <option value="" disabled>
            선택해주세요
          </option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="field field--full">
        <label htmlFor="message">문의 내용 (선택)</label>
        <textarea
          id="message"
          name="message"
          placeholder="궁금한 점을 자유롭게 남겨주세요."
        />
      </div>

      <button
        type="submit"
        className="btn-primary form-submit"
        data-gtm-label="가맹 상담 신청하기"
        disabled={status === "loading"}
      >
        {status === "loading" ? "전송 중..." : "가맹 상담 신청하기"}
      </button>

      {message && (
        <p
          className={`form-message ${
            status === "ok" ? "form-message--ok" : "form-message--err"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
