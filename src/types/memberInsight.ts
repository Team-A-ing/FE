export type MemberInsightPromiseStatus = 'DONE' | 'PENDING' | 'OVERDUE';

export type MemberInsightPromiseOwner = 'MEMBER' | 'LEADER';

export interface MemberInsightPromise {
  promiseId: number;
  content: string;
  status: MemberInsightPromiseStatus;
  date: string | null;
  round: number;
  meetingTitle: string;
  ownerType: MemberInsightPromiseOwner;
}

export interface MemberInsightTrendPoint {
  round: number;
  date: string | null;
  healthScore: number;
  level: string; // 좋음 / 보통 / 낮음
  meetingTitle: string;
}

export interface MemberInsightActionPlan {
  planId: number;
  content: string;
  isCompleted: boolean;
  date: string | null;
  round: number;
  meetingTitle: string;
}

export interface MemberInsight {
  memberId: number;
  memberName: string;
  jobTitle: string | null;
  promises: MemberInsightPromise[];
  statusTrend: MemberInsightTrendPoint[];
  actionPlans: MemberInsightActionPlan[];
}
