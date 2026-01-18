# 네이버 뉴스 RSS 피드 문서

> 최종 업데이트: 2026-01-19

## 개요

Daily Wrap은 정치/경제/사회 3개 카테고리의 뉴스를 수집합니다.
네이버 뉴스 자체의 카테고리별 공식 RSS는 제공되지 않아, 주요 언론사 RSS를 활용합니다.

## 사용 RSS 피드

### 정치 (politics)

| 언론사 | RSS URL | 비고 |
|--------|---------|------|
| MBC | `http://imnews.imbc.com/rss/news/news_01.xml` | 정치 섹션 |
| 조선일보 | `http://www.chosun.com/site/data/rss/politics.xml` | 정치 |
| 중앙일보 | `http://rss.joinsmsn.com/joins_politics_list.xml` | 정치 |
| 노컷뉴스 | `http://rss.nocutnews.co.kr/NocutPolitics.xml` | 정치 |
| 동아일보 | `http://rss.donga.com/politics.xml` | 정치 |

### 경제 (economy)

| 언론사 | RSS URL | 비고 |
|--------|---------|------|
| MBC | `http://imnews.imbc.com/rss/news/news_04.xml` | 경제 섹션 |
| 중앙일보 | `http://rss.joinsmsn.com/joins_money_list.xml` | 경제 |
| 한국경제 | `http://rss.hankyung.com/economy.xml` | 경제 |
| 파이낸셜뉴스 | `http://www.fnnews.com/rss/fn_realnews_economy.xml` | 실시간 경제 |
| 동아일보 | `http://rss.donga.com/economy.xml` | 경제 |

### 사회 (society)

| 언론사 | RSS URL | 비고 |
|--------|---------|------|
| MBC | `http://imnews.imbc.com/rss/news/news_05.xml` | 사회 섹션 |
| 노컷뉴스 | `http://rss.nocutnews.co.kr/NocutSocial.xml` | 사회 |
| 동아일보 | `http://rss.donga.com/national.xml` | 전국/사회 |
| 조선일보 | `http://www.chosun.com/site/data/rss/national.xml` | 사회 |
| 중앙일보 | `http://rss.joinsmsn.com/joins_social_list.xml` | 사회 |

## 파이프라인 설정

`scripts/pipeline/rss-fetcher.ts`에서 사용하는 기본 피드:

```typescript
const RSS_FEEDS = {
  politics: [
    "http://imnews.imbc.com/rss/news/news_01.xml",
    "http://rss.donga.com/politics.xml",
    "http://rss.nocutnews.co.kr/NocutPolitics.xml",
  ],
  economy: [
    "http://imnews.imbc.com/rss/news/news_04.xml",
    "http://rss.donga.com/economy.xml",
    "http://rss.hankyung.com/economy.xml",
  ],
  society: [
    "http://imnews.imbc.com/rss/news/news_05.xml",
    "http://rss.donga.com/national.xml",
    "http://rss.nocutnews.co.kr/NocutSocial.xml",
  ],
};
```

## 주의사항

1. **저작권**: 헤드라인 + AI 재작성 요약만 사용, 원문 복사 금지
2. **원본 링크**: 반드시 원본 기사 링크 제공
3. **피드 상태**: 일부 피드는 언론사 정책에 따라 변경될 수 있음
4. **에러 처리**: 피드 접근 실패 시 graceful하게 처리 (다른 피드로 대체)

## 참고 자료

- [Korean News RSS URLs (GitHub Gist)](https://gist.github.com/koorukuroo/330a644fcc3c9ffdc7b6d537efd939c3)
- [RSS 피드 활용 뉴스 데이터 수집](https://junpyopark.github.io/rss_parse/)
