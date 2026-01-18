/**
 * 동적 사이트맵 생성
 * Next.js App Router sitemap.ts 규격 준수
 */

import type { MetadataRoute } from "next";
import { getAllBriefingDates } from "@/lib/data/briefings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dailywrap.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 기본 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 동적 아카이브 페이지 (각 날짜별 브리핑)
  let archivePages: MetadataRoute.Sitemap = [];

  try {
    const dates = await getAllBriefingDates();
    archivePages = dates.map((date) => ({
      url: `${siteUrl}/archive/${date}`,
      lastModified: new Date(date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("[sitemap] 브리핑 날짜 조회 실패:", error);
  }

  return [...staticPages, ...archivePages];
}
