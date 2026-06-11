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

export interface CoachingExecution {
  total: number;
  completed: number;
  executionRate: number; // 0~100, 소수점 1자리
}

export interface MemberCadence {
  memberId: number;
  memberName: string;
  lastMeetingDate: string | null;
  daysSinceLastMeeting: number | null; // null = 아직 1on1 없음
}

export interface LeaderGrowthData {
  keyInsight: string | null;
  talkRatioTrend: MonthlyTrendPoint[];
  teamSafetyTrend: MonthlyTrendPoint[];
  monthlyMeetings: MonthlyTrendPoint[];
  promiseStats: LeaderPromiseStats;
  coachingExecution: CoachingExecution;
  memberCadence: MemberCadence[];
  highlights: string[];
}
