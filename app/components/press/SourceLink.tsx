"use client";

import { pushGtmEvent } from "../../../lib/gtm";

export default function SourceLink({
  href,
  articleId,
  articleType,
  articleTitle,
  sourceName,
}: {
  href: string;
  articleId: string;
  articleType: string;
  articleTitle: string;
  sourceName: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary press-source-link"
      onClick={() =>
        pushGtmEvent("press_source_click", {
          article_id: articleId,
          article_type: articleType,
          article_title: articleTitle,
          source_name: sourceName,
        })
      }
    >
      원문 기사 보기 ↗
    </a>
  );
}
