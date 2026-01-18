import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import {
  toBriefingWithNews,
  type BriefingWithNews,
  type DbBriefing,
  type DbNewsItem,
} from "@/types/database";

/**
 * API 응답 타입
 */
interface BriefingDetailResponse {
  success: boolean;
  data: BriefingWithNews | null;
  error: string | null;
}

/**
 * 날짜 형식 검증 (YYYY-MM-DD)
 */
function isValidDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * GET /api/briefings/[date]
 * 특정 날짜 브리핑 + 뉴스 아이템 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
): Promise<NextResponse<BriefingDetailResponse>> {
  try {
    const { date } = await params;

    // 날짜 형식 검증
    if (!isValidDateFormat(date)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "잘못된 날짜 형식입니다. YYYY-MM-DD 형식을 사용해주세요.",
        },
        { status: 400 }
      );
    }

    const supabase = createAnonClient();

    // 브리핑 조회
    const { data: briefingData, error: briefingError } = await supabase
      .from("briefings")
      .select("*")
      .eq("date", date)
      .single();

    if (briefingError) {
      if (briefingError.code === "PGRST116") {
        // No rows returned
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: `${date} 날짜의 브리핑을 찾을 수 없습니다.`,
          },
          { status: 404 }
        );
      }

      console.error("Failed to fetch briefing:", briefingError);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "브리핑을 가져오는데 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const briefing = briefingData as DbBriefing;

    // 뉴스 아이템 조회
    const { data: newsItemsData, error: newsError } = await supabase
      .from("news_items")
      .select("*")
      .eq("briefing_id", briefing.id)
      .order("importance_rank", { ascending: true });

    if (newsError) {
      console.error("Failed to fetch news items:", newsError);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "뉴스 아이템을 가져오는데 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const newsItems = (newsItemsData || []) as DbNewsItem[];

    // 응답 데이터 구성
    const response = toBriefingWithNews(briefing, newsItems);

    return NextResponse.json({
      success: true,
      data: response,
      error: null,
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/briefings/[date]:", error);
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
