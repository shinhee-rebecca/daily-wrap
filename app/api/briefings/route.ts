import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import type { BriefingSummaryResponse, DbBriefing } from "@/types/database";

/**
 * API 응답 타입
 */
interface BriefingsListResponse {
  success: boolean;
  data: BriefingSummaryResponse[] | null;
  error: string | null;
}

/**
 * GET /api/briefings
 * 최근 30일 브리핑 목록 조회
 */
export async function GET(): Promise<NextResponse<BriefingsListResponse>> {
  try {
    const supabase = createAnonClient();

    // 최근 30일 브리핑 조회 (published만)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const { data: briefingsData, error: briefingsError } = await supabase
      .from("briefings")
      .select("id, date, created_at, published_at")
      .gte("date", thirtyDaysAgoStr)
      .not("published_at", "is", null)
      .order("date", { ascending: false });

    if (briefingsError) {
      console.error("Failed to fetch briefings:", briefingsError);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "브리핑 목록을 가져오는데 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const briefings = (briefingsData || []) as DbBriefing[];

    if (briefings.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        error: null,
      });
    }

    // 각 브리핑의 뉴스 아이템 수 조회
    const briefingIds = briefings.map((b) => b.id);
    const { data: newsItemsData, error: newsError } = await supabase
      .from("news_items")
      .select("briefing_id")
      .in("briefing_id", briefingIds);

    if (newsError) {
      console.error("Failed to fetch news items:", newsError);
    }

    // 브리핑별 뉴스 수 계산
    const newsCountMap = new Map<string, number>();
    if (newsItemsData) {
      for (const item of newsItemsData as { briefing_id: string }[]) {
        const count = newsCountMap.get(item.briefing_id) || 0;
        newsCountMap.set(item.briefing_id, count + 1);
      }
    }

    // 응답 데이터 구성
    const response: BriefingSummaryResponse[] = briefings.map((briefing) => ({
      id: briefing.id,
      date: briefing.date,
      createdAt: briefing.created_at,
      publishedAt: briefing.published_at,
      totalNewsCount: newsCountMap.get(briefing.id) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: response,
      error: null,
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/briefings:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
