/**
 * JSON-LD 구조화 데이터 컴포넌트
 * Google Rich Results Test 통과 가능한 구조 구현
 */

import type { Briefing, NewsItem } from "@/types/briefing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dailywrap.kr";

/**
 * 웹사이트 스키마 JSON-LD
 */
export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Daily Wrap",
    alternateName: "데일리랩",
    url: siteUrl,
    description:
      "매일 아침, 어제 하루 동안 있었던 정치/경제/사회 뉴스를 AI가 자동으로 요약하여 제공하는 뉴스 큐레이션 서비스",
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: "Daily Wrap",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/archive?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * 뉴스 브리핑 컬렉션 스키마 JSON-LD
 */
interface BriefingJsonLdProps {
  briefing: Briefing;
  dateFormatted: string;
}

export function BriefingJsonLd({ briefing, dateFormatted }: BriefingJsonLdProps) {
  const allNewsItems = [
    ...briefing.politics,
    ...briefing.economy,
    ...briefing.society,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Daily Wrap - ${dateFormatted}`,
    description: `${dateFormatted} 뉴스 브리핑: 정치, 경제, 사회 주요 뉴스 AI 요약`,
    url: `${siteUrl}/archive/${briefing.date}`,
    datePublished: briefing.publishedAt || briefing.createdAt,
    dateModified: briefing.createdAt,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: "Daily Wrap",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Daily Wrap",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allNewsItems.length,
      itemListElement: allNewsItems.slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: item.title,
          description: item.summary,
          url: item.sourceUrl,
          datePublished: briefing.date,
          publisher: {
            "@type": "Organization",
            name: item.sourceName,
          },
          articleSection: getCategoryLabel(item.category),
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * 개별 뉴스 아이템 스키마 JSON-LD
 */
interface NewsArticleJsonLdProps {
  item: NewsItem;
  briefingDate: string;
}

export function NewsArticleJsonLd({ item, briefingDate }: NewsArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    url: item.sourceUrl,
    datePublished: briefingDate,
    inLanguage: "ko-KR",
    articleSection: getCategoryLabel(item.category),
    publisher: {
      "@type": "Organization",
      name: item.sourceName,
    },
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * 아카이브 목록 페이지 스키마 JSON-LD
 */
interface ArchiveListJsonLdProps {
  briefings: { date: string; newsCount: number }[];
}

export function ArchiveListJsonLd({ briefings }: ArchiveListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Daily Wrap 아카이브",
    description: "Daily Wrap 뉴스 브리핑 아카이브 - 지난 브리핑 모아보기",
    url: `${siteUrl}/archive`,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: "Daily Wrap",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: briefings.length,
      itemListElement: briefings.map((briefing, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/archive/${briefing.date}`,
        name: `${briefing.date} 뉴스 브리핑 (${briefing.newsCount}개 뉴스)`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * FAQ 스키마 JSON-LD (서비스 소개용)
 */
export function ServiceFaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Daily Wrap은 어떤 서비스인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Daily Wrap은 매일 아침 어제 하루 동안 있었던 정치, 경제, 사회 뉴스를 AI가 자동으로 요약하여 제공하는 뉴스 큐레이션 서비스입니다. 바쁜 직장인을 위해 핵심 뉴스만 간결하게 전달합니다.",
        },
      },
      {
        "@type": "Question",
        name: "뉴스는 언제 업데이트되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "매일 아침 6시(KST)에 전날의 주요 뉴스가 자동으로 수집, 요약되어 업데이트됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "어떤 카테고리의 뉴스를 제공하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "정치, 경제, 사회 세 가지 카테고리의 주요 뉴스를 제공합니다. 각 카테고리별로 중요도가 높은 뉴스를 선별하여 요약합니다.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 유틸리티 함수
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    politics: "정치",
    economy: "경제",
    society: "사회",
  };
  return labels[category] || category;
}
