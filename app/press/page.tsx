import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import PressFilters from "../components/press/PressFilters";
import PressCard from "../components/press/PressCard";
import FeaturedArticle from "../components/press/FeaturedArticle";
import EmptyState from "../components/press/EmptyState";
import LoadMoreLink from "../components/press/LoadMoreLink";
import { listPublishedPressItems, queryPressItems, type PressSort, type PressType } from "../../lib/press";
import { SITE_URL } from "../../lib/site-config";

export const dynamic = "force-dynamic";

const title = "뉴스룸 | 샤브광";
const description = "샤브광의 공식 보도자료와 언론 보도, 브랜드 소식을 한곳에서 확인하세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/press" },
  openGraph: {
    title,
    description,
    type: "website",
    url: `${SITE_URL}/press`,
    locale: "ko_KR",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "샤브광 뉴스룸" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

type SearchParams = { [key: string]: string | string[] | undefined };

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PressPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const type = (firstValue(sp.type) || "all") as PressType | "all";
  const year = firstValue(sp.year) || "all";
  const q = firstValue(sp.q) || "";
  const sort = (firstValue(sp.sort) || "latest") as PressSort;
  const page = Math.max(1, Number(firstValue(sp.page)) || 1);

  const allItems = await listPublishedPressItems();
  const isDefaultView = type === "all" && year === "all" && q === "" && sort === "latest" && page === 1;

  const featured = isDefaultView ? allItems.find((i) => i.featured) ?? allItems[0] : undefined;
  const pool = featured ? allItems.filter((i) => i.slug !== featured.slug) : allItems;

  const result = queryPressItems(pool, { type, year, q, sort, page });

  return (
    <main>
      <Nav />

      <section className="section page-header press-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">PRESS & NEWS</p>
            <h1 className="section-title">샤브광 뉴스룸</h1>
            <p className="section-subtitle">샤브광의 새로운 소식과 언론 보도를 확인하세요.</p>
          </Reveal>
        </div>
      </section>

      {featured && (
        <section className="section press-featured-section">
          <div className="container">
            <Reveal>
              <FeaturedArticle item={featured} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="section news press-list-section">
        <div className="container">
          <h2 className="sr-only">전체 소식 목록</h2>
          <Reveal>
            <Suspense fallback={null}>
              <PressFilters availableYears={result.availableYears} resultCount={result.total} />
            </Suspense>
          </Reveal>

          {allItems.length === 0 ? (
            <EmptyState
              title="등록된 콘텐츠가 없습니다"
              description="현재 게시된 보도자료·언론 보도가 없습니다. 새로운 소식이 등록되면 이곳에 표시됩니다."
            />
          ) : result.items.length === 0 ? (
            <EmptyState
              title="검색 결과가 없습니다"
              description="다른 키워드나 필터로 다시 검색해보세요."
            />
          ) : (
            <>
              <div className="press-grid">
                {result.items.map((item) => (
                  <PressCard key={item.id} item={item} />
                ))}
              </div>
              {result.hasMore && (
                <div className="press-load-more-wrap">
                  <Suspense fallback={null}>
                    <LoadMoreLink nextPage={result.page + 1} />
                  </Suspense>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
