# GitHub Secrets 설정 가이드

> Daily Wrap 뉴스 파이프라인을 GitHub Actions에서 실행하기 위한 Secrets 설정

## 필수 Secrets

GitHub 리포지토리의 **Settings > Secrets and variables > Actions**에서 다음 시크릿들을 설정하세요.

### 1. SUPABASE_URL

Supabase 프로젝트 URL

```
https://[project-id].supabase.co
```

**찾는 방법:**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Settings > API
4. "Project URL" 복사

---

### 2. SUPABASE_SERVICE_KEY

Supabase 서비스 역할 키 (RLS 우회, 관리자 권한)

**찾는 방법:**
1. Supabase Dashboard > Settings > API
2. "service_role" 키 복사 (secret, 절대 공개 금지!)

> **주의:** `anon` 키가 아닌 `service_role` 키를 사용해야 합니다.
> 파이프라인은 데이터를 삽입해야 하므로 관리자 권한이 필요합니다.

---

### 3. ANTHROPIC_API_KEY

Anthropic Claude API 키

**발급 방법:**
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. API Keys 메뉴
3. "Create Key" 버튼
4. 키 이름 입력 (예: "daily-wrap-pipeline")
5. 생성된 키 복사

**비용:**
- Claude Sonnet 사용 시 하루 약 $0.5-1 예상
- 월 $15-30 수준

---

### 4. REVALIDATION_SECRET

ISR 캐시 갱신을 위한 비밀 토큰

**설정 방법:**
1. 무작위 문자열 생성 (예: `openssl rand -hex 32`)
2. GitHub Secret에 저장
3. Vercel 환경변수에도 동일하게 설정

```bash
# 무작위 토큰 생성
openssl rand -hex 32
# 예: a1b2c3d4e5f6...
```

---

## 선택적 Secrets

### 5. REVALIDATE_URL

ISR 캐시 갱신 API 엔드포인트 URL

```
https://your-domain.vercel.app/api/revalidate
```

> Vercel 배포 후 도메인이 확정되면 설정

---

## 설정 방법

### GitHub에서 Secret 추가하기

1. GitHub 리포지토리로 이동
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Secrets and variables > Actions** 클릭
4. **New repository secret** 버튼 클릭
5. Name과 Value 입력 후 **Add secret** 클릭

### 확인 방법

워크플로우를 수동 실행하여 시크릿이 올바르게 설정되었는지 확인:

1. **Actions** 탭으로 이동
2. "Daily Briefing Pipeline" 워크플로우 선택
3. **Run workflow** 버튼 클릭
4. "Dry run mode"를 true로 설정하면 API 호출 없이 테스트 가능

---

## 환경변수 요약

| Secret 이름 | 용도 | 필수 여부 |
|-------------|------|-----------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | 필수 |
| `SUPABASE_SERVICE_KEY` | Supabase 서비스 역할 키 | 필수 |
| `ANTHROPIC_API_KEY` | Claude API 키 | 필수 |
| `REVALIDATION_SECRET` | ISR 캐시 갱신 토큰 | 필수 |
| `REVALIDATE_URL` | Revalidation API URL | 선택 |

---

## 보안 주의사항

1. **절대 키를 코드에 직접 작성하지 마세요**
2. `.env` 파일은 반드시 `.gitignore`에 포함
3. `service_role` 키는 절대 클라이언트 사이드에 노출되면 안됨
4. 정기적으로 키를 로테이션하는 것이 좋음

---

## 문제 해결

### "Missing environment variable" 에러

- 해당 Secret이 올바르게 설정되었는지 확인
- Secret 이름에 오타가 없는지 확인
- 워크플로우 파일에서 Secret 참조가 올바른지 확인

### API 인증 실패

- 키가 만료되지 않았는지 확인
- 올바른 키를 사용했는지 확인 (`anon` vs `service_role`)
- Anthropic 계정에 크레딧이 있는지 확인
