import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * 서버용 Supabase 클라이언트
 * 서버 컴포넌트, API 라우트, 서버 액션에서 사용
 *
 * 참고: RLS 정책으로 인한 TypeScript 타입 추론 문제를 피하기 위해
 * Database 제네릭 타입을 사용하지 않습니다.
 * 대신 각 API 라우트에서 응답 데이터를 명시적으로 타이핑합니다.
 */

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 서비스 역할 클라이언트 (RLS 우회, 관리자 권한)
 * - 뉴스 파이프라인에서 데이터 삽입
 * - 관리자 기능
 */
export function createServiceClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error("Missing environment variable: SUPABASE_URL");
  }

  if (!supabaseServiceKey) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * 익명 클라이언트 (RLS 적용)
 * - 서버 컴포넌트에서 퍼블릭 데이터 조회
 */
export function createAnonClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error("Missing environment variable: SUPABASE_URL");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: SUPABASE_ANON_KEY");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * 기본 서버 클라이언트 (익명 권한, RLS 적용)
 */
export const supabaseServer = createAnonClient;
