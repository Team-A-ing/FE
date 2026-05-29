import { useEffect, useState } from 'react';
import { fetchBlockerPyramid } from '@/api/teamDashboard';
import { MOCK_BLOCKER_PYRAMID } from '@/data/mockBlockerPyramid';
import type { BlockerPyramidData } from '@/types/blocker';

export function useBlockerPyramid(teamId?: string) {
  const [data, setData] = useState<BlockerPyramidData | null>(null);
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
      setData(MOCK_BLOCKER_PYRAMID);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    const resolvedTeamId = teamId;

    async function loadBlockerPyramid() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBlockerPyramid(resolvedTeamId);
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData(null);
          setError('블로커 피라미드를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadBlockerPyramid();

    return () => {
      ignore = true;
    };
  }, [teamId]);

  return { data, loading, error };
}
