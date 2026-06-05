export type CoachingInsightType = 'ATTENTION' | 'POSITIVE';

export interface CoachingInsight {
  type: CoachingInsightType;
  content: string;
  relatedMemberId: string;
}

export interface TeamCoachingData {
  overallAssessment: string;
  insights: CoachingInsight[];
  suggestedActions: string[];
}
