import { useEffect, useState } from 'react';
import { MOCK_TEAM_HEALTH_SCORE } from '@/data/mockTeamHealthScore';
import type { TeamHealthScoreData } from '@/types/teamHealth';

export function useTeamHealthScore(_teamId?: string) {
  const [data, setData] = useState<TeamHealthScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_TEAM_HEALTH_SCORE);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
