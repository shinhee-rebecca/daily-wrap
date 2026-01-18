"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Headline, BodyText, Caption } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBetaSignupStats } from "@/lib/mock";

export interface SignupCTAProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignupCTA = React.forwardRef<HTMLDivElement, SignupCTAProps>(
  ({ className, ...props }, ref) => {
    const [email, setEmail] = React.useState("");
    const [kakaoId, setKakaoId] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const stats = getBetaSignupStats();
    const progressPercent = (stats.currentCount / stats.targetCount) * 100;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Mock 제출 - 실제 API로 교체 시: fetch('/api/beta-signup', { ... })
      console.log("베타 신청:", { email, kakaoId });

      // 시뮬레이션을 위한 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitting(false);
      setIsSubmitted(true);
    };

    return (
      <div
        ref={ref}
        data-slot="signup-cta"
        className={cn(
          "relative my-16 rounded-2xl overflow-hidden",
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

        <div className="relative p-8 md:p-12">
          <div className="text-center max-w-lg mx-auto">
            {/* 프로그레스 인디케이터 */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-baseline gap-1.5 font-[family-name:var(--font-display)]">
                  <span className="text-4xl md:text-5xl font-medium text-economy">
                    {stats.currentCount}
                  </span>
                  <span className="text-2xl text-text-muted">/</span>
                  <span className="text-2xl text-text-secondary">
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
            <Headline as="h2" size="h2" weight="semibold" className="mb-4 text-text-primary">
              매일 아침 7시
              <br />
              <span className="text-gradient">카카오톡으로 먼저 받아보세요</span>
            </Headline>

            <BodyText tone="secondary" className="mb-8 leading-relaxed">
              베타 기간 중 무료로 제공됩니다.
              <br className="hidden sm:block" />
              매일 아침 출근 전, 어제 하루의 뉴스를 한눈에 파악하세요.
            </BodyText>

            {isSubmitted ? (
              <div className="glass-card rounded-xl p-6">
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
                <Headline as="p" size="h3" weight="medium" className="text-economy mb-2">
                  신청이 완료되었습니다
                </Headline>
                <BodyText tone="muted" size="sm">
                  베타 서비스 오픈 시 안내 메시지를 보내드리겠습니다.
                </BodyText>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="이메일 주소 (필수)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-glass-bg border-glass-border text-text-primary placeholder:text-text-muted/60 focus:border-economy/50 focus:ring-1 focus:ring-economy/30 rounded-xl h-12"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="카카오톡 ID (선택)"
                    value={kakaoId}
                    onChange={(e) => setKakaoId(e.target.value)}
                    className="w-full bg-glass-bg border-glass-border text-text-primary placeholder:text-text-muted/60 focus:border-economy/50 focus:ring-1 focus:ring-economy/30 rounded-xl h-12"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={cn(
                    "w-full h-12 rounded-xl font-[family-name:var(--font-body)] font-medium text-base",
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
