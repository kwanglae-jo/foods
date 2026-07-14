"use client";

import { useState } from "react";
import type { PressArticle } from "../../lib/db";

export default function PressBoard({ articles }: { articles: PressArticle[] }) {
  const [selected, setSelected] = useState<PressArticle | null>(null);

  if (articles.length === 0) {
    return <p className="section-subtitle">등록된 보도자료가 없습니다.</p>;
  }

  return (
    <>
      <div className="board">
        <div className="board__head">
          <span className="board__col board__col--no">번호</span>
          <span className="board__col board__col--title">제목</span>
          <span className="board__col board__col--source">매체</span>
          <span className="board__col board__col--date">날짜</span>
        </div>
        {articles.map((a, i) => (
          <button
            key={a.id}
            type="button"
            className="board__row"
            onClick={() => setSelected(a)}
          >
            <span className="board__col board__col--no">
              {articles.length - i}
            </span>
            <span className="board__col board__col--title">{a.title}</span>
            <span className="board__col board__col--source">{a.source}</span>
            <span className="board__col board__col--date">{a.date}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal__close"
              onClick={() => setSelected(null)}
              aria-label="닫기"
            >
              ✕
            </button>
            <p className="modal__meta">
              {selected.date} · {selected.source}
            </p>
            <h3 className="modal__title">{selected.title}</h3>
            <p className="modal__body">{selected.content}</p>
          </div>
        </div>
      )}
    </>
  );
}
