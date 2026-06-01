export type MemberAchievementType = 'ACHIEVEMENT' | 'PROPOSAL_ADOPTED';
export type MemberPromiseCategory = 'RESOURCE' | 'TEAM_BUILDING' | 'RECOGNITION' | 'PROCESS';
export type MemberPromiseStatus = 'PENDING' | 'DONE';

export interface MemberReportApiResponse {
  success: boolean;
  code: string;
  message: string;
  data: MemberReportData;
}

export interface MemberReportData {
  meetingId: number;
  round: number;
  leaderName: string;
  meetingDate: string;
  durationSec: number | null;
  confirmedAchievements: ConfirmedAchievement[];
  leaderPromises: LeaderPromise[];
}

export interface ConfirmedAchievement {
  careerEventId: number;
  type: MemberAchievementType;
  title: string;
  description: string;
  impactMetric: string;
  leaderQuote: string;
  leaderName: string;
}

export interface LeaderPromise {
  promiseId: number;
  content: string;
  category: MemberPromiseCategory;
  dueDate: string;
  status: MemberPromiseStatus;
}
