import Link from "next/link";
import { getTodayBriefing, getDateInfo } from "@/lib/mock";
import { Headline, Subheadline, DateDisplay, Caption } from "@/components/typography";
import { Divider } from "@/components/ui/divider";
import { NewsSection } from "@/components/news/news-section";
import { SignupCTA } from "@/components/beta/signup-cta";

export default function HomePage() {
  const briefing = getTodayBriefing();

  if (!briefing) {
    return (
      <main className="min-h-screen bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Headline as="h1" size="h1">
            오늘의 브리핑이 없습니다
          </Headline>
          <Subheadline className="mt-4">
            아직 오늘의 뉴스 브리핑이 준비되지 않았습니다.
          </Subheadline>
        </div>
      </main>
    );
  }

  const dateInfo = getDateInfo(briefing.date);

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <Headline
            as="h1"
            size="hero"
            weight="bold"
            className="tracking-tight mb-2"
          >
            DAILY WRAP
          </Headline>
          <Subheadline tone="secondary" className="mb-6">
            어제 하루, 한눈에
          </Subheadline>

          <DateDisplay
            dateTime={briefing.date}
            size="hero"
            weight="normal"
            className="block mb-1"
          >
            {dateInfo.formattedKorean}
          </DateDisplay>
          <Caption tone="muted" className="text-lg">
            {dateInfo.dayOfWeek}
          </Caption>
        </header>

        {/* 이중선 구분자 */}
        <Divider variant="double" spacing="xl" />

        {/* 아카이브 링크 */}
        <div className="flex justify-end mb-4">
          <Link
            href="/archive"
            className="inline-flex items-center gap-1 text-link hover:underline font-[family-name:var(--font-display)] text-sm tracking-wide"
          >
            <span>지난 브리핑 보기</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 뉴스 섹션들 */}
        <NewsSection
          section="politics"
          items={briefing.politics}
          showDivider={true}
        />

        <NewsSection
          section="economy"
          items={briefing.economy}
          showDivider={true}
        />

        <NewsSection
          section="society"
          items={briefing.society}
          showDivider={false}
        />

        {/* 베타 신청 CTA */}
        <SignupCTA />

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
