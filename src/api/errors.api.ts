import axios, { AxiosError } from "axios";

export type ApiErrorResponse = {
  message?: string | string[];
  detail?: string | string[];
  [key: string]: string | string[] | undefined;
};

export const getApiErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  const data = error?.response?.data;

  if (!data) return "Network error";

  // 1. Case: { message: "..." } or { message: ["..."] }
  const message = data.message;
  if (message) {
    return Array.isArray(message) ? message[0] : message;
  }

  // 2. Case: { detail: "..." } or { detail: ["..."] }
  const detail = data.detail;
  if (detail) {
    return Array.isArray(detail) ? detail[0] : detail;
  }

  // 3. Case: field errors like { username: ["..."], password: ["..."] }
  const fieldErrors = Object.values(data).flat();

  if (fieldErrors.length > 0) {
    return String(fieldErrors[0]);
  }

  return "Request failed";
};

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<Record<string, any>>;
    const data = err.response?.data;

    let message = "Request failed";

    if (data && typeof data === "object") {
      // Try "message" first
      if (typeof data.message === "string") {
        message = data.message;
      } else {
        // Fallback to field errors
        const fieldErrors = Object.values(data).flat();

        if (fieldErrors.length > 0) {
          message = String(fieldErrors[0]);
        }
      }
    }

    throw {
      status: err.response?.status ?? 0,
      message,
    };
  }

  throw {
    status: 0,
    message: "Unknown error",
  };
}