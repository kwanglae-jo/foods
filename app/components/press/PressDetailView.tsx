import Link from "next/link";
import PressImage from "./PressImage";
import PressBadge from "./PressBadge";
import PressCard from "./PressCard";
import ShareButtons from "./ShareButtons";
import SourceLink from "./SourceLink";
import AttachmentLink from "./AttachmentLink";
import { formatDateDisplay, type PressItem } from "../../../lib/press-types";
import { SITE_CONFIG, SITE_URL } from "../../../lib/site-config";

export default function PressDetailView({
  item,
  related,
  prev,
  next,
  isPreview = false,
}: {
  item: PressItem;
  related: PressItem[];
  prev: PressItem | null;
  next: PressItem | null;
  isPreview?: boolean;
}) {
  const mediaContact = SITE_CONFIG.mediaContact;
  const hasMediaContact = Boolean(mediaContact.name || mediaContact.email || mediaContact.phone);

  return (
    <>
      {isPreview && (
        <div className="press-preview-banner" role="status">
          관리자 미리보기 화면입니다. 실제 방문자에게는 발행 후에만 노출됩니다.
        </div>
      )}

      <section className="section page-header press-detail-header">
        <div className="container">
          <nav aria-label="이전 페이지">
            <Link href="/press" className="press-detail__back">
              ← 뉴스룸 목록으로
            </Link>
          </nav>
          <PressBadge type={item.type} />
          <h1 className="press-detail__title">{item.title}</h1>
          <p className="press-detail__summary">{item.summary}</p>
          <p className="press-detail__meta">
            <span>{item.sourceName}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={item.publishedAt}>{formatDateDisplay(item.publishedAt)}</time>
            {item.author && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{item.author}</span>
              </>
            )}
          </p>
        </div>
      </section>

      <section className="section press-detail-body-section">
        <div className="container press-detail-container">
          <div className="press-detail__hero">
            <PressImage src={item.heroImage ?? item.thumbnail} alt={item.imageAlt} variant="hero" priority />
          </div>

          {item.body ? (
            // renderPressBodyHtml은 화이트리스트 확장으로만 생성된 안전한 HTML을 반환한다.
            <div className="press-detail__body" dangerouslySetInnerHTML={{ __html: item.body }} />
          ) : (
            <p className="press-detail__body-empty">등록된 본문이 없습니다.</p>
          )}

          <div className="press-detail__actions">
            {item.sourceUrl && (
              <SourceLink
                href={item.sourceUrl}
                articleId={item.id}
                articleType={item.type}
                articleTitle={item.title}
                sourceName={item.sourceName}
              />
            )}
            {item.attachmentUrl && (
              <AttachmentLink
                href={item.attachmentUrl}
                label={item.attachmentLabel || "첨부파일"}
                articleId={item.id}
                articleType={item.type}
                articleTitle={item.title}
              />
            )}
            <ShareButtons
              url={`${SITE_URL}/press/${item.slug}`}
              title={item.title}
              articleId={item.id}
              articleType={item.type}
            />
          </div>

          {item.type === "press-release" && hasMediaContact && (
            <div className="press-detail__media-contact">
              <h2>미디어 문의</h2>
              <ul>
                {mediaContact.name && <li>담당자: {mediaContact.name}</li>}
                {mediaContact.email && (
                  <li>
                    이메일: <a href={`mailto:${mediaContact.email}`}>{mediaContact.email}</a>
                  </li>
                )}
                {mediaContact.phone && <li>연락처: {mediaContact.phone}</li>}
              </ul>
            </div>
          )}

          <nav className="press-detail__adjacent" aria-label="이전글 다음글">
            {prev ? (
              <Link href={`/press/${prev.slug}`} className="press-detail__adjacent-link">
                <span>이전 글</span>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/press/${next.slug}`} className="press-detail__adjacent-link press-detail__adjacent-link--next">
                <span>다음 글</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          {related.length > 0 && (
            <div className="press-detail__related">
              <h2>관련 콘텐츠</h2>
              <div className="press-grid press-grid--related">
                {related.map((r) => (
                  <PressCard key={r.id} item={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
