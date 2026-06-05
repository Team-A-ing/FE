import type { TeamCoachingData } from '@/types/coaching';

export const MOCK_TEAM_COACHING: TeamCoachingData = {
  overallAssessment: '4명 중 2명이 SILENT_RISK 사분면에 위치합니다.',
  insights: [
    {
      type: 'ATTENTION',
      content: '지수님의 Safety Score가 최근 3회 평균 대비 35% 하락했습니다 (72→47).',
      relatedMemberId: 'mock-member-1',
    },
    {
      type: 'POSITIVE',
      content: '민수님의 Initiative 발화가 3회 연속 증가 추세입니다 (1→2→4회).',
      relatedMemberId: 'mock-member-2',
    },
  ],
  suggestedActions: [
    '다음 1on1에서 지수님에게 열린 질문으로 시작해보세요.',
    '민수님의 자발적 제안에 대해 구체적 피드백을 주세요.',
  ],
};
