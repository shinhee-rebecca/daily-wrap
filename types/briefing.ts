/**
 * 뉴스 카테고리 타입
 */
export type NewsCategory = "politics" | "economy" | "society";

/**
 * 개별 뉴스 아이템 인터페이스
 * DB 스키마와 호환되도록 설계
 */
export interface NewsItem {
  id: string;
  briefingId: string;
  category: NewsCategory;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  importanceRank: number; // 1-5, 낮을수록 중요
  createdAt: string;
}

/**
 * 섹션별 뉴스 그룹
 */
export interface NewsSection {
  category: NewsCategory;
  items: NewsItem[];
}

/**
 * 일일 브리핑 인터페이스
 * DB 스키마와 호환되도록 설계
 */
export interface Briefing {
  id: string;
  date: string; // YYYY-MM-DD 형식
  createdAt: string;
  publishedAt: string | null;
  politics: NewsItem[];
  economy: NewsItem[];
  society: NewsItem[];
}

/**
 * 브리핑 요약 정보 (목록용)
 */
export interface BriefingSummary {
  id: string;
  date: string;
  totalNewsCount: number;
  publishedAt: string | null;
}

/**
 * 베타 신청 통계
 */
export interface BetaSignupStats {
  currentCount: number;
  targetCount: number;
  remainingSlots: number;
}

/**
 * 날짜 관련 유틸리티 타입
 */
export interface DateInfo {
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  dayOfWeek: string; // 요일 (한글)
  formattedKorean: string; // "2026년 1월 17일"
  formattedKoreanFull: string; // "2026년 1월 17일 금요일"
}

/**
 * 카테고리 라벨 타입
 */
export interface CategoryLabel {
  ko: string;
  en: string;
}

/**
 * 카테고리별 라벨 매핑
 */
export const CATEGORY_LABELS: Record<NewsCategory, CategoryLabel> = {
  politics: { ko: "정치", en: "POLITICS" },
  economy: { ko: "경제", en: "ECONOMY" },
  society: { ko: "사회", en: "SOCIETY" },
};

/**
 * 요일 한글 매핑
 */
export const DAY_OF_WEEK_KO: Record<number, string> = {
  0: "일요일",
  1: "월요일",
  2: "화요일",
  3: "수요일",
  4: "목요일",
  5: "금요일",
  6: "토요일",
};
