/**
 * Rank Prompt Module
 *
 * 뉴스 중요도 랭킹을 위한 프롬프트 및 함수를 제공합니다.
 * - 카테고리 내 중요도 순위 결정 (1-5)
 * - 사회적 영향력, 시의성, 독자 관심도 기준
 */

import {
  sendMessageSafe,
  parseJsonResponse,
} from "@/lib/anthropic/client";
import type { SummarizedNews } from "./summarize";
import type { NewsCategory } from "@/types/database";

/**
 * 랭킹된 뉴스 타입
 */
export interface RankedNews extends SummarizedNews {
  importanceRank: number; // 1-5 (1이 가장 중요)
}

/**
 * 시스템 프롬프트 - 뉴스 중요도 평가자 역할 정의
 */
const SYSTEM_PROMPT = `당신은 뉴스 편집장으로서 기사의 중요도를 평가합니다.
바쁜 직장인 독자가 가장 먼저 알아야 할 뉴스를 선별하세요.

### 중요도 판단 기준
1. **사회적 영향력**: 많은 사람에게 영향을 미치는 뉴스
2. **시의성**: 지금 당장 알아야 하는 급보
3. **독자 관심도**: 직장인이 관심을 가질 만한 주제
4. **신뢰도**: 주요 언론사의 확인된 보도

### 랭킹 규칙
- 카테고리 내에서 1-5 순위 부여 (1이 가장 중요)
- 비슷한 중요도라도 순위를 명확히 구분
- 같은 순위는 허용하지 않음 (동점 없음)

JSON 형식으로 응답하세요.`;

/**
 * 랭킹 프롬프트 생성
 */
function createRankPrompt(
  newsList: SummarizedNews[],
  category: string
): string {
  const newsItems = newsList
    .map(
      (news, i) => `
[${i + 1}] ${news.headline}
- 요약: ${news.summary}
- 출처: ${news.sourceName}
`
    )
    .join("\n");

  return `다음 ${category} 카테고리의 ${newsList.length}개 뉴스에 중요도 순위를 부여해주세요.
가장 중요한 뉴스에 1위, 가장 덜 중요한 뉴스에 ${newsList.length}위를 부여하세요.

${newsItems}

### 출력 형식
\`\`\`json
[
  {"index": 0, "rank": 1, "reason": "중요도 판단 이유 (한 문장)"},
  {"index": 1, "rank": 2, "reason": "..."},
  ...
]
\`\`\``;
}

/**
 * Mock 랭킹 응답 생성 (DRY RUN 모드용)
 */
function createMockRankResponse(
  count: number
): { index: number; rank: number; reason: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    rank: i + 1,
    reason: `[Mock] 순서대로 ${i + 1}위 부여`,
  }));
}

/**
 * 카테고리별 뉴스 랭킹
 */
export async function rankNewsByCategory(
  newsList: SummarizedNews[],
  category: string
): Promise<RankedNews[]> {
  if (newsList.length === 0) {
    return [];
  }

  console.log(`[Rank] Ranking ${newsList.length} ${category} news items`);

  // 최대 5개까지만 랭킹 (상위 5개가 브리핑에 포함)
  const topNews = newsList.slice(0, 5);

  const mockResponse = JSON.stringify(createMockRankResponse(topNews.length));

  const response = await sendMessageSafe(
    {
      system: SYSTEM_PROMPT,
      message: createRankPrompt(topNews, category),
      maxTokens: 1024,
      temperature: 0.2, // 낮은 temperature로 일관된 판단
    },
    mockResponse
  );

  const parsed = parseJsonResponse<
    { index: number; rank: number; reason: string }[]
  >(response);

  // 랭킹 결과를 뉴스에 적용
  const rankedNews: RankedNews[] = topNews.map((news, i) => {
    const rankInfo = parsed.find((r) => r.index === i);
    return {
      ...news,
      importanceRank: rankInfo?.rank ?? i + 1,
    };
  });

  // 랭킹 순서로 정렬
  rankedNews.sort((a, b) => a.importanceRank - b.importanceRank);

  console.log(
    `[Rank] ${category} ranking completed:`,
    rankedNews.map((n) => `${n.importanceRank}. ${n.headline.slice(0, 20)}...`)
  );

  return rankedNews;
}

/**
 * 모든 카테고리의 뉴스 랭킹
 */
export async function rankAllNews(
  summarizedNews: SummarizedNews[]
): Promise<Record<NewsCategory, RankedNews[]>> {
  const categories: NewsCategory[] = ["politics", "economy", "society"];
  const result: Record<NewsCategory, RankedNews[]> = {
    politics: [],
    economy: [],
    society: [],
  };

  for (const category of categories) {
    const categoryNews = summarizedNews.filter(
      (news) => news.category === category
    );
    result[category] = await rankNewsByCategory(categoryNews, category);
  }

  return result;
}
