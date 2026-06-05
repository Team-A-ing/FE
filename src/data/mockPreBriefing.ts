import type { PreBriefingData } from '@/types/meeting';

export const MOCK_PRE_BRIEFING: PreBriefingData = {
  meetingId: 10,
  round: 5,
  memberName: '김지수',
  memberJobTitle: 'Frontend Engineer',
  scheduledAt: '2026-06-05T15:00:00',
  coachingGuide: {
    focusArea: '경청 강화',
    guideSummary:
      '최근 미팅에서 멤버가 어려움을 직접 꺼낸 횟수가 줄었습니다. 이번 1on1은 해결책을 먼저 제시하기보다 열린 질문으로 상황을 충분히 듣는 흐름이 좋습니다.',
    evidence: [
      '최근 3회 Vulnerability 발화 추이: 5회 -> 3회 -> 1회',
      '직전 미팅 Honesty Gap: +32 (OVERREPORT/CAUTION)',
      '미이행 약속 2건 중 1건이 기한을 넘겼습니다.',
    ],
    suggestedQuestions: [
      '요즘 작업하면서 가장 막히거나 말하기 어려웠던 부분이 있었나요?',
      '지난번에 이야기한 QA 리소스 건은 지금 어떤 상태인가요?',
      '제가 바로 도와주기보다 먼저 더 들어야 할 맥락이 있다면 무엇인가요?',
    ],
  },
  survey: {
    submitted: true,
    energyLevel: 3,
    issues: ['QA 리소스', '배포 일정'],
    desiredRoles: ['방향성 코칭', '리소스 지원'],
    surveyScore: 68,
  },
  lastMeeting: {
    safetyScore: 72,
    safetyScoreChange: 8,
    quadrant: 'STABLE',
    honestyGap: {
      direction: 'UNDERREPORT',
      riskLevel: 'SAFE',
    },
    speechActAlerts: ['최근 3회 Vulnerability 발화 0건'],
    blockerKeywords: ['QA 리소스', '배포 일정', 'API 문서'],
  },
  pendingPromises: [
    {
      promiseId: 1,
      content: '테스트 체크리스트 작성',
      dueDate: '2026-06-01',
      overdue: true,
    },
    {
      promiseId: 2,
      content: 'Blocker Pyramid FE 완성',
      dueDate: '2026-06-04',
      overdue: false,
    },
  ],
  recommendedTopics: [
    '미이행 약속 2건 팔로업',
    'QA 리소스 부족 해결 방안 논의',
    'Vulnerability 발화 감소 배경 확인',
  ],
};
