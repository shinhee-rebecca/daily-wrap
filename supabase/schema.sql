-- Daily Wrap Database Schema
-- Supabase PostgreSQL

-- ============================================
-- 1. Enable UUID extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Tables
-- ============================================

-- briefings: 일일 브리핑
CREATE TABLE IF NOT EXISTS briefings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 인덱스: 날짜 기반 조회 최적화
CREATE INDEX IF NOT EXISTS idx_briefings_date ON briefings(date DESC);

-- news_items: 개별 뉴스 아이템
CREATE TABLE IF NOT EXISTS news_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    briefing_id UUID NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('politics', 'economy', 'society')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    importance_rank INTEGER NOT NULL CHECK (importance_rank >= 1 AND importance_rank <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스: briefing_id로 조회 최적화
CREATE INDEX IF NOT EXISTS idx_news_items_briefing_id ON news_items(briefing_id);
-- 인덱스: category별 조회 최적화
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);

-- beta_signups: 베타 신청
CREATE TABLE IF NOT EXISTS beta_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    kakao_id TEXT,
    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스: 이메일 중복 체크 최적화 (UNIQUE 제약조건이 이미 인덱스 생성)

-- ============================================
-- 3. Row Level Security (RLS) Policies
-- ============================================

-- briefings 테이블 RLS 활성화
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 브리핑 조회 가능 (published_at이 있는 경우만)
CREATE POLICY "briefings_select_policy" ON briefings
    FOR SELECT
    USING (published_at IS NOT NULL);

-- 서비스 역할만 브리핑 생성/수정/삭제 가능 (anon key로는 불가)
CREATE POLICY "briefings_insert_policy" ON briefings
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "briefings_update_policy" ON briefings
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "briefings_delete_policy" ON briefings
    FOR DELETE
    USING (auth.role() = 'service_role');

-- news_items 테이블 RLS 활성화
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 뉴스 아이템 조회 가능 (해당 브리핑이 published인 경우)
CREATE POLICY "news_items_select_policy" ON news_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM briefings
            WHERE briefings.id = news_items.briefing_id
            AND briefings.published_at IS NOT NULL
        )
    );

-- 서비스 역할만 뉴스 아이템 생성/수정/삭제 가능
CREATE POLICY "news_items_insert_policy" ON news_items
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "news_items_update_policy" ON news_items
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "news_items_delete_policy" ON news_items
    FOR DELETE
    USING (auth.role() = 'service_role');

-- beta_signups 테이블 RLS 활성화
ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 베타 신청 가능 (INSERT만)
CREATE POLICY "beta_signups_insert_policy" ON beta_signups
    FOR INSERT
    WITH CHECK (true);

-- 베타 신청 조회는 서비스 역할만 가능
CREATE POLICY "beta_signups_select_policy" ON beta_signups
    FOR SELECT
    USING (auth.role() = 'service_role');

-- 베타 신청 수정/삭제는 서비스 역할만 가능
CREATE POLICY "beta_signups_update_policy" ON beta_signups
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "beta_signups_delete_policy" ON beta_signups
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================
-- 4. Functions
-- ============================================

-- 베타 신청 수 조회 함수 (RLS 우회)
CREATE OR REPLACE FUNCTION get_beta_signup_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::INTEGER FROM beta_signups;
$$;

-- ============================================
-- 5. Views (Optional - for convenience)
-- ============================================

-- 최근 브리핑 목록 뷰
CREATE OR REPLACE VIEW recent_briefings AS
SELECT
    b.id,
    b.date,
    b.created_at,
    b.published_at,
    COUNT(n.id) AS news_count
FROM briefings b
LEFT JOIN news_items n ON b.id = n.briefing_id
WHERE b.published_at IS NOT NULL
GROUP BY b.id, b.date, b.created_at, b.published_at
ORDER BY b.date DESC
LIMIT 30;
