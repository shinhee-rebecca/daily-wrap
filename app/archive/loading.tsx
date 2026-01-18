import { AuroraBackground } from "@/components/ui/aurora-background";

/**
 * 아카이브 페이지 로딩 상태
 */
export default function Loading() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* 헤더 스켈레톤 */}
        <header className="text-center mb-8">
          <div className="h-10 w-48 mx-auto mb-2 rounded-lg glass-card shimmer" />
          <div className="h-5 w-32 mx-auto rounded glass-card shimmer" />
        </header>

        {/* 구분선 */}
        <div className="h-1 w-full mb-8 glass-card shimmer" />

        {/* 오늘로 돌아가기 */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <div className="h-6 w-40 rounded glass-card shimmer" />
        </div>

        {/* 브리핑 목록 스켈레톤 */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="p-4 sm:p-5 border-b border-border-glass last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 sm:h-7 w-32 sm:w-40 rounded shimmer" />
                  <div className="h-4 w-16 rounded shimmer hidden sm:block" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 rounded shimmer" />
                  <div className="h-4 w-4 rounded shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 스켈레톤 */}
        <footer className="text-center py-8 mt-8">
          <div className="h-10 w-64 mx-auto rounded-full glass-card shimmer" />
        </footer>
      </div>
    </main>
  );
}
