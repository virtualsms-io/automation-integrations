// Minimal local typings so we don't depend on @types/zapier-platform-core
// (Zapier publishes types but not consistently across versions).

export interface ZBundle {
  authData: { api_key?: string; base_url?: string };
  inputData: Record<string, unknown>;
  cleanedRequest?: unknown;
  rawRequest?: unknown;
  meta?: { page?: number };
  subscribeData?: { id?: string };
  targetUrl?: string;
}

export interface ZRequestOptions {
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  skipThrowForStatus?: boolean;
}

export interface ZResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
  throwForStatus: () => void;
  json: T;
}

export interface ZObject {
  request: <T = unknown>(opts: ZRequestOptions) => Promise<ZResponse<T>>;
  console: { log: (...args: unknown[]) => void };
  cursor: {
    get: () => Promise<string | null>;
    set: (cursor: string) => Promise<void>;
  };
}

export const BASE_URL_DEFAULT = "https://virtualsms.io";

export function apiBase(bundle: ZBundle): string {
  return (bundle.authData.base_url || BASE_URL_DEFAULT).replace(/\/+$/, "");
}
