import PressImage from "./PressImage";
import PressBadge from "./PressBadge";
import TrackedPressLink from "./TrackedPressLink";
import { formatDateDisplay, type PressItem } from "../../../lib/press";

export default function FeaturedArticle({ item }: { item: PressItem }) {
  return (
    <article className="press-featured hover-lift">
      <div className="press-featured__media">
        <PressImage src={item.heroImage ?? item.thumbnail} alt={item.imageAlt} variant="hero" priority />
      </div>
      <div className="press-featured__body">
        <div className="press-featured__eyebrow">
          <PressBadge type={item.type} />
          <span className="press-featured__label">이번 주 대표 소식</span>
        </div>
        <h2 className="press-featured__title">
          <TrackedPressLink
            href={`/press/${item.slug}`}
            className="press-featured__link"
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
        </h2>
        <p className="press-featured__summary">{item.summary}</p>
        <div className="press-featured__meta">
          <span>{item.sourceName}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={item.publishedAt}>{formatDateDisplay(item.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}
