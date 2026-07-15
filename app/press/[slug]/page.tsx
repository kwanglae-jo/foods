import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PressDetailView from "../../components/press/PressDetailView";
import { listPublishedPressItems } from "../../../lib/press";
import { getAdjacentItems, getRelatedItems } from "../../../lib/press-types";
import { SITE_CONFIG, SITE_URL } from "../../../lib/site-config";
import { jsonLdScript } from "../../../lib/json-ld";

export const dynamic = "force-dynamic";

type Params = { slug: string };

async function loadItem(slug: string) {
  const all = await listPublishedPressItems();
  const item = all.find((i) => i.slug === slug);
  return { all, item };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await loadItem(slug);
  if (!item) {
    return { title: "페이지를 찾을 수 없습니다 | 샤브광 뉴스룸" };
  }

  const title = `${item.title} | 샤브광 뉴스룸`;
  const description = item.summary;
  const ogImage = item.heroImage ?? item.thumbnail ?? "/og-image.jpg";
  const url = `${SITE_URL}/press/${item.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/press/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      type: "article",
      url,
      locale: "ko_KR",
      publishedTime: item.publishedAt,
      modifiedTime: item.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: item.imageAlt || item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PressDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { all, item } = await loadItem(slug);
  if (!item) notFound();

  const { prev, next } = getAdjacentItems(all, item.id);
  const related = getRelatedItems(all, item, 3);

  const url = `${SITE_URL}/press/${item.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    image: item.heroImage ?? item.thumbnail ? [item.heroImage ?? item.thumbnail] : undefined,
    author: item.author
      ? { "@type": "Person", name: item.author }
      : { "@type": "Organization", name: SITE_CONFIG.brandName },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.brandName,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "뉴스룸", item: `${SITE_URL}/press` },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: url,
      },
    ],
  };

  return (
    <main>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />
      <PressDetailView item={item} related={related} prev={prev} next={next} />
      <Footer />
    </main>
  );
}
