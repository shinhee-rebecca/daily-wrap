import { AuroraBackground } from "@/components/ui/aurora-background";

/**
 * 메인 페이지 로딩 상태
 * Streaming/Suspense를 위한 스켈레톤 UI
 */
export default function Loading() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20">
        {/* 헤더 스켈레톤 */}
        <header className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="h-12 sm:h-14 md:h-16 lg:h-20 w-64 sm:w-80 md:w-96 mx-auto rounded-lg glass-card shimmer" />
            <div className="h-4 w-32 mx-auto mt-3 rounded glass-card shimmer" />
          </div>

          <div className="glass-card inline-flex flex-col items-center px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl">
            <div className="h-6 sm:h-7 md:h-8 w-40 sm:w-48 rounded shimmer" />
            <div className="h-4 w-16 mt-2 rounded shimmer" />
          </div>
        </header>

        {/* 네비게이션 바 스켈레톤 */}
        <div className="glass-card rounded-xl px-4 sm:px-6 py-3 sm:py-4 mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-4 w-20 rounded shimmer" />
              <div className="h-4 w-20 rounded shimmer" />
              <div className="h-4 w-20 rounded shimmer" />
            </div>
            <div className="h-4 w-28 rounded shimmer" />
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
        <div className="glass-card rounded-2xl p-6 md:p-8 mt-12 sm:mt-14 md:mt-16 text-center">
          <div className="h-6 w-64 mx-auto mb-4 rounded shimmer" />
          <div className="h-12 w-48 mx-auto rounded-lg shimmer" />
        </div>

        {/* 푸터 스켈레톤 */}
        <footer className="text-center py-8 sm:py-10 md:py-12 mt-12 sm:mt-14 md:mt-16">
          <div className="h-10 w-80 mx-auto rounded-full glass-card shimmer" />
        </footer>
      </div>
    </main>
  );
}
