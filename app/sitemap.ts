import type { MetadataRoute } from "next";
import { listPublishedPressItems } from "../lib/press";
import { SITE_URL } from "../lib/site-config";

// 빌드 시점에 한 번만 생성되지 않도록 주기적으로 재생성한다 — 새로 발행된 보도자료가
// 재배포 없이도 1시간 내에 sitemap에 반영된다.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/press`, changeFrequency: "daily", priority: 0.8 },
  ];

  const items = await listPublishedPressItems();
  const pressRoutes: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${SITE_URL}/press/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...pressRoutes];
}
