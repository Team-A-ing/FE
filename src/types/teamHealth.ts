export type TeamHealthTrend = 'IMPROVING' | 'DECLINING' | 'UNCHANGED';

export interface TeamHealthHistoryPoint {
  yearMonth: string;
  score: number;
}

export interface TeamHealthScoreData {
  currentScore: number;
  previousScore: number;
  diff: number;
  trend: TeamHealthTrend;
  history: TeamHealthHistoryPoint[];
}
