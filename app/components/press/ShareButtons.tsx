"use client";

import { useState } from "react";
import { pushGtmEvent } from "../../../lib/gtm";

export default function ShareButtons({
  url,
  title,
  articleId,
  articleType,
}: {
  url: string;
  title: string;
  articleId: string;
  articleType: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    pushGtmEvent("press_share", { article_id: articleId, article_type: articleType, article_title: title });

    const nav: Navigator = navigator;

    if (nav.share) {
      try {
        await nav.share({ title, url });
      } catch {
        // 사용자가 공유를 취소한 경우 등은 조용히 무시한다.
      }
      return;
    }

    try {
      await nav.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API 미지원 환경에서는 조용히 실패한다.
    }
  }

  return (
    <button type="button" className="btn-outline press-share" onClick={handleShare} aria-live="polite">
      {copied ? "링크가 복사되었습니다" : "링크 공유"}
    </button>
  );
}
