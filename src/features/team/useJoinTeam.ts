import { useState } from 'react';
import { joinTeam } from '@/api/teams';
import { fetchMe } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';

const ERROR_MESSAGES: Record<string, string> = {
  TEAM_NOT_FOUND: '유효하지 않은 초대 코드입니다.',
  ALREADY_IN_TEAM: '이미 팀에 소속되어 있습니다.',
};

export function useJoinTeam() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const join = async (inviteCode: string): Promise<string> => {
    setIsLoading(true);
    setError('');
    try {
      const result = await joinTeam(inviteCode);
      const freshUser = await fetchMe();
      setAuth(freshUser, token ?? '');
      return result.teamName;
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'response' in err
          ? (err.response as { data?: { code?: string } })?.data?.code
          : undefined;
      const message = (code && ERROR_MESSAGES[code]) ?? '팀 참여에 실패했습니다.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { join, isLoading, error };
}
