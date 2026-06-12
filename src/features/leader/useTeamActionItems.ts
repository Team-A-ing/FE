import { useEffect, useState } from 'react';
import { fetchTeamActionItems } from '@/api/actionPlans';
import type { MemberActionItems } from '@/types/actionPlan';

export function useTeamActionItems(teamId?: string) {
  const [data, setData] = useState<MemberActionItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTeamActionItems(teamId!);
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData([]);
          setError('아직 정해진 액션이 없습니다.');
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
