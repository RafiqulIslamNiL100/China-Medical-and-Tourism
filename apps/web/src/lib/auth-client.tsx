"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "@/lib/api";

const STORAGE_KEY = "cmt.auth";

type StoredAuth = { accessToken: string; refreshToken: string };

type AuthState = {
  user: api.User | null;
  accessToken: string | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    fullName: string;
    termsAccepted: boolean;
    marketingConsent: boolean;
  }) => Promise<{ userId: string }>;
  verifyEmail: (userId: string, code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function readStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(auth: StoredAuth | null) {
  if (typeof window === "undefined") return;
  if (auth) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  else window.localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<api.User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    if (!stored) {
      setLoading(false);
      return;
    }
    setAccessToken(stored.accessToken);
    api
      .me(stored.accessToken)
      .then(setUser)
      .catch(() => {
        writeStoredAuth(null);
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyTokens = useCallback(async (tokens: api.AuthTokens) => {
    writeStoredAuth({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    setAccessToken(tokens.accessToken);
    const profile = await api.me(tokens.accessToken);
    setUser(profile);
  }, []);

  const login = useCallback(
    async (emailOrPhone: string, password: string) => {
      const result = await api.login({ emailOrPhone, password });
      if ("twoFactorRequired" in result) {
        throw new api.ApiError(200, "TWO_FACTOR_REQUIRED", "Two-factor authentication is required for this account.");
      }
      await applyTokens(result);
    },
    [applyTokens],
  );

  const register = useCallback(
    async (input: { email: string; password: string; fullName: string; termsAccepted: boolean; marketingConsent: boolean }) => {
      const result = await api.register(input);
      return { userId: result.user.id };
    },
    [],
  );

  const verifyEmail = useCallback(
    async (userId: string, code: string) => {
      const tokens = await api.verifyEmail({ userId, code });
      await applyTokens(tokens);
    },
    [applyTokens],
  );

  const logout = useCallback(() => {
    writeStoredAuth(null);
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
