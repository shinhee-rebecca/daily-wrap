"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * 브라우저용 Supabase 클라이언트
 * 클라이언트 컴포넌트에서 사용
 *
 * 참고: RLS 정책으로 인한 TypeScript 타입 추론 문제를 피하기 위해
 * Database 제네릭 타입을 사용하지 않습니다.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

/**
 * 싱글톤 패턴으로 클라이언트 가져오기
 */
export function getSupabaseClient(): SupabaseClient {
  return supabase;
}
