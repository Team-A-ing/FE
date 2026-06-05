import { useEffect, useState } from 'react';
import { fetchTeamCoaching } from '@/api/teamDashboard';
import { MOCK_TEAM_COACHING } from '@/data/mockTeamCoaching';
import type { TeamCoachingData } from '@/types/coaching';

export function useTeamCoaching(teamId?: string) {
  const [data, setData] = useState<TeamCoachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setData(MOCK_TEAM_COACHING);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    const resolvedTeamId = teamId;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTeamCoaching(resolvedTeamId);
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData(null);
          setError('팀 코칭 데이터를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [teamId]);

  return { data, loading, error };
}
