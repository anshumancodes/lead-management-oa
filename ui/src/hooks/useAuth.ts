'use client';

import { useState, useCallback, useEffect } from 'react';
import { getUser, getToken, setAuth, clearAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import type { User, LoginInput, RegisterInput, AuthResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export function useAuth() {
  const [user, setUser]           = useState<User | null>(null);
  const [token, setToken]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setUser(getUser());
    setToken(getToken());
    setInitialized(true);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true);
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', input);
      setAuth(data.data.token, data.data.user);
      setToken(data.data.token);
      setUser(data.data.user);
      return data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setLoading(true);
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', input);
      setAuth(data.data.token, data.data.user);
      setToken(data.data.token);
      setUser(data.data.user);
      return data.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout,
  };
}
