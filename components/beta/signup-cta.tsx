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
          "relative border-2 border-text-primary p-8 md:p-12 my-12",
          className
        )}
        {...props}
      >
        {/* 장식 코너 */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-text-primary -translate-x-0.5 -translate-y-0.5" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-text-primary translate-x-0.5 -translate-y-0.5" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-text-primary -translate-x-0.5 translate-y-0.5" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-text-primary translate-x-0.5 translate-y-0.5" />

        <div className="text-center">
          {/* 카운터 */}
          <div className="mb-6">
            <span className="inline-flex items-baseline gap-1 font-[family-name:var(--font-display)] text-3xl md:text-4xl font-medium text-text-primary">
              <span className="text-politics">{stats.currentCount}</span>
              <span className="text-text-muted">/</span>
              <span>{stats.targetCount}</span>
            </span>
            <Caption as="p" tone="muted" className="mt-2">
              베타 테스터 모집 중
            </Caption>
          </div>

          {/* 타이틀 */}
          <Headline as="h2" size="h2" weight="semibold" className="mb-4">
            매일 아침 7시, 카카오톡으로 먼저 받아보세요
          </Headline>

          <BodyText tone="secondary" className="mb-8 max-w-md mx-auto">
            베타 기간 중 무료로 제공됩니다. 매일 아침 출근 전, 어제 하루의 뉴스를
            한눈에 파악하세요.
          </BodyText>

          {isSubmitted ? (
            <div className="bg-bg-hover p-6 rounded">
              <Headline as="p" size="h3" weight="medium" className="text-economy mb-2">
                신청이 완료되었습니다!
              </Headline>
              <BodyText tone="secondary" size="sm">
                베타 서비스 오픈 시 안내 메시지를 보내드리겠습니다.
              </BodyText>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="이메일 주소 (필수)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border-border-editorial focus:border-text-primary focus:ring-1 focus:ring-text-primary"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="카카오톡 ID (선택)"
                  value={kakaoId}
                  onChange={(e) => setKakaoId(e.target.value)}
                  className="w-full bg-white border-border-editorial focus:border-text-primary focus:ring-1 focus:ring-text-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-text-primary text-bg-primary hover:bg-text-secondary font-[family-name:var(--font-body)] font-medium py-3"
              >
                {isSubmitting ? "신청 중..." : "베타 테스터 신청하기 →"}
              </Button>
            </form>
          )}

          <Caption as="p" tone="muted" size="sm" className="mt-6">
            * 베타 기간 종료 후 유료 전환 시 얼리버드 혜택이 제공됩니다
          </Caption>
        </div>
      </div>
    );
  }
);
SignupCTA.displayName = "SignupCTA";

export { SignupCTA };
