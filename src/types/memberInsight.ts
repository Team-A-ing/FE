export type MemberInsightPromiseStatus = 'DONE' | 'PENDING' | 'OVERDUE';

export interface MemberInsightPromise {
  promiseId: number;
  content: string;
  status: MemberInsightPromiseStatus;
  date: string | null;
  round: number;
}

export interface MemberInsightTrendPoint {
  round: number;
  date: string | null;
  healthScore: number;
  level: string; // 좋음 / 보통 / 낮음
}

export interface MemberInsightActionPlan {
  planId: number;
  content: string;
  isCompleted: boolean;
  date: string | null;
  round: number;
}

export interface MemberInsight {
  memberId: number;
  memberName: string;
  jobTitle: string | null;
  promises: MemberInsightPromise[];
  statusTrend: MemberInsightTrendPoint[];
  actionPlans: MemberInsightActionPlan[];
}
