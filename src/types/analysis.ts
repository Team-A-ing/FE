export type AnalysisStepKey =
  | 'CREATED' | 'TRANSCRIBING' | 'ANALYZING' | 'COMPLETED' | 'FAILED'
  | 'PENDING' | 'STT' | 'NLP' | 'SCORING' | 'FEEDBACK'; // mock 전용

// 분석 상태 데이터 인터페이스
export interface AnalysisStatusData {
  meetingId: number;
  step: AnalysisStepKey;
  stepNumber: number;
  totalSteps: number;
  progress: number;
  stepLabel: string;
  wittyMessage: {
    leader: string;
    member: string;
  };
}
export type RadarDirection = 'OVERREPORT' | 'UNDERREPORT';
export type RadarRiskLevel = 'SAFE' | 'CAUTION' | 'WARNING' | 'DANGER';
export type RadarQuadrant = 'STABLE' | 'SILENT_RISK' | 'EXPLICIT_RISK' | 'CONSERVATIVE';

export interface RadarDataPoint {
  memberId: number;
  memberName: string;
  surveyScore: number;
  safetyScore: number;
  honestyGap: number;
  direction: RadarDirection;
  riskLevel: RadarRiskLevel;
}

// 발화 비율 인터페이스
export interface CommunicationBalance {
  memberId: number;
  name: string;
  memberRatio: number;
  leaderRatio: number;
  status: '위험' | '관찰' | '적정';
}
