"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Headline, BodyText, Caption } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBetaSignupStats } from "@/lib/mock";
import type { BetaSignupStats } from "@/types/briefing";

export interface SignupCTAProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignupCTA = React.forwardRef<HTMLDivElement, SignupCTAProps>(
  ({ className, ...props }, ref) => {
    const [email, setEmail] = React.useState("");
    const [kakaoId, setKakaoId] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [stats, setStats] = React.useState<BetaSignupStats>(getBetaSignupStats());

    // Fetch real stats from API
    React.useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await fetch("/api/beta-signup");
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setStats(data.data);
            }
          }
        } catch {
          // Use mock data as fallback
          console.log("[SignupCTA] Using mock stats as fallback");
        }
      };
      fetchStats();
    }, []);

    const progressPercent = (stats.currentCount / stats.targetCount) * 100;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/beta-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, kakaoId: kakaoId || null }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "신청 중 오류가 발생했습니다.");
        }

        setIsSubmitted(true);
        // Update stats
        if (data.data) {
          setStats((prev) => ({
            ...prev,
            currentCount: prev.currentCount + 1,
            remainingSlots: prev.remainingSlots - 1,
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "신청 중 오류가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="signup-cta"
        className={cn(
          "relative my-10 sm:my-12 md:my-16 rounded-xl sm:rounded-2xl overflow-hidden",
          className
        )}
        {...props}
      >
        {/* 배경 그라디언트 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-politics/10 via-economy/10 to-society/10" />
        <div className="absolute inset-0 glass-card" />

        {/* 장식 오브 */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-economy/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-politics/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-5 sm:p-8 md:p-12">
          <div className="text-center max-w-lg mx-auto">
            {/* 프로그레스 인디케이터 */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <span className="inline-flex items-baseline gap-1.5 font-[family-name:var(--font-display)]">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-medium text-economy">
                    {stats.currentCount}
                  </span>
                  <span className="text-xl sm:text-2xl text-text-muted">/</span>
                  <span className="text-xl sm:text-2xl text-text-secondary">
                    {stats.targetCount}
                  </span>
                </span>
              </div>

              {/* 프로그레스 바 */}
              <div className="relative h-1.5 bg-glass-border rounded-full overflow-hidden mb-3">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-politics via-economy to-society rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-politics via-economy to-society rounded-full blur-sm opacity-50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <Caption tone="muted" size="sm" className="tracking-wide">
                베타 테스터 모집 중
              </Caption>
            </div>

            {/* 타이틀 */}
            <Headline as="h2" size="h2" weight="semibold" className="mb-3 sm:mb-4 text-text-primary text-xl sm:text-2xl md:text-3xl">
              매일 아침 7시
              <br />
              <span className="text-gradient">카카오톡으로 먼저 받아보세요</span>
            </Headline>

            <BodyText tone="secondary" className="mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              베타 기간 중 무료로 제공됩니다.
              <br className="hidden sm:block" />
              매일 아침 출근 전, 어제 하루의 뉴스를 한눈에 파악하세요.
            </BodyText>

            {isSubmitted ? (
              <div className="glass-card rounded-xl p-4 sm:p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-economy/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-economy"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <Headline as="p" size="h3" weight="medium" className="text-economy mb-2 text-lg sm:text-xl">
                  신청이 완료되었습니다
                </Headline>
                <BodyText tone="muted" size="sm" className="text-xs sm:text-sm">
                  베타 서비스 오픈 시 안내 메시지를 보내드리겠습니다.
                </BodyText>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-politics/10 border border-politics/20 text-politics text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <Input
                    type="email"
                    placeholder="이메일 주소 (필수)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-glass-bg border-glass-border text-text-primary placeholder:text-text-muted/60 focus:border-economy/50 focus:ring-1 focus:ring-economy/30 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="카카오톡 ID (선택)"
                    value={kakaoId}
                    onChange={(e) => setKakaoId(e.target.value)}
                    className="w-full bg-glass-bg border-glass-border text-text-primary placeholder:text-text-muted/60 focus:border-economy/50 focus:ring-1 focus:ring-economy/30 rounded-lg sm:rounded-xl h-11 sm:h-12 text-sm sm:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={cn(
                    "w-full min-h-[44px] h-11 sm:h-12 rounded-lg sm:rounded-xl font-[family-name:var(--font-body)] font-medium text-sm sm:text-base",
                    "bg-gradient-to-r from-politics via-economy to-society",
                    "hover:opacity-90 transition-opacity",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "text-white shadow-lg",
                    "relative overflow-hidden group"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>신청 중...</span>
                      </>
                    ) : (
                      <>
                        <span>베타 테스터 신청하기</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </span>
                </Button>
              </form>
            )}

            <Caption as="p" tone="muted" size="sm" className="mt-6 opacity-60">
              베타 기간 종료 후 유료 전환 시 얼리버드 혜택이 제공됩니다
            </Caption>
          </div>
        </div>
      </div>
    );
  }
);
SignupCTA.displayName = "SignupCTA";

export { SignupCTA };
