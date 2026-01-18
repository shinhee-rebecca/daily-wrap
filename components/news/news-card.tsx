"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Headline, BodyText, Caption } from "@/components/typography";

const newsCardVariants = cva(
  "group block transition-all duration-300 ease-out rounded-xl",
  {
    variants: {
      variant: {
        featured: "w-full",
        secondary: "w-full",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

type Section = "politics" | "economy" | "society";

const sectionGlowClasses: Record<Section, string> = {
  politics: "hover:shadow-[0_0_30px_rgba(255,77,109,0.15),inset_0_1px_0_rgba(255,77,109,0.1)]",
  economy: "hover:shadow-[0_0_30px_rgba(0,212,170,0.15),inset_0_1px_0_rgba(0,212,170,0.1)]",
  society: "hover:shadow-[0_0_30px_rgba(255,179,71,0.15),inset_0_1px_0_rgba(255,179,71,0.1)]",
};

const sectionBorderHover: Record<Section, string> = {
  politics: "hover:border-politics/30",
  economy: "hover:border-economy/30",
  society: "hover:border-society/30",
};

const sectionAccentColors: Record<Section, string> = {
  politics: "text-politics",
  economy: "text-economy",
  society: "text-society",
};

export interface NewsCardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof newsCardVariants> {
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  category?: Section;
}

const NewsCard = React.forwardRef<HTMLElement, NewsCardProps>(
  (
    {
      className,
      variant,
      title,
      summary,
      sourceName,
      sourceUrl,
      category = "politics",
      ...props
    },
    ref
  ) => {
    return (
      <article
        ref={ref}
        data-slot="news-card"
        data-variant={variant}
        data-category={category}
        className={cn(
          newsCardVariants({ variant }),
          "glass-card p-4 sm:p-5",
          sectionGlowClasses[category],
          sectionBorderHover[category],
          "hover:translate-y-[-2px]",
          className
        )}
        {...props}
      >
        {/* 카테고리 인디케이터 */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className={cn("w-1.5 h-1.5 rounded-full", `bg-${category}`)} />
          <Caption
            tone="muted"
            size="sm"
            uppercase
            className="tracking-widest opacity-60 text-[10px] sm:text-xs"
          >
            {category}
          </Caption>
        </div>

        <Headline
          as={variant === "featured" ? "h2" : "h3"}
          size={variant === "featured" ? "h2" : "h3"}
          weight="semibold"
          className={cn(
            "mb-2 sm:mb-3 text-text-primary group-hover:text-white transition-colors",
            variant === "featured" ? "text-lg sm:text-xl md:text-2xl leading-snug" : "text-base sm:text-lg"
          )}
        >
          {title}
        </Headline>

        <BodyText
          size={variant === "featured" ? "default" : "sm"}
          tone="secondary"
          className={cn(
            "mb-3 sm:mb-4 leading-relaxed",
            variant === "featured" ? "text-sm sm:text-base" : "text-xs sm:text-sm"
          )}
        >
          {summary}
        </BodyText>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 transition-all duration-200 min-h-[44px] min-w-[44px] -m-2 p-2",
            "opacity-70 group-hover:opacity-100",
            sectionAccentColors[category]
          )}
        >
          <Caption tone="muted" className="font-medium group-hover:text-current transition-colors text-xs sm:text-sm">
            {sourceName}
          </Caption>
          <span className="text-sm group-hover:translate-x-1 transition-transform" aria-hidden="true">
            &rarr;
          </span>
        </a>
      </article>
    );
  }
);
NewsCard.displayName = "NewsCard";

export { NewsCard, newsCardVariants };
