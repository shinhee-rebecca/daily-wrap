import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Headline, Subheadline, BodyText } from "@/components/typography";

/**
 * 날짜별 브리핑 404 페이지
 */
export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <AuroraBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          {/* 404 아이콘 */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-economy/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-economy"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <Headline as="h1" size="h2" className="mb-3">
            브리핑을 찾을 수 없습니다
          </Headline>

          <Subheadline tone="secondary" className="mb-6">
            해당 날짜의 브리핑이 존재하지 않습니다.
          </Subheadline>

          <BodyText tone="muted" size="sm" className="mb-8">
            아카이브 목록에서 다른 날짜를 선택하거나, 오늘의 브리핑을 확인해 주세요.
          </BodyText>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/archive"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-medium hover:bg-text-secondary transition-colors"
            >
              아카이브 목록
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg border border-border-glass text-text-primary hover:bg-bg-hover transition-colors"
            >
              오늘 브리핑 보기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
