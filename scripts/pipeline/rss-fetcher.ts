/**
 * RSS Fetcher Module
 *
 * 정치/경제/사회 카테고리별 RSS 피드를 수집하고 정규화합니다.
 */

import Parser from "rss-parser";
import type { NewsCategory } from "@/types/database";

/**
 * 정규화된 RSS 아이템
 */
export interface RawNewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  category: NewsCategory;
  sourceName: string;
}

/**
 * RSS 피드 설정
 * 카테고리별로 여러 언론사 피드를 수집
 */
const RSS_FEEDS: Record<NewsCategory, { url: string; sourceName: string }[]> = {
  politics: [
    { url: "http://imnews.imbc.com/rss/news/news_01.xml", sourceName: "MBC" },
    { url: "http://rss.donga.com/politics.xml", sourceName: "동아일보" },
    {
      url: "http://rss.nocutnews.co.kr/NocutPolitics.xml",
      sourceName: "노컷뉴스",
    },
  ],
  economy: [
    { url: "http://imnews.imbc.com/rss/news/news_04.xml", sourceName: "MBC" },
    { url: "http://rss.donga.com/economy.xml", sourceName: "동아일보" },
    { url: "http://rss.hankyung.com/economy.xml", sourceName: "한국경제" },
  ],
  society: [
    { url: "http://imnews.imbc.com/rss/news/news_05.xml", sourceName: "MBC" },
    { url: "http://rss.donga.com/national.xml", sourceName: "동아일보" },
    {
      url: "http://rss.nocutnews.co.kr/NocutSocial.xml",
      sourceName: "노컷뉴스",
    },
  ],
};

/**
 * RSS 파서 인스턴스
 */
const parser = new Parser({
  customFields: {
    item: ["description", "pubDate"],
  },
  timeout: 10000, // 10초 타임아웃
});

/**
 * HTML 태그 제거
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * 날짜 정규화 (ISO 8601 형식)
 */
function normalizeDate(dateStr: string | undefined): string {
  if (!dateStr) {
    return new Date().toISOString();
  }
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * 단일 피드에서 뉴스 아이템 수집
 */
async function fetchSingleFeed(
  feedConfig: { url: string; sourceName: string },
  category: NewsCategory
): Promise<RawNewsItem[]> {
  try {
    console.log(`[RSS] Fetching: ${feedConfig.url}`);
    const feed = await parser.parseURL(feedConfig.url);

    const items: RawNewsItem[] = (feed.items || []).map((item) => ({
      title: stripHtml(item.title || "제목 없음"),
      link: item.link || "",
      pubDate: normalizeDate(item.pubDate || item.isoDate),
      description: stripHtml(item.contentSnippet || item.content || item.description || ""),
      category,
      sourceName: feedConfig.sourceName,
    }));

    console.log(`[RSS] Fetched ${items.length} items from ${feedConfig.sourceName}`);
    return items;
  } catch (error) {
    console.error(
      `[RSS] Error fetching ${feedConfig.url}:`,
      error instanceof Error ? error.message : error
    );
    return []; // Graceful degradation - 실패해도 빈 배열 반환
  }
}

/**
 * 특정 카테고리의 모든 피드에서 뉴스 수집
 */
export async function fetchByCategory(
  category: NewsCategory
): Promise<RawNewsItem[]> {
  const feeds = RSS_FEEDS[category];
  const results = await Promise.allSettled(
    feeds.map((feed) => fetchSingleFeed(feed, category))
  );

  const items: RawNewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  return items;
}

/**
 * 모든 카테고리에서 뉴스 수집
 */
export async function fetchAllFeeds(): Promise<RawNewsItem[]> {
  console.log("[RSS] Starting to fetch all feeds...");

  const categories: NewsCategory[] = ["politics", "economy", "society"];
  const allItems: RawNewsItem[] = [];

  for (const category of categories) {
    const items = await fetchByCategory(category);
    allItems.push(...items);
    console.log(`[RSS] Category ${category}: ${items.length} items`);
  }

  console.log(`[RSS] Total items fetched: ${allItems.length}`);
  return allItems;
}

/**
 * 오늘 날짜의 뉴스만 필터링 (지난 24시간)
 */
export function filterRecentNews(
  items: RawNewsItem[],
  hoursAgo: number = 24
): RawNewsItem[] {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hoursAgo);

  const filtered = items.filter((item) => {
    const pubDate = new Date(item.pubDate);
    return pubDate >= cutoff;
  });

  console.log(
    `[RSS] Filtered to ${filtered.length} items from last ${hoursAgo} hours`
  );
  return filtered;
}

// CLI에서 직접 실행 시 테스트
if (require.main === module) {
  (async () => {
    console.log("=== RSS Fetcher Test ===");
    const items = await fetchAllFeeds();
    const recent = filterRecentNews(items, 24);

    console.log("\n=== Sample Items ===");
    recent.slice(0, 3).forEach((item, i) => {
      console.log(`\n[${i + 1}] ${item.category.toUpperCase()}`);
      console.log(`Title: ${item.title}`);
      console.log(`Source: ${item.sourceName}`);
      console.log(`Date: ${item.pubDate}`);
      console.log(`Link: ${item.link}`);
    });
  })();
}
