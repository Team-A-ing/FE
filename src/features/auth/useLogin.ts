import { useState } from 'react';
import apiClient from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import type { User, UserRole } from '@/types/user';

type ApiRole = 'LEADER' | 'MEMBER';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginApiUser {
  id: string | number;
  email: string;
  name: string;
  role: ApiRole;
  jobTitle?: string;
  teamId?: string | number | null;
}

interface LoginApiResponse {
  data?: {
    accessToken?: string;
    token?: string;
    user?: LoginApiUser;
  };
}

const toUserRole = (role: ApiRole): UserRole => (role === 'LEADER' ? 'leader' : 'member');

const toUser = (user: LoginApiUser): User => ({
  id: String(user.id),
  email: user.email,
  name: user.name,
  role: toUserRole(user.role),
  jobTitle: user.jobTitle || undefined,
  teamId: user.teamId == null ? '' : String(user.teamId),
});

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async ({ email, password }: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        const authUser: User = {
          id: '1',
          email: email.trim(),
          name: '테스트 유저',
          role: 'leader',
          jobTitle: 'FE 엔지니어',
          teamId: '1',
        };

        localStorage.setItem('token', 'mock-token');
        setAuth(authUser, 'mock-token');
        console.log('authStore state', useAuthStore.getState());

        return authUser;
      }

      const response = await apiClient.post<LoginApiResponse>('/v1/auth/login', {
        email: email.trim(),
        password,
      });
      const loginData = response.data.data;
      const user = loginData?.user;
      const token = loginData?.accessToken || loginData?.token || '';

      if (!user || !token || (user.role !== 'LEADER' && user.role !== 'MEMBER')) {
        throw new Error('Invalid login response');
      }

      const authUser = toUser(user);
      localStorage.setItem('token', token);
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