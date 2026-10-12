"use client";

import { useSyncExternalStore } from "react";

export interface AuthUser {
  id: number;
  name: string;
  username?: string;
  role: "manager" | "customer";
  greeting?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
  message: string;
}

let accessToken: string | null = null;
let currentUser: AuthUser | null = null;
let refreshPromise: Promise<string | null> | null = null;
let restorePromise: Promise<void> | null = null;

let generation = 0;
const listeners = new Set<() => void>();

function publish(user: AuthUser | null) {
  currentUser = user;
  listeners.forEach((listener) => listener());
}

function clearSession() {
  accessToken = null;

  sessionStorage.removeItem("estimate_user");
  publish(null);
}

function setToken(token: string) {
  accessToken = token;
}

export function acceptLogin(data: LoginResponse) {
  generation += 1;
  setToken(data.access_token);
  sessionStorage.setItem("estimate_user", JSON.stringify(data.user));
  publish(data.user);
}

export function refreshAccessToken(): Promise<string | null> {
  if (!sessionStorage.getItem("estimate_user")) return Promise.resolve(null);
  if (refreshPromise) return refreshPromise;
  const startedAt = generation;
  refreshPromise = (async () => {
    const response = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (startedAt !== generation) return accessToken;
    if (response.status === 401) {
      clearSession();
      return null;
    }
    if (!response.ok) throw new Error("토큰 갱신에 실패했습니다.");
    const data = await response.json();
    if (startedAt !== generation) return accessToken;
    if (typeof data.access_token !== "string") throw new Error("잘못된 토큰 응답입니다.");
    setToken(data.access_token);
    return data.access_token;
  })().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const send = (token: string | null) => {
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...options, headers, credentials: "include" });
  };
  const token = accessToken ?? await refreshAccessToken();
  let response = await send(token);
  if (response.status === 401 && token) {
    const renewed = await refreshAccessToken();
    if (renewed) response = await send(renewed);
  }
  if (response.status === 401) clearSession();
  return response;
}

export function restoreSession(): Promise<void> {
  if (accessToken || !sessionStorage.getItem("estimate_user")) return Promise.resolve();
  if (restorePromise) return restorePromise;
  const startedAt = generation;
  restorePromise = (async () => {
    try {
      const token = await refreshAccessToken();
      if (!token || startedAt !== generation) return;
      const response = await authFetch("/api/me");
      if (startedAt !== generation) return;
      if (!response.ok) return;
      const data = await response.json();
      const saved = sessionStorage.getItem("estimate_user");
      let cached: AuthUser | null = null;
      try { cached = saved ? JSON.parse(saved) : null; } catch { /* 표시 정보가 없으면 기본 호칭 사용 */ }
      if (startedAt !== generation) return;
      const verified = data.user;
      if (typeof verified?.id !== "number" || !["manager", "customer"].includes(verified.role)) return;
      publish({
        id: verified.id,
        role: verified.role,
        name: cached !== null && cached.id === verified.id && cached.role === verified.role && typeof cached.name === "string" ? cached.name : "",
      });
    } catch {
      // 서버 연결 실패 시 저장된 표시 정보만으로 로그인 상태를 만들지 않는다.
    }
  })();
  return restorePromise;
}

export async function logout() {
  generation += 1;
  await refreshPromise?.catch(() => null);
  const response = await fetch("/api/logout", { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("로그아웃에 실패했습니다.");
  clearSession();
}

export function useAuthUser() {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    () => currentUser,
    () => null,
  );
}
