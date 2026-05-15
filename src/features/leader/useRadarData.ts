import { useState, useEffect } from 'react';
import type { RadarMember, TeamStats, ActionItem, CommunicationBalance } from '@/types/analysis';
import { MOCK_RADAR, MOCK_STATS, MOCK_ACTIONS, MOCK_COMMS } from '@/data/mockRadarData';

export function useRadarData(_teamId?: string) {
  const [data, setData] = useState<RadarMember[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [comms, setComms] = useState<CommunicationBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_RADAR);
      setStats(MOCK_STATS);
      setActions(MOCK_ACTIONS);
      setComms(MOCK_COMMS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, stats, actions, comms, loading };
}