# Daily Wrap Vercel 배포 가이드

> 마지막 업데이트: 2026-01-19

이 문서는 Daily Wrap 프로젝트를 Vercel에 배포하는 방법을 안내합니다.

---

## 목차

1. [사전 요구사항](#사전-요구사항)
2. [Vercel 프로젝트 설정](#vercel-프로젝트-설정)
3. [환경변수 설정](#환경변수-설정)
4. [Preview 배포](#preview-배포)
5. [프로덕션 배포](#프로덕션-배포)
6. [도메인 설정](#도메인-설정)
7. [트러블슈팅](#트러블슈팅)

---

## 사전 요구사항

- GitHub 계정
- Vercel 계정 (GitHub로 가입 권장)
- Supabase 프로젝트 (이미 설정되어 있어야 함)
- Anthropic API 키 (뉴스 파이프라인용)

---

## Vercel 프로젝트 설정

### 1. Vercel 대시보드에서 새 프로젝트 생성

1. [vercel.com](https://vercel.com)에 로그인
2. "Add New..." > "Project" 클릭
3. "Import Git Repository" 섹션에서 `daily-wrap` 저장소 선택
4. "Import" 클릭

### 2. 프로젝트 설정 확인

Vercel이 자동으로 Next.js 프로젝트를 감지합니다. 다음 설정을 확인하세요:

| 설정 | 값 |
|------|-----|
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `pnpm build` (자동 감지) |
| Output Directory | `.next` (자동 감지) |
| Install Command | `pnpm install` (자동 감지) |

### 3. Node.js 버전 설정

프로젝트 설정에서 Node.js 버전을 `20.x`로 설정합니다:

1. Project Settings > General > Node.js Version
2. `20.x` 선택

---

## 환경변수 설정

### 필수 환경변수

Vercel 대시보드에서 Settings > Environment Variables로 이동하여 다음 변수들을 설정합니다:

| 변수명 | 설명 | 필수 | 환경 |
|--------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Yes | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | Yes | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 역할 키 | Yes | Production |
| `ANTHROPIC_API_KEY` | Anthropic API 키 | Yes | Production |
| `REVALIDATION_SECRET` | ISR 재검증 시크릿 | Yes | All |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | Yes | All |

### 환경변수 설정 방법

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Environment Variables 이동
3. 각 변수에 대해:
   - "Add New" 클릭
   - Name과 Value 입력
   - 적용할 환경 선택 (Production, Preview, Development)
   - "Save" 클릭

### 환경별 값 예시

```bash
# 프로덕션
NEXT_PUBLIC_SITE_URL=https://dailywrap.kr

# Preview (Vercel이 자동 제공하는 URL 사용)
NEXT_PUBLIC_SITE_URL=https://daily-wrap-preview.vercel.app
```

---

## Preview 배포

### 자동 Preview 배포

Vercel은 모든 Pull Request에 대해 자동으로 Preview 배포를 생성합니다.

1. GitHub에서 새 브랜치 생성
2. 변경사항 커밋 및 푸시
3. Pull Request 생성
4. Vercel Bot이 자동으로 Preview URL을 코멘트로 추가

### Preview URL 형식

```
https://daily-wrap-<branch-name>-<team-name>.vercel.app
```

### Preview 배포 설정 (선택)

Settings > Git에서 Preview 배포 설정을 커스터마이즈할 수 있습니다:

- **Preview Deployment**: 모든 브랜치 또는 특정 브랜치만
- **Comments on Pull Requests**: 활성화 권장
- **Auto-assign Custom Domains**: 비활성화 권장 (프로덕션과 분리)

---

## 프로덕션 배포

### 자동 프로덕션 배포

`main` 브랜치에 푸시하면 자동으로 프로덕션 배포가 실행됩니다.

```bash
git checkout main
git merge feature/your-feature
git push origin main
```

### 수동 재배포

Vercel 대시보드에서:
1. Deployments 탭 이동
2. 최신 배포 옆의 "..." 메뉴 클릭
3. "Redeploy" 선택

### 롤백

문제 발생 시 이전 버전으로 롤백:
1. Deployments 탭에서 이전 성공 배포 찾기
2. "..." 메뉴 > "Promote to Production" 클릭

---

## 도메인 설정

### 커스텀 도메인 연결

1. Settings > Domains 이동
2. 도메인 입력 (예: `dailywrap.kr`)
3. "Add" 클릭
4. DNS 설정 안내를 따라 설정

### DNS 설정 예시 (Cloudflare 등)

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |

또는 A 레코드 사용:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |

### HTTPS 설정

Vercel이 자동으로 SSL 인증서를 발급하고 관리합니다. 별도 설정 불필요.

---

## 추가 설정

### Analytics 활성화 (선택)

1. Analytics 탭 이동
2. "Enable Analytics" 클릭
3. Web Vitals 모니터링 활성화

### Speed Insights 활성화 (선택)

1. Speed Insights 탭 이동
2. 활성화
3. 실시간 성능 데이터 확인

### Logs 확인

1. Logs 탭 이동
2. 실시간 로그 또는 Functions 로그 확인
3. 필터링으로 에러 로그만 조회

---

## 트러블슈팅

### 빌드 실패

**증상**: Build failed 오류

**해결**:
1. 로컬에서 `pnpm build` 실행하여 에러 확인
2. 환경변수 누락 여부 확인
3. Node.js 버전 호환성 확인

### 환경변수 인식 안됨

**증상**: 런타임에서 undefined

**해결**:
1. 변수명에 `NEXT_PUBLIC_` 접두사 확인 (클라이언트용)
2. 환경변수가 올바른 환경(Production/Preview)에 설정되었는지 확인
3. 재배포 필요

### 함수 타임아웃

**증상**: 504 Gateway Timeout

**해결**:
1. Hobby 플랜: 10초 제한, Pro 플랜: 60초 제한
2. 긴 작업은 배경 작업으로 분리
3. Edge Functions 고려

### 캐시 문제

**증상**: 변경사항이 반영되지 않음

**해결**:
1. Vercel 대시보드에서 캐시 무효화
2. Settings > Data Cache > Purge All
3. `/api/revalidate` 엔드포인트 호출

---

## 배포 체크리스트

배포 전 확인사항:

- [ ] 로컬에서 `pnpm build` 성공
- [ ] 모든 환경변수 설정 완료
- [ ] Supabase 연결 테스트 완료
- [ ] Preview 배포에서 기능 테스트 완료
- [ ] SEO 메타데이터 확인
- [ ] 모바일 반응형 테스트 완료
- [ ] 접근성 테스트 완료

---

## 관련 문서

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Secrets 설정](./github-secrets.md)
- [테스팅 체크리스트](./testing-checklist.md)
