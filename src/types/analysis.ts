export interface RadarMember {
  memberId: string;
  name: string;
  surfaceScore: number;
  inferredScore: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CommunicationBalance {
  memberId: string;
  name: string;
  memberRatio: number;
  leaderRatio: number;
  status: '위험' | '적정' | '관찰';
}

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