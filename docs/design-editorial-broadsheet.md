# Daily Wrap 디자인 기획안: Editorial Broadsheet

## 1. 컨셉 개요

**디자인 방향**: 고급 신문의 격조 + 현대적 디지털 경험

클래식한 신문 에디토리얼 디자인에서 영감을 받아, 신뢰감과 권위를 전달하면서도 디지털 환경에 최적화된 읽기 경험을 제공합니다. "진지하게 뉴스를 소비하는 직장인"을 위한 프리미엄 뉴스 큐레이션 서비스로서의 정체성을 시각적으로 표현합니다.

---

## 2. 컬러 팔레트

### Primary Colors

| 용도 | 색상명 | HEX | 사용처 |
|------|--------|-----|--------|
| 배경 | Warm Cream | `#F8F6F1` | 메인 배경, 카드 배경 |
| 텍스트 | Charcoal | `#1A1A1A` | 본문, 헤드라인 |
| 보조 텍스트 | Slate Gray | `#4A4A4A` | 부제목, 설명문 |

### Accent Colors (섹션별)

| 섹션 | 색상명 | HEX | 사용처 |
|------|--------|-----|--------|
| 정치 | Editorial Red | `#C41E3A` | 정치 섹션 태그, 강조선 |
| 경제 | Forest Green | `#2D4A3E` | 경제 섹션 태그, 강조선 |
| 사회 | Saddle Brown | `#8B4513` | 사회 섹션 태그, 강조선 |

### Utility Colors

| 용도 | 색상명 | HEX |
|------|--------|-----|
| 구분선 | Light Border | `#E5E2DB` |
| 호버 배경 | Hover Cream | `#F0EDE6` |
| 링크 | Deep Blue | `#1A365D` |

### CSS Variables

```css
:root {
  /* Background */
  --color-bg-primary: #F8F6F1;
  --color-bg-secondary: #FFFFFF;
  --color-bg-hover: #F0EDE6;

  /* Text */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-muted: #6B6B6B;

  /* Sections */
  --color-politics: #C41E3A;
  --color-economy: #2D4A3E;
  --color-society: #8B4513;

  /* Utility */
  --color-border: #E5E2DB;
  --color-link: #1A365D;
}
```

---

## 3. 타이포그래피

### 폰트 선택

| 용도 | 폰트 | Fallback | 특징 |
|------|------|----------|------|
| 헤드라인 | Playfair Display | Georgia, serif | 클래식한 신문 느낌의 세리프 |
| 본문 (영문) | Source Serif 4 | Georgia, serif | 가독성 높은 본문용 세리프 |
| 본문 (한글) | Noto Serif KR | 바탕, serif | 격조 있는 한글 세리프 |
| UI/날짜 | Cormorant Garamond | Times, serif | 우아한 디스플레이 세리프 |

### 타이포그래피 스케일

```css
/* Headings */
--font-size-hero: 4rem;      /* 64px - 날짜 표시 */
--font-size-h1: 2.5rem;      /* 40px - 메인 헤드라인 */
--font-size-h2: 1.75rem;     /* 28px - 섹션 제목 */
--font-size-h3: 1.25rem;     /* 20px - 뉴스 제목 */

/* Body */
--font-size-body: 1.0625rem; /* 17px - 본문 */
--font-size-small: 0.875rem; /* 14px - 부가 정보 */
--font-size-caption: 0.75rem;/* 12px - 캡션 */

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.6;
--line-height-relaxed: 1.8;

/* Letter Spacing */
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.05em;
```

### 폰트 스택 CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=Cormorant+Garamond:wght@400;500;600&family=Noto+Serif+KR:wght@400;500;600;700&display=swap');

:root {
  --font-headline: 'Playfair Display', Georgia, serif;
  --font-body: 'Noto Serif KR', 'Source Serif 4', Georgia, serif;
  --font-display: 'Cormorant Garamond', Times, serif;
}
```

---

## 4. 레이아웃 시스템

### 그리드 구조

```
Desktop (1200px+): 12컬럼 그리드
├── 좌측 사이드바: 2컬럼 (날짜, 목차)
├── 메인 콘텐츠: 8컬럼 (뉴스 목록)
└── 우측 여백: 2컬럼 (여백 또는 광고)

