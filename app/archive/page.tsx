import Link from "next/link";
import type { Metadata } from "next";
import { getRecentBriefings, getDateInfo, getTodayDate } from "@/lib/data/briefings";
import { Headline, Subheadline, Caption, BodyText } from "@/components/typography";
import { Divider } from "@/components/ui/divider";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArchiveListJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "지난 브리핑 아카이브",
  description: "Daily Wrap의 지난 뉴스 브리핑 아카이브입니다. 날짜별로 정치, 경제, 사회 뉴스 요약을 확인하세요.",
  openGraph: {
    title: "지난 브리핑 아카이브 | Daily Wrap",
    description: "Daily Wrap의 지난 뉴스 브리핑 아카이브입니다. 날짜별로 정치, 경제, 사회 뉴스 요약을 확인하세요.",
  },
};

// ISR 설정: 1시간마다 재검증
export const revalidate = 3600;

export default async function ArchivePage() {
  const briefings = await getRecentBriefings();
  const todayDate = await getTodayDate();

  // JSON-LD 용 브리핑 요약 데이터
  const briefingSummaries = briefings.map((b) => ({
    date: b.date,
    newsCount: b.politics.length + b.economy.length + b.society.length,
  }));

  return (
    <>
      {/* SEO: JSON-LD 구조화 데이터 */}
      <ArchiveListJsonLd briefings={briefingSummaries} />

      <main className="min-h-screen relative overflow-hidden">
        <AuroraBackground />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
          {/* 헤더 */}
          <header className="text-center mb-8">
            <Link href="/" className="inline-block group" aria-label="Daily Wrap 홈으로 이동">
              <Headline
                as="h1"
                size="h1"
                weight="bold"
                className="tracking-tight mb-2 text-gradient group-hover:opacity-80 transition-opacity text-2xl sm:text-3xl md:text-4xl"
              >
                DAILY WRAP
              </Headline>
            </Link>
            <Subheadline tone="secondary" className="text-sm sm:text-base">
              지난 브리핑 아카이브
            </Subheadline>
          </header>

          {/* 이중선 구분자 */}
          <Divider variant="double" spacing="xl" />

          {/* 오늘로 돌아가기 - 터치 타겟 44px 보장 */}
          <nav className="flex justify-end mb-6 sm:mb-8" aria-label="페이지 네비게이션">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-link hover:text-text-primary transition-colors font-[family-name:var(--font-display)] text-sm tracking-wide min-h-[44px] min-w-[44px] px-3 -mx-3"
              aria-label="오늘 브리핑 페이지로 이동"
            >
              <span aria-hidden="true">&larr;</span>
              <span>오늘 브리핑으로 돌아가기</span>
            </Link>
          </nav>

          {/* 브리핑 목록 */}
          <section aria-label="브리핑 목록">
            <ul className="glass-card rounded-2xl overflow-hidden list-none m-0 p-0">
              {briefings.map((briefing) => {
                const dateInfo = getDateInfo(briefing.date);
                const isToday = briefing.date === todayDate;
                const totalNews =
                  briefing.politics.length +
                  briefing.economy.length +
                  briefing.society.length;

                return (
                  <li key={briefing.id} className="border-b border-border-glass last:border-b-0">
                    <Link
                      href={isToday ? "/" : `/archive/${briefing.date}`}
                      className="group block p-4 sm:p-5 hover:bg-glass-highlight transition-colors min-h-[44px]"
                      aria-label={`${dateInfo.formattedKorean} ${dateInfo.dayOfWeek} 브리핑 - ${totalNews}개 뉴스`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                          <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl md:text-2xl text-text-primary group-hover:text-link transition-colors">
                            {dateInfo.formattedKorean}
                          </span>
                          <Caption tone="muted" className="hidden sm:inline">
                            {dateInfo.dayOfWeek}
                          </Caption>
                          {isToday && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-politics text-white text-xs font-medium rounded">
                              오늘
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <BodyText size="sm" tone="muted">
                            {totalNews}개 뉴스
                          </BodyText>
                          <span
                            className="text-text-muted group-hover:text-link group-hover:translate-x-1 transition-all"
                            aria-hidden="true"
                          >
                            &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {briefings.length === 0 && (
            <div className="text-center py-16 glass-card rounded-2xl">
              <BodyText tone="muted">
                아직 저장된 브리핑이 없습니다.
              </BodyText>
            </div>
          )}

          {/* 푸터 */}
          <footer className="text-center py-8 mt-8" role="contentinfo">
            <div className="glass-card inline-block rounded-full px-5 sm:px-6 md:px-8 py-3 sm:py-4">
              <Caption tone="muted" size="sm">
                &copy; 2026 Daily Wrap. AI로 자동 생성된 뉴스 요약 서비스입니다.
              </Caption>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
