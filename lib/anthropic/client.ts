/**
 * Anthropic Claude API Client
 *
 * 뉴스 요약 및 중요도 랭킹에 사용되는 Claude API 클라이언트입니다.
 */

import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic API 키 존재 여부 확인
 */
export function hasApiKey(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/**
 * Anthropic 클라이언트 생성
 *
 * @throws API 키가 없으면 에러
 */
export function createAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing environment variable: ANTHROPIC_API_KEY. " +
        "Please set ANTHROPIC_API_KEY in your environment or .env file."
    );
  }

  return new Anthropic({ apiKey });
}

/**
 * Claude API 호출 옵션
 */
export interface ClaudeMessageOptions {
  /** 시스템 프롬프트 */
  system?: string;
  /** 사용자 메시지 */
  message: string;
  /** 최대 출력 토큰 수 (기본: 1024) */
  maxTokens?: number;
  /** 모델 (기본: claude-sonnet-4-20250514) */
  model?: string;
  /** Temperature (기본: 0.3, 낮을수록 결정적) */
  temperature?: number;
}

/**
 * Claude에게 메시지 전송
 *
 * @param options 메시지 옵션
 * @returns Claude의 응답 텍스트
 */
export async function sendMessage(
  options: ClaudeMessageOptions
): Promise<string> {
  const {
    system,
    message,
    maxTokens = 1024,
    model = "claude-sonnet-4-20250514",
    temperature = 0.3,
  } = options;

  const client = createAnthropicClient();

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: system || undefined,
    messages: [{ role: "user", content: message }],
  });

  // 응답에서 텍스트 추출
  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  return textContent.text;
}

/**
 * Claude API 호출 (Dry Run 모드)
 *
 * API 키가 없거나 DRY_RUN 환경변수가 설정된 경우 실제 호출 없이 Mock 응답 반환
 */
export async function sendMessageSafe(
  options: ClaudeMessageOptions,
  mockResponse: string
): Promise<string> {
  const isDryRun =
    process.env.DRY_RUN === "true" ||
    process.env.DRY_RUN === "1" ||
    !hasApiKey();

  if (isDryRun) {
    console.log("[Claude] Dry run mode - returning mock response");
    return mockResponse;
  }

  return sendMessage(options);
}

/**
 * JSON 응답 파싱 유틸리티
 *
 * Claude 응답에서 JSON을 추출하고 파싱합니다.
 */
export function parseJsonResponse<T>(response: string): T {
  // Markdown 코드 블록에서 JSON 추출
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : response;

  try {
    return JSON.parse(jsonStr.trim());
  } catch {
    throw new Error(`Failed to parse JSON from Claude response: ${response}`);
  }
}
