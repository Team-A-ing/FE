import { useState } from 'react';
import apiClient from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import type { User, UserRole } from '@/types/user';

export type SignupRole = 'LEADER' | 'MEMBER';

const USE_MOCK_SIGNUP = false;

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: SignupRole;
  jobTitle?: string;
}

interface SignupApiUser {
  id: string | number;
  email: string;
  name: string;
  role: SignupRole;
  jobTitle?: string | null;
  teamId?: string | number | null;
}

interface SignupApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    token?: string;
    user?: SignupApiUser;
  };
}

const toUserRole = (role: SignupRole): UserRole => (role === 'LEADER' ? 'leader' : 'member');

const toUser = (user: SignupApiUser): User => ({
  id: String(user.id),
  email: user.email,
  name: user.name,
  role: toUserRole(user.role),
  teamId: user.teamId == null ? '' : String(user.teamId),
});

export function useSignup() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const signup = async ({ name, email, password, role, jobTitle }: SignupRequest) => {
    setIsLoading(true);
    setError('');

    try {
      const signupPayload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(jobTitle?.trim() ? { jobTitle: jobTitle.trim() } : {}),
      };

      console.log('signup payload', signupPayload);

      if (USE_MOCK_SIGNUP) {
        return null;
      }

      const response = await apiClient.post<SignupApiResponse>('/v1/auth/signup', signupPayload);

      if (response.data?.success === false) {
        throw new Error(response.data.message || '회원 가입에 실패했습니다.');
      }

      const signupData = response.data.data;
      const user = signupData?.user;
      const token = signupData?.accessToken || signupData?.token || '';

      if (user && token) {
        const authUser = toUser(user);
        localStorage.setItem('token', token);
        setAuth(authUser, token);
        return authUser;
      }

      return null;
    } catch {
      const message = '회원 가입에 실패했습니다.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}
