"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Headline, BodyText, Caption } from "@/components/typography";

const newsCardVariants = cva(
  "group block p-4 transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        featured: "w-full",
        secondary: "w-full lg:w-1/2",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

type Section = "politics" | "economy" | "society";

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
      category,
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
          "hover:bg-bg-hover hover:translate-x-1",
          className
        )}
        {...props}
      >
        <Headline
          as={variant === "featured" ? "h2" : "h3"}
          size={variant === "featured" ? "h2" : "h3"}
          weight="semibold"
          className="mb-2 text-text-primary"
        >
          {title}
        </Headline>

        <BodyText
          size={variant === "featured" ? "default" : "sm"}
          tone="secondary"
          className="mb-3 line-clamp-3"
        >
          {summary}
        </BodyText>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-link hover:underline"
        >
          <Caption tone="link" className="font-medium">
            {sourceName}
          </Caption>
          <span className="text-link" aria-hidden="true">
            →
          </span>
        </a>
      </article>
    );
  }
);
NewsCard.displayName = "NewsCard";

export { NewsCard, newsCardVariants };
