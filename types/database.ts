/**
 * Supabase Database Types
 * 스키마: supabase/schema.sql과 동기화
 */

/**
 * 뉴스 카테고리 (DB 체크 제약조건과 일치)
 */
export type NewsCategory = "politics" | "economy" | "society";

/**
 * Supabase Database 스키마 타입
 */
export interface Database {
  public: {
    Tables: {
      briefings: {
        Row: {
          id: string;
          date: string; // DATE 타입은 문자열로 반환
          created_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          date: string;
          created_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          date?: string;
          created_at?: string;
          published_at?: string | null;
        };
      };
      news_items: {
        Row: {
          id: string;
          briefing_id: string;
          category: NewsCategory;
          title: string;
          summary: string;
          source_name: string;
          source_url: string;
          importance_rank: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          briefing_id: string;
          category: NewsCategory;
          title: string;
          summary: string;
          source_name: string;
          source_url: string;
          importance_rank: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          briefing_id?: string;
          category?: NewsCategory;
          title?: string;
          summary?: string;
          source_name?: string;
          source_url?: string;
          importance_rank?: number;
          created_at?: string;
        };
      };
      beta_signups: {
        Row: {
          id: string;
          email: string;
          kakao_id: string | null;
          signed_up_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          kakao_id?: string | null;
          signed_up_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          kakao_id?: string | null;
          signed_up_at?: string;
        };
      };
    };
    Views: {
      recent_briefings: {
        Row: {
          id: string;
          date: string;
          created_at: string;
          published_at: string | null;
          news_count: number;
        };
      };
    };
    Functions: {
      get_beta_signup_count: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Enums: {
      news_category: NewsCategory;
    };
  };
}

// ===========================================
// 편의를 위한 타입 별칭
// ===========================================

/**
 * 브리핑 테이블 Row 타입
 */
export type DbBriefing = Database["public"]["Tables"]["briefings"]["Row"];

/**
 * 뉴스 아이템 테이블 Row 타입
 */
export type DbNewsItem = Database["public"]["Tables"]["news_items"]["Row"];

/**
 * 베타 신청 테이블 Row 타입
 */
export type DbBetaSignup = Database["public"]["Tables"]["beta_signups"]["Row"];

/**
 * 브리핑 Insert 타입
 */
export type DbBriefingInsert = Database["public"]["Tables"]["briefings"]["Insert"];

/**
 * 뉴스 아이템 Insert 타입
 */
export type DbNewsItemInsert = Database["public"]["Tables"]["news_items"]["Insert"];

/**
 * 베타 신청 Insert 타입
 */
export type DbBetaSignupInsert = Database["public"]["Tables"]["beta_signups"]["Insert"];

// ===========================================
// API 응답 타입 (types/briefing.ts와 호환)
// ===========================================

/**
 * 브리핑 + 뉴스 아이템 조인 결과
 * API 응답 및 프론트엔드에서 사용
 */
export interface BriefingWithNews {
  id: string;
  date: string;
  createdAt: string;
  publishedAt: string | null;
  politics: NewsItemResponse[];
  economy: NewsItemResponse[];
  society: NewsItemResponse[];
}

/**
 * 뉴스 아이템 응답 타입 (camelCase)
 * types/briefing.ts의 NewsItem과 호환
 */
export interface NewsItemResponse {
  id: string;
  briefingId: string;
  category: NewsCategory;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  importanceRank: number;
  createdAt: string;
}

/**
 * 브리핑 목록 아이템 (요약 정보)
 */
export interface BriefingSummaryResponse {
  id: string;
  date: string;
  createdAt: string;
  publishedAt: string | null;
  totalNewsCount: number;
}

/**
 * 베타 신청 통계
 */
export interface BetaSignupStatsResponse {
  currentCount: number;
  targetCount: number;
  remainingSlots: number;
}

// ===========================================
// 유틸리티 함수
// ===========================================

/**
 * DB 뉴스 아이템을 API 응답 형식으로 변환
 */
export function toNewsItemResponse(item: DbNewsItem): NewsItemResponse {
  return {
    id: item.id,
    briefingId: item.briefing_id,
    category: item.category,
    title: item.title,
    summary: item.summary,
    sourceName: item.source_name,
    sourceUrl: item.source_url,
    importanceRank: item.importance_rank,
    createdAt: item.created_at,
  };
}

/**
 * DB 브리핑 + 뉴스 아이템을 API 응답 형식으로 변환
 */
export function toBriefingWithNews(
  briefing: DbBriefing,
  newsItems: DbNewsItem[]
): BriefingWithNews {
  const politics = newsItems
    .filter((item) => item.category === "politics")
    .sort((a, b) => a.importance_rank - b.importance_rank)
    .map(toNewsItemResponse);

  const economy = newsItems
    .filter((item) => item.category === "economy")
    .sort((a, b) => a.importance_rank - b.importance_rank)
    .map(toNewsItemResponse);

  const society = newsItems
    .filter((item) => item.category === "society")
    .sort((a, b) => a.importance_rank - b.importance_rank)
    .map(toNewsItemResponse);

  return {
    id: briefing.id,
    date: briefing.date,
    createdAt: briefing.created_at,
    publishedAt: briefing.published_at,
    politics,
    economy,
    society,
  };
}

/**
 * 베타 신청 통계 생성
 */
export function toBetaSignupStats(count: number): BetaSignupStatsResponse {
  const targetCount = 100;
  return {
    currentCount: count,
    targetCount,
    remainingSlots: Math.max(0, targetCount - count),
  };
}
