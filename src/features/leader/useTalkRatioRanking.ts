import { useEffect, useState } from 'react';
import { fetchTalkRatioRanking } from '@/api/teamDashboard';
import { MOCK_COMMS } from '@/data/mockRadarData';
import type { CommunicationBalance } from '@/types/analysis';

export function useTalkRatioRanking(teamId?: string) {
  const [data, setData] = useState<CommunicationBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setData(MOCK_COMMS);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    const resolvedTeamId = teamId;

    async function loadTalkRatioRanking() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTalkRatioRanking(resolvedTeamId);
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData([]);
          setError('1on1 소통 균형 데이터를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadTalkRatioRanking();

    return () => {
      ignore = true;
    };
  }, [teamId]);

  return { data, loading, error };
}
