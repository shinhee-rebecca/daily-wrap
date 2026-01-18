import Link from "next/link";
import { getRecentBriefings, getDateInfo, getTodayDate } from "@/lib/mock";
import { Headline, Subheadline, Caption, BodyText } from "@/components/typography";
import { Divider } from "@/components/ui/divider";

export default function ArchivePage() {
  const briefings = getRecentBriefings();
  const todayDate = getTodayDate();

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Headline
              as="h1"
              size="h1"
              weight="bold"
              className="tracking-tight mb-2 hover:text-text-secondary transition-colors"
            >
              DAILY WRAP
            </Headline>
          </Link>
          <Subheadline tone="secondary">
            지난 브리핑 아카이브
          </Subheadline>
        </header>

        {/* 이중선 구분자 */}
        <Divider variant="double" spacing="xl" />

        {/* 오늘로 돌아가기 */}
        <div className="flex justify-end mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-link hover:underline font-[family-name:var(--font-display)] text-sm tracking-wide"
          >
            <span aria-hidden="true">←</span>
            <span>오늘 브리핑으로 돌아가기</span>
          </Link>
        </div>

        {/* 브리핑 목록 */}
        <div className="space-y-1">
          {briefings.map((briefing) => {
            const dateInfo = getDateInfo(briefing.date);
            const isToday = briefing.date === todayDate;
            const totalNews =
              briefing.politics.length +
              briefing.economy.length +
              briefing.society.length;

            return (
              <Link
                key={briefing.id}
                href={isToday ? "/" : `/archive/${briefing.date}`}
                className="group block p-4 hover:bg-bg-hover transition-colors border-b border-border-editorial"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-text-primary group-hover:text-link transition-colors">
                      {dateInfo.formattedKorean}
                    </div>
                    <Caption tone="muted" className="hidden sm:inline">
                      {dateInfo.dayOfWeek}
                    </Caption>
                    {isToday && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-politics text-white text-xs font-medium">
                        오늘
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <BodyText size="sm" tone="muted">
                      {totalNews}개 뉴스
                    </BodyText>
                    <span
                      className="text-text-muted group-hover:text-link transition-colors"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {briefings.length === 0 && (
          <div className="text-center py-16">
            <BodyText tone="muted">
              아직 저장된 브리핑이 없습니다.
            </BodyText>
          </div>
        )}

        {/* 푸터 */}
        <footer className="text-center py-8 border-t border-border-editorial mt-8">
          <Caption tone="muted" size="sm">
            © 2026 Daily Wrap. AI로 자동 생성된 뉴스 요약 서비스입니다.
          </Caption>
        </footer>
      </div>
    </main>
  );
}
