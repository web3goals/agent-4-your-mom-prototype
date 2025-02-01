import { ApiResponse } from "@/types/api-response";
import { ApiResponseError } from "@/types/api-response-error";
import { NextResponse } from "next/server";

export function createSuccessApiResponse<T>(data: T) {
  const response: ApiResponse<T> = { success: true, data };
  return NextResponse.json(response, { status: 200 });
}

export function createFailedApiResponse<T>(
  error: ApiResponseError,
  status: number
) {
  const response: ApiResponse<T> = { success: false, error };
  return NextResponse.json(response, { status });
}
