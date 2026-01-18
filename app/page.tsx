import Link from "next/link";
import { getTodayBriefing, getDateInfo } from "@/lib/mock";
import {
  Headline,
  Subheadline,
  DateDisplay,
  Caption,
} from "@/components/typography";
import { NewsSection } from "@/components/news/news-section";
import { SignupCTA } from "@/components/beta/signup-cta";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function HomePage() {
  const briefing = getTodayBriefing();

  if (!briefing) {
    return (
      <main className="min-h-screen relative">
        <AuroraBackground />
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
    <main className="min-h-screen relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* 헤더 - 글라스모피즘 히어로 섹션 */}
        <header className="text-center mb-16">
          {/* 로고 영역 */}
          <div className="mb-10">
            <div className="relative inline-block">
              {/* 글로우 효과 */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-politics/20 via-economy/20 to-society/20 animate-pulse" />
              <Headline
                as="h1"
                size="hero"
                weight="bold"
                className="relative text-gradient tracking-[-0.03em]"
              >
                DAILY WRAP
              </Headline>
            </div>
            <Subheadline tone="muted" className="mt-3 tracking-widest uppercase text-sm">
              어제 하루, 한눈에
            </Subheadline>
          </div>

          {/* 날짜 표시 - 글라스 카드 */}
          <div className="glass-card inline-flex flex-col items-center px-8 py-6 rounded-2xl">
            <DateDisplay
              dateTime={briefing.date}
              size="lg"
              weight="medium"
              className="block mb-1 text-text-primary"
            >
              {dateInfo.formattedKorean}
            </DateDisplay>
            <Caption tone="muted" className="text-base tracking-wide">
              {dateInfo.dayOfWeek}
            </Caption>
          </div>
        </header>

        {/* 네비게이션 바 */}
        <nav className="flex items-center justify-between mb-12 glass-card rounded-xl px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-politics animate-pulse" />
              <Caption tone="muted" size="sm">POLITICS</Caption>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-economy animate-pulse" style={{ animationDelay: "0.3s" }} />
              <Caption tone="muted" size="sm">ECONOMY</Caption>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-society animate-pulse" style={{ animationDelay: "0.6s" }} />
              <Caption tone="muted" size="sm">SOCIETY</Caption>
            </span>
          </div>

          <Link
            href="/archive"
            className="inline-flex items-center gap-2 text-link hover:text-text-primary transition-colors font-[family-name:var(--font-display)] text-sm tracking-wide group"
          >
            <span>지난 브리핑 보기</span>
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>

        {/* 뉴스 섹션들 */}
        <div className="space-y-8">
          <NewsSection
            section="politics"
            items={briefing.politics}
            showDivider={false}
          />

          <NewsSection
            section="economy"
            items={briefing.economy}
            showDivider={false}
          />

          <NewsSection
            section="society"
            items={briefing.society}
            showDivider={false}
          />
        </div>

        {/* 베타 신청 CTA */}
        <SignupCTA />

        {/* 푸터 */}
        <footer className="text-center py-12 mt-16">
          <div className="glass-card inline-block rounded-full px-8 py-4">
            <Caption tone="muted" size="sm">
              © 2026 Daily Wrap · AI로 자동 생성된 뉴스 요약 서비스
            </Caption>
          </div>
        </footer>
      </div>
    </main>
  );
}
