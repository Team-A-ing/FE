import type { TeamHealthScoreData } from '@/types/teamHealth';

export const MOCK_TEAM_HEALTH_SCORE: TeamHealthScoreData = {
  currentScore: 74,
  previousScore: 62,
  diff: 12,
  trend: 'IMPROVING',
  history: [
    { yearMonth: '2025-11', score: 55 },
    { yearMonth: '2025-12', score: 58 },
    { yearMonth: '2026-01', score: 60 },
    { yearMonth: '2026-02', score: 63 },
    { yearMonth: '2026-03', score: 62 },
    { yearMonth: '2026-04', score: 74 },
  ],
};
