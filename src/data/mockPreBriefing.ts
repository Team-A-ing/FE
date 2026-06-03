import type { PreBriefingData } from '@/types/meeting';

export const MOCK_PRE_BRIEFING: PreBriefingData = {
  meetingId: 10,
  round: 5,
  memberName: '김지수',
  memberJobTitle: 'Frontend Engineer',
  scheduledAt: '2026-06-05T15:00:00',
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
