import { useEffect, useState } from 'react';
import { fetchLeaderGrowth } from '@/api/leader';
import type { LeaderGrowthData } from '@/types/leaderGrowth';

export function useLeaderGrowth() {
  const [data, setData] = useState<LeaderGrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchLeaderGrowth();
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData(null);
          setError('리더십 성장 데이터를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
}
