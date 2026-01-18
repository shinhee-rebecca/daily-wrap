/**
 * Summarize Prompt Module
 *
 * 뉴스 기사 요약을 위한 프롬프트 및 함수를 제공합니다.
 * - 한줄 헤드라인 생성
 * - 4-5문장 요약 생성
 * - 원문 복사 금지 (저작권 보호)
 */

import {
  sendMessageSafe,
  parseJsonResponse,
} from "@/lib/anthropic/client";
import type { RawNewsItem } from "../rss-fetcher";

/**
 * 요약 결과 타입
 */
export interface SummarizedNews {
  originalTitle: string;
  headline: string; // AI가 생성한 한줄 헤드라인
  summary: string; // 4-5문장 요약
  link: string;
  sourceName: string;
  category: string;
  pubDate: string;
}

/**
 * 시스템 프롬프트 - 뉴스 요약 AI의 역할 정의
 */
const SYSTEM_PROMPT = `당신은 한국 뉴스를 요약하는 전문 에디터입니다.
독자는 바쁜 직장인으로, 짧은 시간에 핵심 뉴스를 파악하고 싶어합니다.

### 핵심 규칙
1. **원문 문장 절대 복사 금지**: 저작권 문제로 원문의 문장을 그대로 사용하면 안됩니다.
2. **객관적 톤 유지**: 논평이나 의견 없이 팩트만 전달하세요.
3. **한국어로 작성**: 모든 응답은 자연스러운 한국어로 작성하세요.

### 출력 형식
각 뉴스에 대해 다음을 생성하세요:
- headline: 핵심을 담은 한줄 헤드라인 (15-25자)
- summary: 누가/무엇을/언제/왜를 담은 4-5문장 요약 (100-180자)

JSON 형식으로 응답하세요.`;

/**
 * 단일 뉴스 요약을 위한 프롬프트 생성
 */
function createSummarizePrompt(news: RawNewsItem): string {
  return `다음 뉴스를 요약해주세요.

### 원본 정보
- 제목: ${news.title}
- 설명: ${news.description || "(설명 없음)"}
- 출처: ${news.sourceName}
- 카테고리: ${news.category}

### 출력 형식
\`\`\`json
{
  "headline": "핵심을 담은 한줄 헤드라인",
  "summary": "4-5문장으로 요약된 내용"
}
\`\`\``;
}

/**
 * 배치 뉴스 요약을 위한 프롬프트 생성
 */
function createBatchSummarizePrompt(newsList: RawNewsItem[]): string {
  const newsItems = newsList
    .map(
      (news, i) => `
[뉴스 ${i + 1}]
- 제목: ${news.title}
- 설명: ${news.description || "(설명 없음)"}
- 출처: ${news.sourceName}
- 카테고리: ${news.category}
`
    )
    .join("\n");

  return `다음 ${newsList.length}개 뉴스를 각각 요약해주세요.

${newsItems}

### 출력 형식
\`\`\`json
[
  {"index": 0, "headline": "...", "summary": "..."},
  {"index": 1, "headline": "...", "summary": "..."},
  ...
]
\`\`\``;
}

/**
 * Mock 응답 생성 (DRY RUN 모드용)
 */
function createMockResponse(news: RawNewsItem): { headline: string; summary: string } {
  return {
    headline: `[Mock] ${news.title.slice(0, 20)}...`,
    summary: `이 뉴스는 ${news.category} 분야의 소식입니다. ${news.sourceName}에서 보도했습니다. 해당 사안은 최근 주목받고 있는 이슈로, 관련 당사자들의 반응이 주목됩니다. 향후 추가적인 전개가 예상됩니다. 자세한 내용은 원문을 참고하세요.`,
  };
}

/**
 * 단일 뉴스 요약
 */
export async function summarizeNews(
  news: RawNewsItem
): Promise<SummarizedNews> {
  const mockResponse = JSON.stringify(createMockResponse(news));

  const response = await sendMessageSafe(
    {
      system: SYSTEM_PROMPT,
      message: createSummarizePrompt(news),
      maxTokens: 512,
      temperature: 0.3,
    },
    mockResponse
  );

  const parsed = parseJsonResponse<{ headline: string; summary: string }>(response);

  return {
    originalTitle: news.title,
    headline: parsed.headline,
    summary: parsed.summary,
    link: news.link,
    sourceName: news.sourceName,
    category: news.category,
    pubDate: news.pubDate,
  };
}

/**
 * 배치 뉴스 요약 (여러 뉴스를 한 번에 처리하여 API 호출 최소화)
 */
export async function summarizeNewsBatch(
  newsList: RawNewsItem[]
): Promise<SummarizedNews[]> {
  if (newsList.length === 0) {
    return [];
  }

  // 배치 크기 제한 (Claude 컨텍스트 제한 고려)
  const BATCH_SIZE = 10;
  const results: SummarizedNews[] = [];

  for (let i = 0; i < newsList.length; i += BATCH_SIZE) {
    const batch = newsList.slice(i, i + BATCH_SIZE);
    console.log(
      `[Summarize] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(newsList.length / BATCH_SIZE)}`
    );

    const mockResponses = batch.map((news, idx) => ({
      index: idx,
      ...createMockResponse(news),
    }));

    const response = await sendMessageSafe(
      {
        system: SYSTEM_PROMPT,
        message: createBatchSummarizePrompt(batch),
        maxTokens: 2048,
        temperature: 0.3,
      },
      JSON.stringify(mockResponses)
    );

    const parsed = parseJsonResponse<
      { index: number; headline: string; summary: string }[]
    >(response);

    for (const item of parsed) {
      const news = batch[item.index];
      if (news) {
        results.push({
          originalTitle: news.title,
          headline: item.headline,
          summary: item.summary,
          link: news.link,
          sourceName: news.sourceName,
          category: news.category,
          pubDate: news.pubDate,
        });
      }
    }
  }

  console.log(`[Summarize] Completed ${results.length} summaries`);
  return results;
}
