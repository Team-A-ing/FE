export interface MonthlyTrendPoint {
  month: string; // 'YYYY-MM'
  value: number;
  meetingCount: number;
}

export interface LeaderPromiseStats {
  total: number;
  done: number;
  missed: number;
  pending: number;
  doneRate: number; // 0~100, 소수점 1자리
}

export interface LeaderGrowthData {
  talkRatioTrend: MonthlyTrendPoint[];
  teamSafetyTrend: MonthlyTrendPoint[];
  promiseStats: LeaderPromiseStats;
  highlights: string[];
}