Tablet (768px-1199px): 8컬럼 그리드
├── 메인 콘텐츠: 8컬럼
└── 사이드바 상단 배치

Mobile (< 768px): 4컬럼 그리드
└── 단일 컬럼 레이아웃
```

### 간격 시스템

```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */

  --container-max: 1200px;
  --content-max: 720px;
}
```

### 페이지 구조

```
┌─────────────────────────────────────────────────────────┐
│  HEADER: 로고 + 날짜 (대형 타이포)                        │
├─────────────────────────────────────────────────────────┤
│  ════════════════════════════════════════════════════   │ ← 장식 구분선
├─────────────────────────────────────────────────────────┤
│  SECTION: 정치                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ■ 헤드라인 1 (메인)                              │   │
│  │   요약문 2-3문장...                              │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ ■ 헤드라인 2        │ ■ 헤드라인 3              │   │ ← 2단 레이아웃
│  │   요약문...         │   요약문...               │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  ────────────────────────────────────────────────────   │ ← 섹션 구분선
├─────────────────────────────────────────────────────────┤
│  SECTION: 경제                                          │
│  (동일 구조 반복)                                        │
├─────────────────────────────────────────────────────────┤
│  SECTION: 사회                                          │
│  (동일 구조 반복)                                        │
├─────────────────────────────────────────────────────────┤
│  FOOTER: 구독 CTA + 저작권                              │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 컴포넌트 디자인

### 5.1 헤더 (Header)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    DAILY WRAP                           │ ← Playfair Display, 굵게
│                 어제 하루, 한눈에                         │ ← 작은 서브타이틀
│                                                         │
│                  2026년 1월 17일                         │ ← Cormorant, 대형
│                      금요일                              │
│                                                         │
│  ═══════════════════════════════════════════════════   │ ← 이중선 구분
└─────────────────────────────────────────────────────────┘
```

### 5.2 섹션 헤더 (Section Header)

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────┐                                               │
│  │ 정치 │ ─────────────────────────────────────────    │ ← 태그 + 실선
│  └──────┘                                               │
│  POLITICS                                               │ ← 영문 라벨 (작게)
└─────────────────────────────────────────────────────────┘
```

- 태그: 섹션 색상 배경 + 흰색 텍스트
- 실선: 1px solid, 섹션 색상
- 영문 라벨: letter-spacing 넓게, 작은 크기

### 5.3 뉴스 카드 (News Card)

#### 메인 뉴스 (Featured)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  윤석열 대통령 탄핵심판 첫 변론기일, 헌재 앞              │ ← h3, Playfair
│  집회 인파 몰려                                          │
│                                                         │
│  헌법재판소는 17일 오전 10시 대심판정에서 윤석열 대통령   │ ← 본문, Noto Serif
│  탄핵심판 사건의 첫 변론기일을 열었다. 이날 헌재 앞에는   │
│  탄핵을 찬성하는 시민들과 반대하는 시민들이 대규모로      │
│  집결했다. 양측은 각자의 주장을 담은 피켓을 들고 구호를   │
│  외쳤다. 경찰은 충돌 방지를 위해 병력을 배치했다...      │
│                                                         │
│  연합뉴스 →                                             │ ← 출처 링크
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 서브 뉴스 (Secondary)

```
┌──────────────────────────┐  ┌──────────────────────────┐
│                          │  │                          │
│  국민의힘, 비대위원장    │  │  민주당 이재명 대표,     │
│  후보 3인 압축           │  │  검찰 출석 예정          │
│                          │  │                          │
│  당 지도부 교체를 위한   │  │  선거법 위반 혐의로      │
│  비상대책위원회 구성이   │  │  기소된 이재명 대표가    │
│  진행 중이다. 후보군은   │  │  검찰 조사에 응할 예정   │
│  각자의 비전을 제시...   │  │  이다. 이번 조사에서...  │
│                          │  │                          │
│  조선일보 →              │  │  한겨레 →                │
│                          │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

### 5.4 구분선 스타일

```css
/* 메인 구분선 (헤더 하단) */
.divider-main {
  border: none;
  height: 3px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-text-primary) 20%,
    var(--color-text-primary) 80%,
    transparent
  );
}

