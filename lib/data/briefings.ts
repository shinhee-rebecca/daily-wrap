/**
 * 브리핑 데이터 페칭 레이어
 * Supabase 데이터를 우선 사용하고, 없으면 Mock 데이터로 fallback
 *
 * ISR(Incremental Static Regeneration) 설정:
 * - revalidate: 3600 (1시간마다 재검증)
 * - on-demand revalidation via /api/revalidate
 */

import { createAnonClient } from "@/lib/supabase/server";
import {
  getTodayBriefing as getMockTodayBriefing,
  getBriefingByDate as getMockBriefingByDate,
  getRecentBriefings as getMockRecentBriefings,
  getAllBriefingDates as getMockAllBriefingDates,
  getAdjacentBriefingDates as getMockAdjacentBriefingDates,
  getDateInfo,
} from "@/lib/mock";
import {
  toBriefingWithNews,
  type DbBriefing,
  type DbNewsItem,
  type BriefingWithNews,
  type BriefingSummaryResponse,
} from "@/types/database";
import type { Briefing, NewsItem } from "@/types/briefing";

// ISR 설정: 1시간마다 재검증
export const revalidate = 3600;

/**
 * DB 응답을 프론트엔드 Briefing 타입으로 변환
 */
function convertToBriefing(data: BriefingWithNews): Briefing {
  return {
    id: data.id,
    date: data.date,
    createdAt: data.createdAt,
    publishedAt: data.publishedAt,
    politics: data.politics as NewsItem[],
    economy: data.economy as NewsItem[],
    society: data.society as NewsItem[],
  };
}

/**
 * 오늘의 브리핑 가져오기
 * Supabase에서 가장 최근 published된 브리핑을 가져옴
 * 실패 시 Mock 데이터로 fallback
 */
export async function getTodayBriefing(): Promise<Briefing | null> {
  try {
    const supabase = createAnonClient();

    // 가장 최근 published된 브리핑 조회
    const { data: briefingData, error: briefingError } = await supabase
      .from("briefings")
      .select("*")
      .not("published_at", "is", null)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (briefingError || !briefingData) {
      console.log(
        "[getTodayBriefing] Supabase 데이터 없음, Mock fallback 사용"
      );
      return getMockTodayBriefing();
    }

    const briefing = briefingData as DbBriefing;

    // 뉴스 아이템 조회
    const { data: newsItemsData, error: newsError } = await supabase
      .from("news_items")
      .select("*")
      .eq("briefing_id", briefing.id)
      .order("importance_rank", { ascending: true });

    if (newsError) {
      console.error("[getTodayBriefing] 뉴스 아이템 조회 실패:", newsError);
      return getMockTodayBriefing();
    }

    const newsItems = (newsItemsData || []) as DbNewsItem[];

    // 뉴스 아이템이 없으면 Mock fallback
    if (newsItems.length === 0) {
      console.log(
        "[getTodayBriefing] 뉴스 아이템 없음, Mock fallback 사용"
      );
      return getMockTodayBriefing();
    }

    const result = toBriefingWithNews(briefing, newsItems);
    return convertToBriefing(result);
  } catch (error) {
    console.error("[getTodayBriefing] 예외 발생, Mock fallback 사용:", error);
    return getMockTodayBriefing();
  }
}

/**
 * 특정 날짜의 브리핑 가져오기
 */
export async function getBriefingByDate(date: string): Promise<Briefing | null> {
  try {
    const supabase = createAnonClient();

    // 브리핑 조회
    const { data: briefingData, error: briefingError } = await supabase
      .from("briefings")
      .select("*")
      .eq("date", date)
      .single();

    if (briefingError || !briefingData) {
      console.log(
        `[getBriefingByDate] ${date} Supabase 데이터 없음, Mock fallback 사용`
      );
      return getMockBriefingByDate(date);
    }

    const briefing = briefingData as DbBriefing;

    // 뉴스 아이템 조회
    const { data: newsItemsData, error: newsError } = await supabase
      .from("news_items")
      .select("*")
      .eq("briefing_id", briefing.id)
      .order("importance_rank", { ascending: true });

    if (newsError) {
      console.error(`[getBriefingByDate] ${date} 뉴스 아이템 조회 실패:`, newsError);
      return getMockBriefingByDate(date);
    }

    const newsItems = (newsItemsData || []) as DbNewsItem[];

    // 뉴스 아이템이 없으면 Mock fallback
    if (newsItems.length === 0) {
      console.log(
        `[getBriefingByDate] ${date} 뉴스 아이템 없음, Mock fallback 사용`
      );
      return getMockBriefingByDate(date);
    }

    const result = toBriefingWithNews(briefing, newsItems);
    return convertToBriefing(result);
  } catch (error) {
    console.error(`[getBriefingByDate] ${date} 예외 발생, Mock fallback 사용:`, error);
    return getMockBriefingByDate(date);
  }
}

