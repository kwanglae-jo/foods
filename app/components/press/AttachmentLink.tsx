"use client";

import { pushGtmEvent } from "../../../lib/gtm";

export default function AttachmentLink({
  href,
  label,
  articleId,
  articleType,
  articleTitle,
}: {
  href: string;
  label: string;
  articleId: string;
  articleType: string;
  articleTitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-outline press-attachment-link"
      onClick={() =>
        pushGtmEvent("press_attachment_download", {
          article_id: articleId,
          article_type: articleType,
          article_title: articleTitle,
        })
      }
    >
      {label} 다운로드
    </a>
  );
}
