import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidation 요청 body 타입
 */
interface RevalidateRequest {
  path?: string;
  tag?: string;
  type?: "page" | "layout";
  profile?: string; // Next.js 16: cacheLife profile for revalidateTag (default: "max")
}

/**
 * API 응답 타입
 */
interface RevalidateResponse {
  success: boolean;
  revalidated: {
    path?: string;
    tag?: string;
    type?: "page" | "layout";
  } | null;
  error: string | null;
  timestamp: string;
}

/**
 * POST /api/revalidate
 * ISR 캐시 갱신 Webhook
 *
 * 사용 예시:
 * - 특정 경로 revalidate: POST { "path": "/" }
 * - 특정 태그 revalidate: POST { "tag": "briefings" }
 * - 브리핑 페이지 revalidate: POST { "path": "/archive/2026-01-19" }
 *
 * 헤더:
 * - x-revalidation-secret: REVALIDATION_SECRET 환경변수 값
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<RevalidateResponse>> {
  try {
    // Secret 토큰 검증
    const secret = request.headers.get("x-revalidation-secret");
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret) {
      console.error("REVALIDATION_SECRET environment variable is not set");
      return NextResponse.json(
        {
          success: false,
          revalidated: null,
          error: "서버 설정 오류입니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          revalidated: null,
          error: "인증에 실패했습니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // 요청 body 파싱
    let body: RevalidateRequest;
    try {
      body = await request.json();
    } catch {
      // body가 없는 경우 기본 경로 revalidate
      body = { path: "/" };
    }

    const { path, tag, type = "page", profile = "max" } = body;

    // path 또는 tag 중 하나는 필수
    if (!path && !tag) {
      return NextResponse.json(
        {
          success: false,
          revalidated: null,
          error: "path 또는 tag 중 하나를 지정해주세요.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Revalidation 실행
    if (path) {
      revalidatePath(path, type);
      console.log(`Revalidated path: ${path} (type: ${type})`);
    }

    if (tag) {
      // Next.js 16: revalidateTag requires a profile as second argument
      revalidateTag(tag, profile);
      console.log(`Revalidated tag: ${tag} (profile: ${profile})`);
    }

    return NextResponse.json({
      success: true,
      revalidated: {
        path: path || undefined,
        tag: tag || undefined,
        type: path ? type : undefined,
      },
      error: null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unexpected error in POST /api/revalidate:", error);
    return NextResponse.json(
      {
        success: false,
        revalidated: null,
        error: "서버 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/revalidate
 * 간단한 Health check (인증 필요 없음)
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    message: "Revalidation endpoint is ready. Use POST with x-revalidation-secret header.",
    timestamp: new Date().toISOString(),
  });
}