/* 이중선 */
.divider-double {
  border: none;
  height: 4px;
  border-top: 1px solid var(--color-text-primary);
  border-bottom: 1px solid var(--color-text-primary);
}

/* 섹션 구분선 */
.divider-section {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-2xl) 0;
}

/* 점선 */
.divider-dotted {
  border: none;
  border-top: 1px dotted var(--color-text-muted);
}
```

### 5.5 구독 CTA

```
┌─────────────────────────────────────────────────────────┐
│  ╔═════════════════════════════════════════════════╗   │
│  ║                                                 ║   │
│  ║   매일 아침 7시, 카카오톡으로 먼저 받아보세요      ║   │
│  ║                                                 ║   │
│  ║   ┌─────────────────────────────────────┐      ║   │
│  ║   │      베타 테스터 신청하기 →          │      ║   │ ← 버튼
│  ║   └─────────────────────────────────────┘      ║   │
│  ║                                                 ║   │
│  ║   * 베타 기간 중 무료 제공                      ║   │
│  ║                                                 ║   │
│  ╚═════════════════════════════════════════════════╝   │
└─────────────────────────────────────────────────────────┘
```

---

## 6. 인터랙션 & 애니메이션

### 호버 효과

```css
/* 뉴스 카드 호버 */
.news-card {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.news-card:hover {
  background-color: var(--color-bg-hover);
  transform: translateX(4px);
}

/* 링크 호버 - 밑줄 애니메이션 */
.news-link {
  position: relative;
  text-decoration: none;
}

.news-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.news-link:hover::after {
  width: 100%;
}
```

### 페이지 로드 애니메이션

```css
/* 헤더 페이드인 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 섹션 순차 등장 */
.section {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.section:nth-child(1) { animation-delay: 0.1s; }
.section:nth-child(2) { animation-delay: 0.2s; }
.section:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 7. 반응형 디자인

### Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### 주요 변경사항

| 요소 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 날짜 크기 | 4rem | 3rem | 2rem |
| 헤드라인 | 2.5rem | 2rem | 1.5rem |
| 뉴스 그리드 | 2단 | 2단 | 1단 |
| 섹션 간격 | 3rem | 2rem | 1.5rem |
| 좌우 패딩 | 4rem | 2rem | 1rem |

---

## 8. 접근성 고려사항

- **색상 대비**: WCAG AA 기준 충족 (텍스트 대비 4.5:1 이상)
- **폰트 크기**: 본문 최소 16px 이상
- **터치 타겟**: 모바일에서 최소 44x44px
- **포커스 상태**: 키보드 네비게이션을 위한 명확한 포커스 링
- **시맨틱 마크업**: 적절한 heading 계층 구조

---

## 9. 디자인 토큰 요약

```css
:root {
  /* Colors */
  --color-bg-primary: #F8F6F1;
  --color-bg-hover: #F0EDE6;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-politics: #C41E3A;
  --color-economy: #2D4A3E;
  --color-society: #8B4513;
  --color-border: #E5E2DB;
  --color-link: #1A365D;

  /* Typography */
  --font-headline: 'Playfair Display', Georgia, serif;
  --font-body: 'Noto Serif KR', 'Source Serif 4', serif;
  --font-display: 'Cormorant Garamond', Times, serif;

  /* Spacing */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 4px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
}
```

---

## 10. 참고 레퍼런스

- The New York Times (nytimes.com)
- Financial Times (ft.com)
- The Economist (economist.com)
- Monocle Magazine
- 조선일보 프리미엄

---

*이 디자인 기획안은 Daily Wrap 서비스의 프론트엔드 개발 가이드로 활용됩니다.*
