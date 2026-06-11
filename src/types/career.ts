export type CareerEventType = 'ACHIEVEMENT' | 'LEARNING' | 'BLOCKER' | 'INITIATIVE' | 'GROWTH' | 'CONTRIBUTION' | 'FEEDBACK';

export interface CareerStats {
  memberId: number;
  name: string;
  jobTitle: string;
  teamName: string;
  totalMeetings: number;
  achievementCount: number;
  promiseFulfillmentRate: number;
  completedActionCount: number;
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
