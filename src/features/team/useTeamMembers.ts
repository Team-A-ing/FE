import { useState, useCallback } from 'react';
import { getTeamMembers, type TeamMember } from '@/api/teams';

export function useTeamMembers(teamId: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!teamId) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await getTeamMembers(teamId);
      setMembers(result);
    } catch {
      setError('멤버 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  return { members, isLoading, error, fetch };
}
