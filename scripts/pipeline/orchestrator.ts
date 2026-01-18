/**
 * Pipeline Orchestrator
 *
 * 전체 뉴스 파이프라인을 실행합니다:
 * RSS 수집 → 중복제거 → 요약 → 랭킹 → 저장
 */

import { createServiceClient } from "@/lib/supabase/server";
import { hasApiKey } from "@/lib/openai/client";
import { fetchAllFeeds, filterRecentNews } from "./rss-fetcher";
import { deduplicateNews, groupByCategory } from "./deduplicator";
import { summarizeNewsBatch } from "./prompts/summarize";
import { rankAllNews, type RankedNews } from "./prompts/rank";
import type { NewsCategory, DbBriefingInsert, DbNewsItemInsert } from "@/types/database";

/**
 * 파이프라인 실행 결과
 */
export interface PipelineResult {
  success: boolean;
  briefingId?: string;
  date: string;
  stats: {
    fetched: number;
    afterDedup: number;
    summarized: number;
    saved: number;
  };
  errors: string[];
}

/**
 * 오늘 날짜 문자열 (YYYY-MM-DD)
 */
function getTodayDateString(): string {
  const now = new Date();
  // KST 기준으로 날짜 계산 (UTC+9)
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  return kstDate.toISOString().split("T")[0];
}

/**
 * 랭킹된 뉴스를 DB에 저장
 */
async function saveToDatabase(
  rankedNews: Record<NewsCategory, RankedNews[]>,
  date: string
): Promise<{ briefingId: string; savedCount: number }> {
  const supabase = createServiceClient();

  // 1. 기존 브리핑 확인 (같은 날짜)
  const { data: existingBriefing } = await supabase
    .from("briefings")
    .select("id")
    .eq("date", date)
    .single();

  let briefingId: string;

  if (existingBriefing) {
    // 기존 브리핑이 있으면 뉴스 아이템만 삭제 후 재생성
    briefingId = existingBriefing.id;
    console.log(`[DB] Found existing briefing for ${date}, updating...`);

    await supabase.from("news_items").delete().eq("briefing_id", briefingId);
  } else {
    // 새 브리핑 생성
    const briefingData: DbBriefingInsert = {
      date,
      published_at: new Date().toISOString(),
    };

    const { data: newBriefing, error: briefingError } = await supabase
      .from("briefings")
      .insert(briefingData)
      .select("id")
      .single();

    if (briefingError || !newBriefing) {
      throw new Error(`Failed to create briefing: ${briefingError?.message}`);
    }

    briefingId = newBriefing.id;
    console.log(`[DB] Created new briefing: ${briefingId}`);
  }

  // 2. 뉴스 아이템 삽입
  const newsItems: DbNewsItemInsert[] = [];
  const categories: NewsCategory[] = ["politics", "economy", "society"];

  for (const category of categories) {
    const items = rankedNews[category];
    for (const item of items) {
      newsItems.push({
        briefing_id: briefingId,
        category,
        title: item.headline,
        summary: item.summary,
        source_name: item.sourceName,
        source_url: item.link,
        importance_rank: item.importanceRank,
      });
    }
  }

  if (newsItems.length > 0) {
    const { error: insertError } = await supabase
      .from("news_items")
      .insert(newsItems);

    if (insertError) {
      throw new Error(`Failed to insert news items: ${insertError.message}`);
    }
  }

  console.log(`[DB] Saved ${newsItems.length} news items`);
  return { briefingId, savedCount: newsItems.length };
}

/**
 * Revalidation 요청 전송
 */
async function triggerRevalidation(): Promise<void> {
  const revalidateUrl = process.env.REVALIDATE_URL;
  const revalidateSecret = process.env.REVALIDATION_SECRET;

  if (!revalidateUrl || !revalidateSecret) {
    console.log("[Revalidate] Skipping - no URL or secret configured");
    return;
  }

  try {
    const response = await fetch(revalidateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revalidateSecret}`,
      },
      body: JSON.stringify({ paths: ["/", "/archive"] }),
    });

    if (response.ok) {
      console.log("[Revalidate] Successfully triggered revalidation");
    } else {
      console.warn(`[Revalidate] Failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn("[Revalidate] Error:", error instanceof Error ? error.message : error);
  }
}

/**
 * 전체 파이프라인 실행
 */
export async function runPipeline(): Promise<PipelineResult> {
  const date = getTodayDateString();
  const errors: string[] = [];
  const stats = {
    fetched: 0,
    afterDedup: 0,
    summarized: 0,
    saved: 0,
  };

  console.log("========================================");
  console.log(`[Pipeline] Starting for date: ${date}`);
  console.log(`[Pipeline] API Key present: ${hasApiKey()}`);
  console.log(`[Pipeline] Dry run: ${!hasApiKey() || process.env.DRY_RUN === "true"}`);
  console.log("========================================\n");

  try {
    // 1. RSS 수집
    console.log("[Step 1/5] Fetching RSS feeds...");
    const rawNews = await fetchAllFeeds();
    const recentNews = filterRecentNews(rawNews, 24);
    stats.fetched = recentNews.length;
    console.log(`[Step 1/5] Complete: ${stats.fetched} items\n`);

    if (stats.fetched === 0) {
      console.log("[Pipeline] No news items fetched, aborting");
      return {
        success: false,
        date,
        stats,
        errors: ["No news items fetched from RSS feeds"],
      };
    }

    // 2. 중복 제거
    console.log("[Step 2/5] Deduplicating...");
    const uniqueNews = deduplicateNews(recentNews);
    stats.afterDedup = uniqueNews.length;
    console.log(`[Step 2/5] Complete: ${stats.afterDedup} items\n`);

    // 3. AI 요약
    console.log("[Step 3/5] Summarizing with AI...");
    const summarizedNews = await summarizeNewsBatch(uniqueNews);
    stats.summarized = summarizedNews.length;
    console.log(`[Step 3/5] Complete: ${stats.summarized} items\n`);

    // 4. 중요도 랭킹
    console.log("[Step 4/5] Ranking by importance...");
    const rankedNews = await rankAllNews(summarizedNews);
    const totalRanked = Object.values(rankedNews).reduce(
      (sum, items) => sum + items.length,
      0
    );
    console.log(`[Step 4/5] Complete: ${totalRanked} items ranked\n`);

    // 5. DB 저장
    console.log("[Step 5/5] Saving to database...");
    const { briefingId, savedCount } = await saveToDatabase(rankedNews, date);
    stats.saved = savedCount;
    console.log(`[Step 5/5] Complete: ${stats.saved} items saved\n`);

    // Revalidation 트리거
    await triggerRevalidation();

    console.log("========================================");
    console.log("[Pipeline] SUCCESS!");
    console.log(`Briefing ID: ${briefingId}`);
    console.log(`Stats: ${JSON.stringify(stats)}`);
    console.log("========================================");

    return {
      success: true,
      briefingId,
      date,
      stats,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    console.error("========================================");
    console.error("[Pipeline] FAILED!");
    console.error(`Error: ${errorMessage}`);
    console.error("========================================");

    return {
      success: false,
      date,
      stats,
      errors,
    };
  }
}

/**
 * CLI 진입점
 */
async function main() {
  console.log("=== Daily Wrap News Pipeline ===\n");

  const result = await runPipeline();

  if (!result.success) {
    console.error("\nPipeline failed:");
    result.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log("\nPipeline completed successfully!");
  process.exit(0);
}

// CLI에서 직접 실행 시
if (require.main === module) {
  main();
}
