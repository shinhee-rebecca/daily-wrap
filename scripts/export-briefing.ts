/**
 * 브리핑 텍스트 내보내기 스크립트
 *
 * 카카오톡 오픈채팅방에 붙여넣기 위한 플레인 텍스트를 생성합니다.
 *
 * 사용법:
 *   pnpm export-briefing          # 오늘 브리핑
 *   pnpm export-briefing 2026-01-19   # 특정 날짜 브리핑
 */

import { createAnonClient } from "@/lib/supabase/server";
import { toBriefingWithNews, type DbBriefing, type DbNewsItem, type BriefingWithNews } from "@/types/database";
import * as mockData from "@/lib/mock";

/**
 * 섹션별 아이콘
 */
const SECTION_ICONS: Record<string, string> = {
  politics: "📌",
  economy: "📊",
  society: "🏛",
};

/**
 * 섹션별 라벨
 */
const SECTION_LABELS: Record<string, { ko: string; en: string }> = {
  politics: { ko: "정치", en: "POLITICS" },
  economy: { ko: "경제", en: "ECONOMY" },
  society: { ko: "사회", en: "SOCIETY" },
};

/**
 * 요일 한글 매핑
 */
const DAY_OF_WEEK_KO: Record<number, string> = {
  0: "일요일",
  1: "월요일",
  2: "화요일",
  3: "수요일",
  4: "목요일",
  5: "금요일",
  6: "토요일",
};

/**
 * 날짜 문자열을 한글 형식으로 변환
 */
function formatKoreanDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAY_OF_WEEK_KO[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
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
 * Supabase에서 브리핑 조회
 */
async function fetchBriefingFromDB(date: string): Promise<BriefingWithNews | null> {
  try {
    const supabase = createAnonClient();

    // 브리핑 조회
    const { data: briefing, error: briefingError } = await supabase
      .from("briefings")
      .select("*")
      .eq("date", date)
      .single();

    if (briefingError || !briefing) {
      return null;
    }

    // 뉴스 아이템 조회
    const { data: newsItems, error: newsError } = await supabase
      .from("news_items")
      .select("*")
      .eq("briefing_id", briefing.id)
      .order("importance_rank", { ascending: true });

    if (newsError) {
      console.error("Error fetching news items:", newsError);
      return null;
    }

    return toBriefingWithNews(briefing as DbBriefing, (newsItems || []) as DbNewsItem[]);
  } catch {
    // Supabase 연결 실패 시 null 반환
    return null;
  }
}

/**
 * Mock 데이터에서 브리핑 조회
 */
function fetchBriefingFromMock(date: string): BriefingWithNews | null {
  const briefing = mockData.getBriefingByDate(date);
  if (!briefing) {
    return null;
  }

  // Mock 데이터를 BriefingWithNews 형식으로 변환
  return {
    id: briefing.id,
    date: briefing.date,
    createdAt: briefing.createdAt,
    publishedAt: briefing.publishedAt,
    politics: briefing.politics.map((item) => ({
      id: item.id,
      briefingId: item.briefingId,
      category: item.category,
      title: item.title,
      summary: item.summary,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      importanceRank: item.importanceRank,
      createdAt: item.createdAt,
    })),
    economy: briefing.economy.map((item) => ({
      id: item.id,
      briefingId: item.briefingId,
      category: item.category,
      title: item.title,
      summary: item.summary,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      importanceRank: item.importanceRank,
      createdAt: item.createdAt,
    })),
    society: briefing.society.map((item) => ({
      id: item.id,
      briefingId: item.briefingId,
      category: item.category,
      title: item.title,
      summary: item.summary,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      importanceRank: item.importanceRank,
      createdAt: item.createdAt,
    })),
  };
}

/**
 * 브리핑을 카카오톡용 텍스트로 변환
 */
function formatBriefingForKakao(briefing: BriefingWithNews): string {
  const koreanDate = formatKoreanDate(briefing.date);
  const lines: string[] = [];

  // 헤더
  lines.push("============================");
  lines.push(`DAILY WRAP | ${koreanDate}`);
  lines.push("============================");
  lines.push("");
  lines.push("오늘의 뉴스를 한눈에 확인하세요.");
  lines.push("");

  // 섹션별 뉴스
  const sections = [
    { key: "politics", items: briefing.politics },
    { key: "economy", items: briefing.economy },
    { key: "society", items: briefing.society },
  ] as const;

  for (const section of sections) {
    const icon = SECTION_ICONS[section.key];
    const label = SECTION_LABELS[section.key];

    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push(`${icon} ${label.ko} ${label.en}`);
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push("");

    // 뉴스 아이템 (중요도 순, 최대 5개)
    const items = section.items.slice(0, 5);
    for (const item of items) {
      lines.push(`▶ ${item.title}`);
      lines.push(item.summary);
      lines.push(`🔗 ${item.sourceName}`);
      lines.push("");
    }
  }

  // 푸터
  lines.push("============================");
  lines.push("🌐 웹에서 더 보기: https://dailywrap.kr");
  lines.push("============================");

  return lines.join("\n");
}

/**
 * 간략 형식으로 변환 (제목만)
 */
function formatBriefingCompact(briefing: BriefingWithNews): string {
  const koreanDate = formatKoreanDate(briefing.date);
  const lines: string[] = [];

  // 헤더
  lines.push(`📰 Daily Wrap | ${koreanDate}`);
  lines.push("");

  // 섹션별 헤드라인
  const sections = [
    { key: "politics", items: briefing.politics },
    { key: "economy", items: briefing.economy },
    { key: "society", items: briefing.society },
  ] as const;

  for (const section of sections) {
    const icon = SECTION_ICONS[section.key];
    const label = SECTION_LABELS[section.key];

    lines.push(`${icon} ${label.ko}`);

    // 상위 3개 헤드라인만
    const items = section.items.slice(0, 3);
    for (const item of items) {
      lines.push(`• ${item.title}`);
    }
    lines.push("");
  }

  lines.push("🌐 https://dailywrap.kr");

  return lines.join("\n");
}

/**
 * 메인 실행 함수
 */
async function main() {
  const args = process.argv.slice(2);
  const dateArg = args.find((arg) => !arg.startsWith("--"));
  const compactMode = args.includes("--compact");

  // 날짜 결정 (인자 또는 오늘)
  const date = dateArg || getTodayDateString();

  console.log(`\n📅 브리핑 날짜: ${date}`);
  console.log(`📋 출력 형식: ${compactMode ? "간략" : "전체"}\n`);

  // 브리핑 조회 (DB 우선, Mock 폴백)
  console.log("🔍 브리핑 데이터 조회 중...");
  let briefing = await fetchBriefingFromDB(date);

  if (briefing) {
    console.log("✅ Supabase에서 브리핑을 가져왔습니다.\n");
  } else {
    console.log("⚠️  Supabase 연결 실패, Mock 데이터 사용...");
    briefing = fetchBriefingFromMock(date);

    if (briefing) {
      console.log("✅ Mock 데이터에서 브리핑을 가져왔습니다.\n");
    } else {
      console.error(`❌ 해당 날짜(${date})의 브리핑을 찾을 수 없습니다.`);
      console.error("   사용 가능한 날짜:", mockData.getAllBriefingDates().join(", "));
      process.exit(1);
    }
  }

  // 텍스트 변환
  const output = compactMode
    ? formatBriefingCompact(briefing)
    : formatBriefingForKakao(briefing);

  // 구분선과 함께 출력
  console.log("=".repeat(50));
  console.log("  카카오톡에 복사할 텍스트");
  console.log("=".repeat(50));
  console.log("");
  console.log(output);
  console.log("");
  console.log("=".repeat(50));

  // 통계
  const totalNews =
    briefing.politics.length + briefing.economy.length + briefing.society.length;
  console.log(`\n📊 통계:`);
  console.log(`   - 정치: ${briefing.politics.length}개`);
  console.log(`   - 경제: ${briefing.economy.length}개`);
  console.log(`   - 사회: ${briefing.society.length}개`);
  console.log(`   - 총 ${totalNews}개 뉴스`);
  console.log("");
}

// CLI에서 직접 실행 시
main().catch((error) => {
  console.error("오류 발생:", error);
  process.exit(1);
});
