import { useState, useEffect } from 'react';
import type { RadarMember, TeamStats, ActionItem, CommunicationBalance } from '@/types/analysis';

const MOCK_RADAR: RadarMember[] = [
  { memberId: 'm1', name: '멤버A', surfaceScore: 5,  inferredScore: 82 },
  { memberId: 'm2', name: '멤버B', surfaceScore: 35, inferredScore: 12 },
  { memberId: 'm3', name: '멤버C', surfaceScore: 32, inferredScore: 54 },
  { memberId: 'm4', name: '멤버D', surfaceScore: 55, inferredScore: 65 },
  { memberId: 'm5', name: '멤버E', surfaceScore: 85, inferredScore: 68 },
];

const MOCK_STATS: TeamStats = {
  motivationIndex: 78,
  motivationDelta: 6,
  turnoverRiskCount: 2,
  turnoverRiskDelta: -1,
  meetingCompletionRate: 91,
  actionCompletionRate: 64,
  memberTalkRatio: 52,
  leaderTalkRatio: 48,
};

const MOCK_ACTIONS: ActionItem[] = [
  { id: 'a1', title: '액션 아이템 제목', description: '액션 아이템 설명', priority: 'high' },
  { id: 'a2', title: '액션 아이템 제목', description: '액션 아이템 설명', priority: 'medium' },
  { id: 'a3', title: '액션 아이템 제목', description: '액션 아이템 설명', priority: 'low' },
];

const MOCK_COMMS: CommunicationBalance[] = [
  { memberId: 'm1', name: '이 름', memberRatio: 15, leaderRatio: 85, status: '위험' },
  { memberId: 'm2', name: '이 름', memberRatio: 70, leaderRatio: 30, status: '적정' },
  { memberId: 'm3', name: '이 름', memberRatio: 55, leaderRatio: 45, status: '관찰' },
  { memberId: 'm4', name: '이 름', memberRatio: 40, leaderRatio: 60, status: '관찰' },
  { memberId: 'm5', name: '이 름', memberRatio: 50, leaderRatio: 50, status: '적정' },
  { memberId: 'm6', name: '이 름', memberRatio: 52, leaderRatio: 48, status: '적정' },
];

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
