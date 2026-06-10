export type TeamHealthTrend = 'IMPROVING' | 'STABLE' | 'DECLINING';

export interface TeamHealthScoreData {
  teamId: number;
  teamHealthScore: number;
  trend: TeamHealthTrend;
  alerts: string[];
  trendDelta?: number | null;
  statusNote?: string | null;
}
