export type UserRole = "ADMIN" | "EDITOR" | "USER";

export type AuthUser = {
  uid: string;
  id?: string;
  email: string;
  name?: string;
  role: UserRole;
  is_active?: boolean;
  created_by?: string | null;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  token_version?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

const ACCESS_TOKEN_KEY = "qm_access_token";
const REFRESH_TOKEN_KEY = "qm_refresh_token";
const USER_KEY = "qm_user";

export function setSession(accessToken: string, refreshToken: string, user: AuthUser) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken(): string {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}