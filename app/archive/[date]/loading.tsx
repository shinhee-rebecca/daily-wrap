import { AuroraBackground } from "@/components/ui/aurora-background";

/**
 * 날짜별 브리핑 페이지 로딩 상태
 */
export default function Loading() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* 헤더 스켈레톤 */}
        <header className="text-center mb-8">
          <div className="h-10 sm:h-12 md:h-14 w-48 sm:w-56 md:w-64 mx-auto mb-2 rounded-lg glass-card shimmer" />
          <div className="h-4 w-28 mx-auto mb-6 rounded glass-card shimmer" />

          <div className="glass-card inline-flex flex-col items-center px-6 py-5 rounded-2xl">
            <div className="h-7 sm:h-8 md:h-10 w-36 sm:w-44 mb-2 rounded shimmer" />
            <div className="h-4 w-16 rounded shimmer" />
          </div>
        </header>

        {/* 구분선 */}
        <div className="h-1 w-full mb-8 glass-card shimmer" />

        {/* 네비게이션 스켈레톤 */}
        <div className="glass-card rounded-xl px-4 py-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 rounded shimmer" />
            <div className="h-5 w-12 rounded shimmer" />
            <div className="h-5 w-20 rounded shimmer" />
          </div>
        </div>

        {/* 뉴스 섹션 스켈레톤 */}
        <div className="space-y-6 sm:space-y-8">
          {[1, 2, 3].map((section) => (
            <div key={section} className="glass-card rounded-2xl p-6 md:p-8">
              {/* 섹션 헤더 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-16 rounded shimmer" />
                <div className="flex-1 h-px bg-border-glass shimmer" />
              </div>
              <div className="h-4 w-20 mb-6 rounded shimmer" />

              {/* Featured 뉴스 */}
              <div className="p-4 sm:p-6 rounded-xl glass-card mb-6">
                <div className="h-6 sm:h-7 w-3/4 mb-3 rounded shimmer" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded shimmer" />
                  <div className="h-4 w-5/6 rounded shimmer" />
                  <div className="h-4 w-4/6 rounded shimmer" />
                </div>
                <div className="h-4 w-24 mt-4 rounded shimmer" />
              </div>

              {/* Secondary 뉴스 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="p-4 rounded-xl glass-card">
                    <div className="h-5 w-4/5 mb-2 rounded shimmer" />
                    <div className="space-y-1">
                      <div className="h-3 w-full rounded shimmer" />
                      <div className="h-3 w-3/4 rounded shimmer" />
                    </div>
                    <div className="h-3 w-20 mt-3 rounded shimmer" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA 스켈레톤 */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mt-12 text-center">
          <div className="h-6 w-64 mx-auto mb-4 rounded shimmer" />
          <div className="h-12 w-48 mx-auto rounded-lg shimmer" />
        </div>

        {/* 푸터 스켈레톤 */}
        <footer className="text-center py-8 mt-8">
          <div className="h-10 w-64 mx-auto rounded-full glass-card shimmer" />
        </footer>
      </div>
    </main>
  );
}
