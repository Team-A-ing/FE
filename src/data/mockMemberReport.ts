import type { MemberReportData } from '@/types/memberReport';

export const MOCK_MEMBER_REPORT: MemberReportData = {
  meetingId: 10,
  round: 12,
  leaderName: '이준혁 팀장',
  meetingDate: '2026-05-08',
  durationSec: 2400,
  confirmedAchievements: [
    {
      careerEventId: 15,
      type: 'ACHIEVEMENT',
      title: '스프린트 3 FE 리드 완주',
      description: 'API 지연 상황에서 목 서버를 직접 구축해 팀 전체 개발을 무중단으로 유지했습니다.',
      impactMetric: '출시 지연 0일',
      leaderQuote: '위기 상황에서의 문제해결 능력과 팀 전체를 이끄는 자세가 탁월했습니다.',
      leaderName: '이준혁 팀장',
    },
    {
      careerEventId: 16,
      type: 'ACHIEVEMENT',
      title: '공통 컴포넌트 라이브러리 기여',
      description: 'DatePicker 공통화로 3개 팀 총 60시간 절감.',
      impactMetric: '공수 -60h',
      leaderQuote: '혼자 해결하지 않고 팀 전체를 끌어올리는 기여였습니다.',
      leaderName: '이준혁 팀장',
    },
  ],
  leaderPromises: [
    {
      promiseId: 4,
      content: 'AWS 프로덕션 접근 권한 부여',
      category: 'RESOURCE',
      dueDate: '2026-05-15',
      status: 'PENDING',
    },
    {
      promiseId: 5,
      content: 'QA 충원 안건 전사 회의 상정',
      category: 'TEAM_BUILDING',
      dueDate: '2026-05-12',
      status: 'PENDING',
    },
    {
      promiseId: 6,
      content: 'MSA 전환 성과 5월 올핸즈 발표',
      category: 'RECOGNITION',
      dueDate: '2026-05-20',
      status: 'PENDING',
    },
    {
      promiseId: 7,
      content: 'FE 코드 리뷰 SLA 기준 문서화',
      category: 'PROCESS',
      dueDate: '2026-04-30',
      status: 'DONE',
    },
  ],
};
