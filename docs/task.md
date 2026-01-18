# Daily Wrap 개발 태스크 트래커

> 마지막 업데이트: 2026-01-18

## 진행 현황 요약

| Phase | 진행률 | 상태 |
|-------|--------|------|
| Phase 1: 디자인 시스템 | 0/8 | ⬜ 대기 |
| Phase 2: 데이터베이스 & API | 0/7 | ⬜ 대기 |
| Phase 3: 뉴스 파이프라인 | 0/10 | ⬜ 대기 |
| Phase 4: 웹 애플리케이션 | 0/10 | ⬜ 대기 |
| Phase 5: 베타 기능 | 0/6 | ⬜ 대기 |
| Phase 6: 마무리 & 배포 | 0/10 | ⬜ 대기 |
| **전체** | **0/51** | **0%** |

---

## Phase 1: 디자인 시스템 구축

### 1.1 타이포그래피 설정
- [ ] **Google Fonts 설정**
  - 파일: `app/layout.tsx`
  - 작업: Playfair Display, Noto Serif KR, Source Serif 4, Cormorant Garamond 폰트 추가
  - 완료조건: `--font-headline`, `--font-body`, `--font-display` CSS 변수가 동작
  - 테스트: `pnpm dev` 실행 후 DevTools에서 폰트 적용 확인

### 1.2 컬러 시스템 구현
- [ ] **Editorial Broadsheet 컬러 팔레트 적용**
  - 파일: `app/globals.css`
  - 작업:
    - 배경: Warm Cream `#F8F6F1`
    - 텍스트: Charcoal `#1A1A1A`, Slate Gray `#4A4A4A`
    - 섹션: 정치 `#C41E3A`, 경제 `#2D4A3E`, 사회 `#8B4513`
    - 유틸리티: Border `#E5E2DB`, Hover `#F0EDE6`, Link `#1A365D`
  - 완료조건: 모든 CSS 변수 정의 완료
  - 테스트: 페이지 배경이 Warm Cream, 텍스트가 Charcoal로 표시

### 1.3 Typography 컴포넌트
- [ ] **Typography 컴포넌트 생성**
  - 파일: `components/typography/index.tsx` (신규)
  - 작업: Headline, Subheadline, BodyText, Caption 컴포넌트 구현
  - 완료조건: 반응형 폰트 크기 (Desktop 4rem → Mobile 2rem)
  - 테스트: 1440px, 768px, 375px 뷰포트에서 렌더링 확인

### 1.4 레이아웃 시스템
- [ ] **그리드 & 간격 시스템 구현**
  - 파일: `app/globals.css`
  - 작업: 12컬럼 그리드, spacing 변수 (xs~3xl)
  - 완료조건: Desktop 12컬럼, Tablet 8컬럼, Mobile 4컬럼
  - 테스트: 반응형 브레이크포인트 동작 확인

### 1.5 UI 컴포넌트
- [ ] **Divider 컴포넌트**
  - 파일: `components/ui/divider.tsx` (신규)
  - 작업: main, double, section, dotted 4가지 variant
  - 완료조건: 디자인 스펙 섹션 5.4와 일치
  - 테스트: 각 variant 렌더링 확인

