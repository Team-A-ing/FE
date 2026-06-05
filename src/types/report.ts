export interface LeaderReport {
  meetingId: number;
  round: number;
  memberName: string;
  memberJobTitle: string;
  meetingDate: string;
  durationSec: number;
  gaps: Gaps;
  safetyScore: number;
  flightRiskLabel: string | null;
  speechActs: SpeechActs;
  talkRatio: TalkRatio;
  feedbacks: Feedback[];
  nextActionPlans: ActionPlan[];
  promises: PromisesData;
}

export interface Gaps {
  alignmentGap: AlignmentGap;
  honestyGap: HonestyGap;
  executionGap: ExecutionGap;
}

export interface AlignmentGap {
  score: number;
  detail: string;
}

export interface HonestyGap {
  surveyScore: number;
  safetyScore: number;
  gap: number;
  direction: 'OVERREPORT' | 'UNDERREPORT' | 'ALIGNED';
  riskLevel: 'DANGER' | 'WARNING' | 'CAUTION' | 'SAFE';
}

export interface ExecutionGap {
  score: number;
  totalPromises: number;
  fulfilled: number;
  missed: number;
}

export interface SpeechActItem {
  count: number;
  baselineAvg: number;
  changeRate: number;
  instances: { text: string; timestamp: string }[];
}

export interface SpeechActs {
  vulnerability: SpeechActItem;
  constructiveDissent: SpeechActItem;
  initiative: SpeechActItem;
}

export interface TalkRatio {
  leaderRatio: number;
  memberRatio: number;
  recommendedLeaderRatio: number;
}

export interface Feedback {
  feedbackId: number;
  severity: 'ERROR' | 'WARNING' | 'SUCCESS';
  title: string;
  evidenceQuote: string;
  dataSummary: string;
  actionGuide: string;
}

export interface ActionPlan {
  planId: number;
  content: string;
  isCompleted: boolean;
}

export interface PromisesData {
  previous: PreviousPromise[];
  new: NewPromise[];
}

export interface PreviousPromise {
  promiseId: number;
  content: string;
  status: 'DONE' | 'MISSED';
}

export interface NewPromise {
  promiseId: number;
  content: string;
  category: string;
  dueDate: string;
  status: 'PENDING' | 'DONE' | 'MISSED';
}
