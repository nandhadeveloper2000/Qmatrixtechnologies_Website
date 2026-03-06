export type UserRole = "ADMIN" | "EDITOR" | "USER" |"EMPLOYEE";

export type SessionUser = {
  uid: string;
  role: UserRole;
  email: string;
  name?: string;
};

const ACCESS_KEY = "qm_access";
const REFRESH_KEY = "qm_refresh";
const USER_KEY = "qm_user";

export function setSession(accessToken: string, refreshToken: string, user: SessionUser) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}