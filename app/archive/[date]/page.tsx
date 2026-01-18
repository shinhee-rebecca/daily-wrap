import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBriefingByDate,
  getDateInfo,
  getAdjacentBriefingDates,
  getAllBriefingDates,
} from "@/lib/mock";
import { Headline, Subheadline, DateDisplay, Caption } from "@/components/typography";
import { Divider } from "@/components/ui/divider";
import { NewsSection } from "@/components/news/news-section";
import { SignupCTA } from "@/components/beta/signup-cta";

interface ArchiveDatePageProps {
  params: Promise<{
    date: string;
  }>;
}

// 정적 생성을 위한 params
export async function generateStaticParams() {
  const dates = getAllBriefingDates();
  return dates.map((date) => ({
    date,
  }));
}

export default async function ArchiveDatePage({ params }: ArchiveDatePageProps) {
  const { date } = await params;
  const briefing = getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  const dateInfo = getDateInfo(briefing.date);
  const { prev, next } = getAdjacentBriefingDates(date);

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Headline
              as="h1"
              size="hero"
              weight="bold"
              className="tracking-tight mb-2 hover:text-text-secondary transition-colors"
            >
              DAILY WRAP
            </Headline>
          </Link>
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

        {/* 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {prev ? (
              <Link
                href={`/archive/${prev}`}
                className="inline-flex items-center gap-1 text-link hover:underline font-[family-name:var(--font-display)] text-sm tracking-wide"
              >
                <span aria-hidden="true">←</span>
                <span>이전 날</span>
              </Link>
            ) : (
              <span className="text-text-muted text-sm">이전 브리핑 없음</span>
            )}
          </div>

          <Link
            href="/archive"
            className="inline-flex items-center gap-1 text-link hover:underline font-[family-name:var(--font-display)] text-sm tracking-wide"
          >
            <span>목록으로</span>
          </Link>

          <div>
            {next ? (
              <Link
                href={next === getAllBriefingDates()[0] ? "/" : `/archive/${next}`}
                className="inline-flex items-center gap-1 text-link hover:underline font-[family-name:var(--font-display)] text-sm tracking-wide"
              >
                <span>다음 날</span>
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-link hover:underline font-[family-name:var(--font-display)] text-sm tracking-wide"
              >
                <span>오늘로</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
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
