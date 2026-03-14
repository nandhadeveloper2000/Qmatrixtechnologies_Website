import {
  getAccessToken,
  getRefreshToken,
  setSession,
  getUser,
  clearSession,
  type AuthUser,
} from "./auth";

import SummaryApi, { baseURL } from "../constants/SummaryApi";

type ApiErrorBody = { message?: string };

type RefreshResponse = {
  success?: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
};

export type ApiFetchOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: HeadersInit;
  body?: BodyInit | null;
  json?: unknown;
};

const apiUrl = (path: string) => `${baseURL}${path}`;

function mergeHeaders(
  base?: HeadersInit,
  options?: {
    hasJsonBody?: boolean;
    isFormData?: boolean;
  }
) {
  const h = new Headers(base);
  const hasJsonBody = options?.hasJsonBody ?? false;
  const isFormData = options?.isFormData ?? false;

  if (!h.has("Accept")) {
    h.set("Accept", "application/json");
  }

  if (hasJsonBody && !isFormData && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }

  return h;
}

async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(apiUrl(SummaryApi.refreshToken.url), {
    method: SummaryApi.refreshToken.method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = (await safeJson<RefreshResponse>(res)) ?? {};

  if (!res.ok || !data.accessToken) return null;

  const user = data.user ?? getUser();
  if (user) {
    setSession(data.accessToken, data.refreshToken ?? refreshToken, user);
  }

  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const url = apiUrl(path);

  const { json, headers: extraHeaders, body: rawBody, ...rest } = options;

  const hasJsonBody = json !== undefined;
  const isFormData =
    typeof FormData !== "undefined" && rawBody instanceof FormData;

  const body = json !== undefined ? JSON.stringify(json) : rawBody ?? null;

  const headers = mergeHeaders(extraHeaders, {
    hasJsonBody,
    isFormData,
  });

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res1 = await fetch(url, {
    ...rest,
    headers,
    body,
  });

  if (res1.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      clearSession();
      throw new Error("Session expired. Please login again.");
    }

    const retryHeaders = mergeHeaders(extraHeaders, {
      hasJsonBody,
      isFormData,
    });
    retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

    const res2 = await fetch(url, {
      ...rest,
      headers: retryHeaders,
      body,
    });

    const err2 = !res2.ok ? (await safeJson<ApiErrorBody>(res2)) ?? {} : null;
    if (!res2.ok) {
      throw new Error(err2?.message || "Request failed");
    }

    const data2 = await safeJson<T>(res2);
    return data2 ?? ({} as T);
  }

  const err1 = !res1.ok ? (await safeJson<ApiErrorBody>(res1)) ?? {} : null;
  if (!res1.ok) {
    throw new Error(err1?.message || "Request failed");
  }

  const data1 = await safeJson<T>(res1);
  return data1 ?? ({} as T);
}