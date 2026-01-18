"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Headline, Subheadline, BodyText } from "@/components/typography";

/**
 * 메인 페이지 에러 상태
 * 에러 발생 시 표시되는 fallback UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (추후 에러 모니터링 서비스 연동 가능)
    console.error("[HomePage Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <AuroraBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          {/* 에러 아이콘 */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-politics/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-politics"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <Headline as="h1" size="h2" className="mb-3">
            문제가 발생했습니다
          </Headline>

          <Subheadline tone="secondary" className="mb-6">
            브리핑을 불러오는 중 오류가 발생했습니다.
          </Subheadline>

          <BodyText tone="muted" size="sm" className="mb-8">
            잠시 후 다시 시도해 주세요. 문제가 계속되면 페이지를 새로고침해 주세요.
          </BodyText>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg bg-text-primary text-bg-primary font-medium hover:bg-text-secondary transition-colors"
            >
              다시 시도
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg border border-border-glass text-text-primary hover:bg-bg-hover transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>

          {/* 에러 디버그 정보 (개발 환경) */}
          {process.env.NODE_ENV === "development" && error.digest && (
            <div className="mt-8 p-4 rounded-lg bg-bg-hover text-left">
              <BodyText size="sm" tone="muted" className="font-mono">
                Error Digest: {error.digest}
              </BodyText>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
