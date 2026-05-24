import { useState } from 'react';
import apiClient from '@/api/client';
import { fetchMe } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginApiResponse {
  data?: {
    accessToken?: string;
    token?: string;
    user?: {
      role: 'LEADER' | 'MEMBER';
    };
  };
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async ({ email, password }: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        const authUser = {
          id: '1',
          email: email.trim(),
          name: '테스트 유저',
          role: 'leader' as const,
          jobTitle: 'FE 엔지니어',
          teamId: '1',
        };

        localStorage.setItem('token', 'mock-token');
        setAuth(authUser, 'mock-token');
        console.log('authStore state', useAuthStore.getState());

        return authUser;
      }

      const response = await apiClient.post<LoginApiResponse>('/api/v1/auth/login', {
        email: email.trim(),
        password,
      });
      const loginData = response.data.data;
      const user = loginData?.user;
      const token = loginData?.accessToken || loginData?.token || '';

      if (!user || !token || (user.role !== 'LEADER' && user.role !== 'MEMBER')) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('token', token);
      const authUser = await fetchMe();
      setAuth(authUser, token);

      return authUser;
    } catch {
      const message = '이메일 또는 비밀번호가 올바르지 않습니다';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}