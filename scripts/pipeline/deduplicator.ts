/**
 * Deduplicator Module
 *
 * URL 유사도 및 제목 유사도 기반으로 중복 뉴스를 탐지하고 필터링합니다.
 */

import type { RawNewsItem } from "./rss-fetcher";

/**
 * URL 정규화 - 쿼리 파라미터, 프래그먼트 제거
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // 트래킹 파라미터 제거
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "ref",
      "source",
    ];
    trackingParams.forEach((param) => parsed.searchParams.delete(param));
    // 프래그먼트 제거
    parsed.hash = "";
    return parsed.toString().toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/**
 * 제목 정규화 - 공백, 특수문자 정리
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s\-_.,!?'"]/g, "") // 공백 및 구두점 제거
    .replace(/[^\uAC00-\uD7AF\u1100-\u11FF\w]/g, ""); // 한글, 영숫자만 유지
}

/**
 * 두 문자열 간의 유사도 계산 (Jaccard Index 기반)
 * 0 ~ 1 사이 값 반환 (1이 완전 일치)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.split(""));
  const set2 = new Set(str2.split(""));

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * N-gram 기반 유사도 계산 (더 정확한 텍스트 비교)
 */
function calculateNgramSimilarity(
  str1: string,
  str2: string,
  n: number = 2
): number {
  function getNgrams(str: string, n: number): Set<string> {
    const ngrams = new Set<string>();
    for (let i = 0; i <= str.length - n; i++) {
      ngrams.add(str.substring(i, i + n));
    }
    return ngrams;
  }

  const ngrams1 = getNgrams(str1, n);
  const ngrams2 = getNgrams(str2, n);

  const intersection = new Set([...ngrams1].filter((x) => ngrams2.has(x)));
  const union = new Set([...ngrams1, ...ngrams2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * 두 뉴스 아이템이 중복인지 판단
 */
function isDuplicate(
  item1: RawNewsItem,
  item2: RawNewsItem,
  urlThreshold: number = 0.95,
  titleThreshold: number = 0.7
): boolean {
  // 1. URL이 동일하면 확실히 중복
  const url1 = normalizeUrl(item1.link);
  const url2 = normalizeUrl(item2.link);

  if (url1 === url2) {
    return true;
  }

  // 2. URL 유사도 체크 (같은 기사의 다른 버전)
  const urlSimilarity = calculateSimilarity(url1, url2);
  if (urlSimilarity >= urlThreshold) {
    return true;
  }

  // 3. 제목 유사도 체크 (같은 내용의 다른 언론사 보도)
  const title1 = normalizeTitle(item1.title);
  const title2 = normalizeTitle(item2.title);

  // 정규화된 제목이 동일하면 중복
  if (title1 === title2) {
    return true;
  }

  // N-gram 유사도로 비슷한 제목 탐지
  const titleSimilarity = calculateNgramSimilarity(title1, title2, 2);
  if (titleSimilarity >= titleThreshold) {
    return true;
  }

  return false;
}

/**
 * 중복 제거 옵션
 */
export interface DeduplicatorOptions {
  /** URL 유사도 임계값 (기본: 0.95) */
  urlThreshold?: number;
  /** 제목 유사도 임계값 (기본: 0.7) */
  titleThreshold?: number;
  /** 같은 카테고리 내에서만 중복 체크할지 여부 (기본: true) */
  withinCategoryOnly?: boolean;
}

/**
 * 뉴스 아이템 목록에서 중복 제거
 *
 * @param items 원본 뉴스 아이템 배열
 * @param options 중복 제거 옵션
 * @returns 중복이 제거된 뉴스 아이템 배열
 */
export function deduplicateNews(
  items: RawNewsItem[],
  options: DeduplicatorOptions = {}
): RawNewsItem[] {
  const {
    urlThreshold = 0.95,
    titleThreshold = 0.7,
    withinCategoryOnly = true,
  } = options;

  console.log(`[Dedup] Starting deduplication of ${items.length} items...`);

  // 발행일 기준 내림차순 정렬 (최신 기사 우선)
  const sorted = [...items].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  const unique: RawNewsItem[] = [];
  const seen = new Map<string, RawNewsItem[]>(); // 카테고리별 중복 체크용

  for (const item of sorted) {
    const category = withinCategoryOnly ? item.category : "all";
    const candidates = seen.get(category) || [];

    const hasDuplicate = candidates.some((existing) =>
      isDuplicate(item, existing, urlThreshold, titleThreshold)
    );

    if (!hasDuplicate) {
      unique.push(item);
      seen.set(category, [...candidates, item]);
    }
  }

  const removed = items.length - unique.length;
  console.log(
    `[Dedup] Removed ${removed} duplicates, ${unique.length} items remaining`
  );

  return unique;
}

/**
 * 카테고리별 뉴스 그룹화
 */
export function groupByCategory(
  items: RawNewsItem[]
): Record<string, RawNewsItem[]> {
  const grouped: Record<string, RawNewsItem[]> = {
    politics: [],
    economy: [],
    society: [],
  };

  for (const item of items) {
    if (item.category in grouped) {
      grouped[item.category].push(item);
    }
  }

  return grouped;
}

// CLI 테스트
if (require.main === module) {
  const testItems: RawNewsItem[] = [
    {
      title: "대통령, 신년 기자회견에서 경제 정책 발표",
      link: "https://example.com/news/12345",
      pubDate: new Date().toISOString(),
      description: "대통령이 신년 기자회견을 열고...",
      category: "politics",
      sourceName: "테스트뉴스",
    },
    {
      title: "대통령 신년 기자회견서 경제정책 발표",
      link: "https://example.com/news/12346",
      pubDate: new Date().toISOString(),
      description: "대통령이 신년 기자회견에서...",
      category: "politics",
      sourceName: "다른뉴스",
    },
    {
      title: "코스피 3000 돌파, 사상 최고치 경신",
      link: "https://example.com/news/22222",
      pubDate: new Date().toISOString(),
      description: "한국 증시가...",
      category: "economy",
      sourceName: "경제뉴스",
    },
  ];

  console.log("=== Deduplicator Test ===");
  console.log(`Input: ${testItems.length} items`);

  const unique = deduplicateNews(testItems);
  console.log(`Output: ${unique.length} items`);

  unique.forEach((item) => {
    console.log(`- [${item.category}] ${item.title}`);
  });
}
