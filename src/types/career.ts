export type CareerEventType = 'ACHIEVEMENT' | 'LEARNING' | 'BLOCKER' | 'PROPOSAL_ADOPTED';

export interface CareerStats {
  memberId: number;
  name: string;
  jobTitle: string;
  teamName: string;
  totalMeetings: number;
  achievementCount: number;
  leaderEndorsementCount: number;
  contributionPercentile: number;
  aiSummary: string;
}

export interface CareerEvent {
  careerEventId: number;
  type: CareerEventType;
  title: string;
  description: string;
  impactMetric?: string;
  eventDate: string;
  meetingRound: number;
}
