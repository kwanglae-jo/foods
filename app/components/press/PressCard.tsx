import PressImage from "./PressImage";
import PressBadge from "./PressBadge";
import TrackedPressLink from "./TrackedPressLink";
import { formatDateDisplay, type PressItem } from "../../../lib/press";

export default function PressCard({ item }: { item: PressItem }) {
  return (
    <article className="press-card hover-lift">
      <div className="press-card__media">
        <PressImage src={item.thumbnail} alt={item.imageAlt} variant="thumbnail" />
      </div>
      <div className="press-card__body">
        <PressBadge type={item.type} />
        <h3 className="press-card__title">
          <TrackedPressLink
            href={`/press/${item.slug}`}
            className="press-card__link"
            event="press_item_click"
            payload={{
              article_id: item.id,
              article_type: item.type,
              article_title: item.title,
              source_name: item.sourceName,
            }}
          >
            {item.title}
          </TrackedPressLink>
        </h3>
        <p className="press-card__summary">{item.summary}</p>
        <div className="press-card__meta">
          <span className="press-card__source">{item.sourceName}</span>
          <span className="press-card__dot" aria-hidden="true">
            ·
          </span>
          <time className="press-card__date" dateTime={item.publishedAt}>
            {formatDateDisplay(item.publishedAt)}
          </time>
        </div>
        <span className="press-card__cta" aria-hidden="true">
          {item.type === "media-coverage" ? "원문 보기" : "자세히 보기"} →
        </span>
      </div>
    </article>
  );
}