/**
 * 최근 브리핑 목록 가져오기
 * Mock 데이터와 Supabase 데이터를 병합하여 반환
 */
export async function getRecentBriefings(limit: number = 30): Promise<Briefing[]> {
  try {
    const supabase = createAnonClient();

    // 최근 30일 브리핑 조회
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const { data: briefingsData, error: briefingsError } = await supabase
      .from("briefings")
      .select("id, date, created_at, published_at")
      .gte("date", thirtyDaysAgoStr)
      .not("published_at", "is", null)
      .order("date", { ascending: false })
      .limit(limit);

    if (briefingsError || !briefingsData || briefingsData.length === 0) {
      console.log(
        "[getRecentBriefings] Supabase 데이터 없음, Mock fallback 사용"
      );
      return getMockRecentBriefings(limit);
    }

    const briefings = briefingsData as DbBriefing[];

    // 각 브리핑의 뉴스 아이템 조회
    const briefingIds = briefings.map((b) => b.id);
    const { data: allNewsItems, error: newsError } = await supabase
      .from("news_items")
      .select("*")
      .in("briefing_id", briefingIds)
      .order("importance_rank", { ascending: true });

    if (newsError) {
      console.error("[getRecentBriefings] 뉴스 아이템 조회 실패:", newsError);
      return getMockRecentBriefings(limit);
    }

    const newsItems = (allNewsItems || []) as DbNewsItem[];

    // 뉴스 아이템이 없으면 Mock fallback
    if (newsItems.length === 0) {
      console.log(
        "[getRecentBriefings] 뉴스 아이템 없음, Mock fallback 사용"
      );
      return getMockRecentBriefings(limit);
    }

    // 브리핑별로 뉴스 아이템 그룹화
    const newsItemsByBriefing = new Map<string, DbNewsItem[]>();
    for (const item of newsItems) {
      const existing = newsItemsByBriefing.get(item.briefing_id) || [];
      existing.push(item);
      newsItemsByBriefing.set(item.briefing_id, existing);
    }

    // 브리핑 목록 생성
    const result: Briefing[] = briefings.map((briefing) => {
      const items = newsItemsByBriefing.get(briefing.id) || [];
      const converted = toBriefingWithNews(briefing, items);
      return convertToBriefing(converted);
    });

    return result;
  } catch (error) {
    console.error("[getRecentBriefings] 예외 발생, Mock fallback 사용:", error);
    return getMockRecentBriefings(limit);
  }
}

/**
 * 모든 브리핑 날짜 목록 가져오기
 */
export async function getAllBriefingDates(): Promise<string[]> {
  try {
    const supabase = createAnonClient();

    const { data: briefingsData, error } = await supabase
      .from("briefings")
      .select("date")
      .not("published_at", "is", null)
      .order("date", { ascending: false });

    if (error || !briefingsData || briefingsData.length === 0) {
      console.log(
        "[getAllBriefingDates] Supabase 데이터 없음, Mock fallback 사용"
      );
      return getMockAllBriefingDates();
    }

    return briefingsData.map((b: { date: string }) => b.date);
  } catch (error) {
    console.error("[getAllBriefingDates] 예외 발생, Mock fallback 사용:", error);
    return getMockAllBriefingDates();
  }
}

/**
 * 특정 날짜의 이전/다음 브리핑 날짜 가져오기
 */
export async function getAdjacentBriefingDates(
  currentDate: string
): Promise<{ prev: string | null; next: string | null }> {
  try {
    const dates = await getAllBriefingDates();
    const currentIndex = dates.indexOf(currentDate);

    if (currentIndex === -1) {
      // Supabase에 없으면 Mock에서 찾기
      return getMockAdjacentBriefingDates(currentDate);
    }

    return {
      prev: currentIndex < dates.length - 1 ? dates[currentIndex + 1] : null,
      next: currentIndex > 0 ? dates[currentIndex - 1] : null,
    };
  } catch (error) {
    console.error("[getAdjacentBriefingDates] 예외 발생, Mock fallback 사용:", error);
    return getMockAdjacentBriefingDates(currentDate);
  }
}

/**
 * 오늘 날짜 가져오기 (가장 최근 브리핑 날짜)
 */
export async function getTodayDate(): Promise<string> {
  try {
    const dates = await getAllBriefingDates();
    if (dates.length > 0) {
      return dates[0];
    }
    return new Date().toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

// DateInfo 유틸리티 re-export
export { getDateInfo };
