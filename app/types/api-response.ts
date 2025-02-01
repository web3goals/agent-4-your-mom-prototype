import { ApiResponseError } from "./api-response-error";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: ApiResponseError;
};
