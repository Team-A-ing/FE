import { useState } from 'react';
import { createTeam } from '@/api/teams';
import { fetchMe } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';

export function useCreateTeam() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const create = async (name: string): Promise<string> => {
    setIsLoading(true);
    setError('');
    try {
      const result = await createTeam(name);
      const freshUser = await fetchMe();
      setAuth(freshUser, token ?? '');
      return result.inviteCode;
    } catch {
      const message = '팀 생성에 실패했습니다.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
