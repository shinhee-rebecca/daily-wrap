import type { Briefing, BetaSignupStats, DateInfo, DAY_OF_WEEK_KO } from "@/types/briefing";
import mockData from "./briefings.json";

/**
 * 날짜 문자열을 DateInfo 객체로 변환
 */
export function getDateInfo(dateString: string): DateInfo {
  const date = new Date(dateString + "T00:00:00");
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeekNum = date.getDay();

  const dayOfWeekMap: Record<number, string> = {
    0: "일요일",
    1: "월요일",
    2: "화요일",
    3: "수요일",
    4: "목요일",
    5: "금요일",
    6: "토요일",
  };

  const dayOfWeek = dayOfWeekMap[dayOfWeekNum];

  return {
    date: dateString,
    year,
    month,
    day,
    dayOfWeek,
    formattedKorean: `${year}년 ${month}월 ${day}일`,
    formattedKoreanFull: `${year}년 ${month}월 ${day}일 ${dayOfWeek}`,
  };
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * Mock 데이터에서는 가장 최근 날짜를 "오늘"로 간주
 */
export function getTodayDate(): string {
  // Mock 환경에서는 가장 최근 브리핑 날짜를 오늘로 사용
  return mockData.briefings[0]?.date ?? new Date().toISOString().split("T")[0];
}

/**
 * 오늘의 브리핑 가져오기
 * 실제 API로 교체 시: fetch('/api/briefings/today')
 */
export function getTodayBriefing(): Briefing | null {
  const todayDate = getTodayDate();
  return getBriefingByDate(todayDate);
}

/**
 * 특정 날짜의 브리핑 가져오기
 * 실제 API로 교체 시: fetch(`/api/briefings/${date}`)
 */
export function getBriefingByDate(date: string): Briefing | null {
  const briefing = mockData.briefings.find((b) => b.date === date);
  return briefing ? (briefing as Briefing) : null;
}

/**
 * 최근 브리핑 목록 가져오기
 * 실제 API로 교체 시: fetch('/api/briefings?limit=30')
 */
export function getRecentBriefings(limit: number = 30): Briefing[] {
  return mockData.briefings.slice(0, limit) as Briefing[];
}

/**
 * 모든 브리핑 날짜 목록 가져오기
 */
export function getAllBriefingDates(): string[] {
  return mockData.briefings.map((b) => b.date);
}

/**
 * 특정 날짜의 이전/다음 브리핑 날짜 가져오기
 */
export function getAdjacentBriefingDates(
  currentDate: string
): { prev: string | null; next: string | null } {
  const dates = getAllBriefingDates();
  const currentIndex = dates.indexOf(currentDate);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex < dates.length - 1 ? dates[currentIndex + 1] : null,
    next: currentIndex > 0 ? dates[currentIndex - 1] : null,
  };
}

/**
 * 베타 신청 통계 가져오기
 * 실제 API로 교체 시: fetch('/api/beta-signup/stats')
 */
export function getBetaSignupStats(): BetaSignupStats {
  return mockData.betaSignupStats as BetaSignupStats;
}

/**
 * 날짜가 오늘인지 확인
 */
export function isToday(date: string): boolean {
  return date === getTodayDate();
}
