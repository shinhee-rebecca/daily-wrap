"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/news/section-header";
import { NewsCard } from "@/components/news/news-card";
import type { NewsItem, NewsCategory } from "@/types/briefing";

export interface NewsSectionProps extends React.HTMLAttributes<HTMLElement> {
  section: NewsCategory;
  items: NewsItem[];
  showDivider?: boolean;
}

const NewsSection = React.forwardRef<HTMLElement, NewsSectionProps>(
  ({ className, section, items, showDivider = true, ...props }, ref) => {
    // 중요도 순으로 정렬
    const sortedItems = [...items].sort(
      (a, b) => a.importanceRank - b.importanceRank
    );

    // 첫 번째는 featured, 나머지는 secondary
    const featuredItem = sortedItems[0];
    const secondaryItems = sortedItems.slice(1);

    if (!featuredItem) {
      return null;
    }

    return (
      <section
        ref={ref}
        data-slot="news-section"
        data-section={section}
        className={cn("glass-card rounded-2xl p-6 md:p-8", className)}
        {...props}
      >
        <SectionHeader section={section} />

        {/* Featured 뉴스 - 더 큰 카드 */}
        <div className="mb-6">
          <NewsCard
            variant="featured"
            title={featuredItem.title}
            summary={featuredItem.summary}
            sourceName={featuredItem.sourceName}
            sourceUrl={featuredItem.sourceUrl}
            category={section}
            className="bg-glass-highlight/50"
          />
        </div>

        {/* Secondary 뉴스 그리드 */}
        {secondaryItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryItems.map((item, index) => (
              <NewsCard
                key={item.id}
                variant="secondary"
                title={item.title}
                summary={item.summary}
                sourceName={item.sourceName}
                sourceUrl={item.sourceUrl}
                category={section}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </section>
    );
  }
);
NewsSection.displayName = "NewsSection";

export { NewsSection };
