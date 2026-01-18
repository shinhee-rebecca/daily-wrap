import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBriefingByDate,
  getDateInfo,
  getAdjacentBriefingDates,
  getAllBriefingDates,
  getTodayDate,
} from "@/lib/data/briefings";
import { Headline, Subheadline, DateDisplay, Caption } from "@/components/typography";
import { Divider } from "@/components/ui/divider";
import { NewsSection } from "@/components/news/news-section";
import { SignupCTA } from "@/components/beta/signup-cta";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface ArchiveDatePageProps {
  params: Promise<{
    date: string;
  }>;
}

// ISR 설정: 1시간마다 재검증
export const revalidate = 3600;

// 정적 생성을 위한 params
export async function generateStaticParams() {
  const dates = await getAllBriefingDates();
  return dates.map((date) => ({
    date,
  }));
}

export default async function ArchiveDatePage({ params }: ArchiveDatePageProps) {
  const { date } = await params;
  const briefing = await getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  const dateInfo = getDateInfo(briefing.date);
  const { prev, next } = await getAdjacentBriefingDates(date);
  const todayDate = await getTodayDate();

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <Headline
              as="h1"
              size="hero"
              weight="bold"
              className="tracking-tight mb-2 text-gradient group-hover:opacity-80 transition-opacity text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            >
              DAILY WRAP
            </Headline>
          </Link>
          <Subheadline tone="secondary" className="mb-4 sm:mb-6 text-sm sm:text-base">
            어제 하루, 한눈에
          </Subheadline>

          <div className="glass-card inline-flex flex-col items-center px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl">
            <DateDisplay
              dateTime={briefing.date}
              size="hero"
              weight="normal"
              className="block mb-1 text-lg sm:text-xl md:text-2xl lg:text-3xl"
            >
              {dateInfo.formattedKorean}
            </DateDisplay>
            <Caption tone="muted" className="text-sm sm:text-base md:text-lg">
              {dateInfo.dayOfWeek}
            </Caption>
          </div>
        </header>

        {/* 이중선 구분자 */}
        <Divider variant="double" spacing="xl" />

        {/* 네비게이션 - 터치 타겟 44px 보장 */}
        <nav className="flex items-center justify-between mb-4 sm:mb-6 glass-card rounded-xl px-3 sm:px-4 py-2">
          <div className="min-w-[100px]">
            {prev ? (
              <Link
                href={`/archive/${prev}`}
                className="inline-flex items-center gap-1 text-link hover:text-text-primary transition-colors font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-wide min-h-[44px] min-w-[44px] px-2 -mx-2"
              >
                <span aria-hidden="true">&larr;</span>
                <span className="hidden sm:inline">이전 날</span>
                <span className="sm:hidden">이전</span>
              </Link>
            ) : (
              <span className="text-text-muted text-xs sm:text-sm px-2">
                <span className="hidden sm:inline">이전 브리핑 없음</span>
                <span className="sm:hidden">없음</span>
              </span>
            )}
          </div>

          <Link
            href="/archive"
            className="inline-flex items-center gap-1 text-link hover:text-text-primary transition-colors font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-wide min-h-[44px] min-w-[44px] px-2"
          >
            <span>목록</span>
          </Link>

          <div className="min-w-[100px] text-right">
            {next ? (
              <Link
                href={next === todayDate ? "/" : `/archive/${next}`}
                className="inline-flex items-center justify-end gap-1 text-link hover:text-text-primary transition-colors font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-wide min-h-[44px] min-w-[44px] px-2 -mx-2"
              >
                <span className="hidden sm:inline">다음 날</span>
                <span className="sm:hidden">다음</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center justify-end gap-1 text-link hover:text-text-primary transition-colors font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-wide min-h-[44px] min-w-[44px] px-2 -mx-2"
              >
                <span>오늘로</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>

        {/* 뉴스 섹션들 */}
        <div className="space-y-6 sm:space-y-8">
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
        </div>

        {/* 베타 신청 CTA */}
        <SignupCTA />

        {/* 푸터 */}
        <footer className="text-center py-8 mt-8">
          <div className="glass-card inline-block rounded-full px-5 sm:px-6 md:px-8 py-3 sm:py-4">
            <Caption tone="muted" size="sm">
              &copy; 2026 Daily Wrap. AI로 자동 생성된 뉴스 요약 서비스입니다.
            </Caption>
          </div>
        </footer>
      </div>
    </main>
  );
}
