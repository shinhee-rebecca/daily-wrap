import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { toBetaSignupStats, type BetaSignupStatsResponse, type DbBetaSignupInsert } from "@/types/database";

/**
 * 베타 신청 요청 body 타입
 */
interface BetaSignupRequest {
  email: string;
  kakaoId?: string;
}

/**
 * API 응답 타입
 */
interface BetaSignupResponse {
  success: boolean;
  data: {
    message: string;
    stats: BetaSignupStatsResponse;
  } | null;
  error: string | null;
}

interface BetaSignupStatsOnlyResponse {
  success: boolean;
  data: BetaSignupStatsResponse | null;
  error: string | null;
}

/**
 * 이메일 형식 검증
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 카카오 ID 형식 검증 (선택적)
 * - 영문, 숫자, 언더스코어만 허용
 * - 4-15자
 */
function isValidKakaoId(kakaoId: string): boolean {
  if (!kakaoId) return true; // 선택 필드
  const kakaoIdRegex = /^[a-zA-Z0-9_]{4,15}$/;
  return kakaoIdRegex.test(kakaoId);
}

/**
 * GET /api/beta-signup
 * 베타 신청 통계 조회
 */
export async function GET(): Promise<NextResponse<BetaSignupStatsOnlyResponse>> {
  try {
    const supabase = createAnonClient();

    // RLS 우회 함수로 카운트 조회
    const { data: count, error } = await supabase.rpc("get_beta_signup_count");

    if (error) {
      console.error("Failed to get beta signup count:", error);
      // 에러 시 기본값 반환
      return NextResponse.json({
        success: true,
        data: toBetaSignupStats(0),
        error: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: toBetaSignupStats(count || 0),
      error: null,
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/beta-signup:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/beta-signup
 * 베타 신청 등록
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<BetaSignupResponse>> {
  try {
    // 요청 body 파싱
    let body: BetaSignupRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "잘못된 요청 형식입니다.",
        },
        { status: 400 }
      );
    }

    const { email, kakaoId } = body;

    // 이메일 필수 검증
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "이메일 주소를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "올바른 이메일 주소를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // 카카오 ID 형식 검증 (있는 경우)
    const trimmedKakaoId = kakaoId?.trim() || null;
    if (trimmedKakaoId && !isValidKakaoId(trimmedKakaoId)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "카카오 ID는 4-15자의 영문, 숫자, 언더스코어만 사용 가능합니다.",
        },
        { status: 400 }
      );
    }

    const supabase = createAnonClient();

    // 베타 신청 등록 (RLS INSERT 정책에 의해 허용됨)
    const insertData: DbBetaSignupInsert = {
      email: trimmedEmail,
      kakao_id: trimmedKakaoId,
    };
    const { error: insertError } = await supabase.from("beta_signups").insert(insertData);

    if (insertError) {
      // 중복 이메일 에러 처리
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: "이미 신청된 이메일 주소입니다.",
          },
          { status: 409 }
        );
      }

      console.error("Failed to insert beta signup:", insertError);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "베타 신청 등록에 실패했습니다. 잠시 후 다시 시도해주세요.",
        },
        { status: 500 }
      );
    }

    // 최신 카운트 조회
    const { data: count } = await supabase.rpc("get_beta_signup_count");

    return NextResponse.json(
      {
        success: true,
        data: {
          message: "베타 신청이 완료되었습니다. 출시 알림을 보내드릴게요!",
          stats: toBetaSignupStats(count || 1),
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/beta-signup:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