- [ ] **SectionTag 컴포넌트**
  - 파일: `components/ui/section-tag.tsx` (신규)
  - 작업: 정치/경제/사회 카테고리 태그
  - 완료조건: 섹션별 색상 적용 (정치 #C41E3A, 경제 #2D4A3E, 사회 #8B4513)
  - 테스트: 3가지 variant 색상 확인

- [ ] **NewsCard 컴포넌트**
  - 파일: `components/news/news-card.tsx` (신규)
  - 작업: featured (전체폭), secondary (절반폭) variant
  - 완료조건: hover 시 translateX(4px), 배경색 변경
  - 테스트: hover 효과 동작 확인

- [ ] **SectionHeader 컴포넌트**
  - 파일: `components/news/section-header.tsx` (신규)
  - 작업: 한글 섹션명 + 영문 라벨 + 장식선
  - 완료조건: 디자인 스펙 섹션 5.2와 일치
  - 테스트: 디자인 스펙과 비교

---

## Phase 2: 데이터베이스 & API

### 2.1 Supabase 설정
- [ ] **Supabase 프로젝트 생성**
  - 작업: 새 프로젝트 생성, URL과 anon key 기록
  - 완료조건: Supabase Dashboard 접근 가능
  - 테스트: Dashboard에서 프로젝트 확인

- [ ] **데이터베이스 스키마 생성**
  - 테이블:
    - `briefings`: id, date (unique), created_at, published_at
    - `news_items`: id, briefing_id (FK), category, title, summary, source_name, source_url, importance_rank
    - `beta_signups`: id, email, kakao_id, signed_up_at
  - 완료조건: 3개 테이블 + RLS 정책 설정 완료
  - 테스트: Dashboard에서 Insert/Select 동작 확인

- [ ] **Supabase 클라이언트 설정**
  - 파일: `lib/supabase/client.ts`, `lib/supabase/server.ts` (신규)
  - 의존성: `@supabase/supabase-js`
  - 완료조건: 환경변수 설정, 클라이언트 초기화
  - 테스트: API 라우트에서 연결 테스트

- [ ] **TypeScript 타입 정의**
  - 파일: `types/database.ts` (신규)
  - 작업: Briefing, NewsItem, BetaSignup 인터페이스
  - 완료조건: 모든 DB 엔티티 타입 정의
  - 테스트: TypeScript 컴파일 에러 없음

### 2.2 API 라우트
- [ ] **브리핑 조회 API**
  - 파일: `app/api/briefings/route.ts`, `app/api/briefings/[date]/route.ts` (신규)
  - 작업: GET 목록 (최근 30일), GET 단일 (날짜별)
  - 완료조건: 올바른 JSON 구조 반환
  - 테스트: curl로 응답 확인

- [ ] **베타 신청 API**
  - 파일: `app/api/beta-signup/route.ts` (신규)
  - 작업: POST 신청, 이메일 검증, 중복 체크
  - 완료조건: 신청 레코드 생성, 적절한 응답 반환
  - 테스트: 신청 후 DB 저장 확인

- [ ] **Revalidation Webhook**
  - 파일: `app/api/revalidate/route.ts` (신규)
  - 작업: POST로 ISR 캐시 갱신 트리거
  - 완료조건: secret 토큰 검증 후 revalidate 실행
  - 테스트: Webhook 호출 후 새 콘텐츠 표시 확인

---

## Phase 3: 뉴스 파이프라인

### 3.1 RSS 수집
- [ ] **네이버 뉴스 RSS 피드 조사**
  - 작업: 정치/경제/사회 카테고리별 RSS URL 확보
  - 완료조건: 3개 피드 URL 문서화
  - 테스트: 브라우저에서 피드 직접 접근, XML 구조 확인

- [ ] **RSS 파서 모듈**
  - 파일: `scripts/pipeline/rss-fetcher.ts` (신규)
  - 의존성: `rss-parser`
  - 작업: 3개 카테고리 피드 수집, 정규화 (title, link, pubDate, description)
  - 완료조건: 정규화된 뉴스 아이템 배열 반환
  - 테스트: 로컬 실행, 콘솔 출력 확인

- [ ] **중복 제거 로직**
  - 파일: `scripts/pipeline/deduplicator.ts` (신규)
  - 작업: URL 유사도, 제목 유사도 기반 중복 탐지
  - 완료조건: 중복 기사 필터링
  - 테스트: 알려진 중복 기사로 테스트

### 3.2 AI 요약
- [ ] **Anthropic 클라이언트 설정**
  - 파일: `lib/anthropic/client.ts` (신규)
  - 의존성: `@anthropic-ai/sdk`
  - 완료조건: ANTHROPIC_API_KEY 환경변수 설정, 클라이언트 초기화
  - 테스트: 간단한 completion 호출

- [ ] **요약 프롬프트 설계**
  - 파일: `scripts/pipeline/prompts/summarize.ts` (신규)
  - 작업: 한줄 헤드라인 + 2-3문장 요약 생성 (원문 복사 금지)
  - 완료조건: 일관된 품질의 요약 생성
  - 테스트: 10개 샘플 기사로 품질 검증

- [ ] **중요도 랭킹 프롬프트**
  - 파일: `scripts/pipeline/prompts/rank.ts` (신규)
  - 작업: 카테고리 내 중요도 순위 결정 (1-5)
  - 완료조건: 일관된 랭킹 결과
  - 테스트: 랭킹 결과 검토

- [ ] **파이프라인 오케스트레이터**
  - 파일: `scripts/pipeline/orchestrator.ts` (신규)
  - 작업: RSS 수집 → 중복제거 → 요약 → 랭킹 → 저장
  - 완료조건: 전체 파이프라인 end-to-end 실행
  - 테스트: 로컬 실행 후 Supabase 데이터 확인

### 3.3 GitHub Actions 자동화
- [ ] **Daily Cron 워크플로우**
  - 파일: `.github/workflows/daily-briefing.yml` (신규)
  - 스케줄: `0 21 * * *` (KST 06:00 = UTC 21:00)
  - 작업: checkout → setup Node → install → run pipeline → revalidate
  - 완료조건: YAML 유효, 올바른 시간에 트리거
  - 테스트: workflow_dispatch로 수동 실행

- [ ] **GitHub Secrets 설정**
  - 항목: SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, REVALIDATION_SECRET
  - 완료조건: Repository Settings에 모든 secrets 설정
  - 테스트: 워크플로우 실행 시 인증 에러 없음

- [ ] **실패 알림 설정**
  - 작업: 워크플로우 실패 시 알림 (GitHub 이메일 또는 Slack)
  - 완료조건: 실패 시 알림 수신
  - 테스트: 의도적 실패 후 알림 확인

---

## Phase 4: 웹 애플리케이션

### 4.1 메인 페이지 (오늘의 브리핑)
- [ ] **페이지 레이아웃**
  - 파일: `app/page.tsx` (수정)
  - 작업: DAILY WRAP 헤더 + 날짜 + 이중선 구분
  - 완료조건: 한국어 날짜 표시, 헤더 디자인 일치
  - 테스트: 디자인 스펙 섹션 5.1과 비교

- [ ] **섹션 컴포넌트 조합**
  - 작업: 정치/경제/사회 3개 섹션, 각 섹션에 featured + secondary 뉴스
  - 완료조건: 올바른 레이아웃과 간격
  - 테스트: 디자인 스펙 섹션 4와 비교

- [ ] **데이터 페칭**
  - 작업: Server Component에서 Supabase 데이터 조회
  - 완료조건: ISR + 1시간 revalidation 또는 on-demand
  - 테스트: 테스트 브리핑 생성 후 페이지 표시 확인

- [ ] **로딩/에러 상태**
  - 파일: `app/loading.tsx`, `app/error.tsx` (신규)
  - 작업: 스켈레톤 로더, 에러 메시지
  - 완료조건: 적절한 로딩/에러 UI 표시
  - 테스트: 느린 네트워크 시뮬레이션, API 에러 시뮬레이션

### 4.2 아카이브 페이지
- [ ] **아카이브 목록**
  - 파일: `app/archive/page.tsx` (신규)
  - 작업: 최근 30일 브리핑 목록 (날짜순)
  - 완료조건: 모든 가용 브리핑 표시
  - 테스트: 목록 렌더링 확인

- [ ] **날짜별 브리핑 페이지**
  - 파일: `app/archive/[date]/page.tsx` (신규)
  - 작업: YYYY-MM-DD 형식 URL, 이전/다음 네비게이션
  - 완료조건: 과거 브리핑 접근 가능
  - 테스트: `/archive/2026-01-17` 접근 확인

- [ ] **아카이브 네비게이션**
  - 작업: 월 선택기 또는 날짜 피커, "오늘로 돌아가기" 버튼
  - 완료조건: 쉬운 날짜 간 이동
  - 테스트: 다양한 날짜 탐색

### 4.3 반응형 디자인
- [ ] **Desktop 레이아웃 (1200px+)**
  - 작업: 12컬럼 그리드, 전체 타이포그래피 스케일
  - 테스트: 1440px 뷰포트에서 확인

- [ ] **Tablet 레이아웃 (768px-1199px)**
  - 작업: 8컬럼 그리드, 뉴스 카드 2단
  - 테스트: 768px, 1024px 뷰포트에서 확인

- [ ] **Mobile 레이아웃 (<768px)**
  - 작업: 단일 컬럼, 터치 타겟 44x44px 이상
  - 테스트: 375px 뷰포트 (iPhone SE)에서 확인

---

## Phase 5: 베타 기능

### 5.1 베타 신청 플로우
- [ ] **Signup CTA 컴포넌트**
  - 파일: `components/beta/signup-cta.tsx` (신규)
  - 작업: 장식 테두리 박스 디자인
  - 완료조건: 디자인 스펙 섹션 5.5와 일치
  - 테스트: 시각적 비교

- [ ] **신청 폼**
  - 파일: `components/beta/signup-form.tsx` (신규)
  - 작업: 이메일 (필수), 카카오 ID (선택) 입력
  - 완료조건: 클라이언트 사이드 검증
  - 테스트: 유효/무효 데이터 제출

- [ ] **폼 제출 연동**
  - 작업: `/api/beta-signup` 연결, 성공/에러 상태 표시
  - 완료조건: Rate limiting 적용, end-to-end 동작
  - 테스트: 신청 완료 후 DB 저장 확인

- [ ] **신청 카운터**
  - 작업: "XX/100 베타 테스터 모집 중" 실시간 표시
  - 완료조건: 정확한 카운트 표시
  - 테스트: 신청 추가 후 카운터 갱신 확인

### 5.2 카카오톡 연동 준비
- [ ] **오픈채팅방 설정 가이드**
  - 파일: `docs/kakaotalk-setup.md` (신규)
  - 작업: 오픈채팅방 생성 및 운영 방법 문서화
  - 완료조건: 명확한 가이드 문서
  - 테스트: 가이드 따라 테스트 방 생성

- [ ] **브리핑 텍스트 내보내기**
  - 파일: `scripts/export-briefing.ts` (신규)
  - 작업: 카카오톡용 플레인 텍스트 생성 (날짜 + 섹션 + 헤드라인 + 요약 + 링크)
  - 완료조건: 가독성 좋은 텍스트 출력
  - 테스트: 오늘 브리핑 내보내기 후 채팅에 붙여넣기

---

## Phase 6: 마무리 & 배포

### 6.1 SEO & 메타데이터
- [ ] **페이지 메타데이터 설정**
  - 파일: `app/layout.tsx`
  - 작업: title, description, Open Graph 태그, favicon
  - 완료조건: 소셜 공유 시 올바른 미리보기
  - 테스트: Facebook/Twitter 디버거 도구

- [ ] **JSON-LD 구조화 데이터**
  - 작업: NewsArticle, WebSite 스키마 구현
  - 완료조건: Google Rich Results Test 통과
  - 테스트: Rich Results Test 도구

- [ ] **robots.txt, sitemap.xml**
  - 파일: `public/robots.txt`, `app/sitemap.ts`
  - 완료조건: 올바른 형식의 파일 생성
  - 테스트: `/robots.txt`, `/sitemap.xml` 접근 확인

### 6.2 성능 최적화
- [ ] **폰트 로딩 최적화**
  - 작업: `next/font` 사용, display swap
  - 완료조건: 레이아웃 시프트 없음
  - 테스트: Lighthouse CLS < 0.1

- [ ] **이미지 최적화**
  - 작업: `next/image` 사용, blur placeholder
  - 완료조건: 이미지 지연 로딩 동작
  - 테스트: Network 탭에서 최적화된 로딩 확인

- [ ] **Lighthouse 감사**
  - 목표: Performance 90+, Accessibility 100, Best Practices 100, SEO 100
  - 테스트: Production 빌드에서 Lighthouse 실행

### 6.3 Vercel 배포
- [ ] **Vercel 프로젝트 설정**
  - 작업: GitHub 연결, 환경변수 설정, 도메인 설정 (있을 경우)
  - 완료조건: 배포 성공
  - 테스트: 배포 URL 접근

- [ ] **Preview 배포 활성화**
  - 작업: PR 시 자동 Preview URL 생성
  - 완료조건: PR에서 Preview 링크 확인
  - 테스트: 테스트 PR 생성 후 Preview 접근

- [ ] **프로덕션 설정**
  - 작업: Analytics (선택), 에러 모니터링 (선택)
  - 테스트: 테스트 에러 발생 후 로깅 확인

### 6.4 최종 테스트
- [ ] **E2E 유저 플로우 테스트**
  - 플로우: 홈 → 브리핑 읽기 → 아카이브 → 베타 신청
  - 브라우저: Chrome, Safari, Firefox
  - 모바일: iOS Safari, Android Chrome
  - 완료조건: 모든 브라우저/기기에서 동작
  - 테스트: 각 환경별 체크리스트

- [ ] **파이프라인 테스트**
  - 작업: 전체 파이프라인 수동 실행, 에러 복구 테스트
  - 완료조건: RSS 실패, Claude 실패 시 graceful degradation
  - 테스트: 의도적 실패 시나리오

- [ ] **부하 테스트**
  - 작업: 100명 동시 접속 시뮬레이션
  - 완료조건: 응답 시간 < 2초, 에러 없음
  - 테스트: 부하 테스트 도구 사용

---

## 의존성 패키지

```bash
pnpm add @supabase/supabase-js @anthropic-ai/sdk rss-parser
```

---

## 참고 문서

- [서비스 기획서](./spec.md)
- [디자인 기획안](./design-editorial-broadsheet.md)
