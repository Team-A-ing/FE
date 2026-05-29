import type { TeamHealthScoreData } from '@/types/teamHealth';

export const MOCK_TEAM_HEALTH_SCORE: TeamHealthScoreData = {
  teamId: 1,
  teamHealthScore: 74,
  trend: 'IMPROVING',
  alerts: [
    '강다은 님 Initiative 최근 3회 평균 대비 100% 감소',
    '오재민 님 Safety Score 기준 이하 (Silent Risk)',
  ],
};
