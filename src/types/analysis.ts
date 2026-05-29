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
// 레이더 차트용 인터페이스
export interface RadarMember {
  memberId: string;
  name: string;
  surfaceScore: number;
  inferredScore: number;
}
// 액션 아이템 우선순위 인터페이스
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}
// 발화 비율 인터페이스
export interface CommunicationBalance {
  memberId: string;
  name: string;
  memberRatio: number;
  leaderRatio: number;
  status: '위험' | '적정' | '관찰';
}
// 팀 통계 인터페이스
export interface TeamStats {
  motivationIndex: number;
  motivationDelta: number;
  turnoverRiskCount: number;
  turnoverRiskDelta: number;
  meetingCompletionRate: number;
  actionCompletionRate: number;
  memberTalkRatio: number;
  leaderTalkRatio: number;
}