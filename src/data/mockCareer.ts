import type { CareerEvent, CareerStats } from '@/types/career';

export const MOCK_CAREER_STATS: CareerStats = {
  memberId: 1,
  name: '강다은',
  jobTitle: '시니어 프론트엔드 엔지니어',
  teamName: 'Product A팀',
  totalMeetings: 12,
  achievementCount: 6,
  promiseFulfillmentRate: 75.0,
  completedActionCount: 8,
  aiSummary:
    '결제 MSA 전환, 검색 성능 개선, 팀 DX 리드까지 기술적 역량과 팀 임팩트를 동시에 만드는 엔지니어입니다.',
};

export const MOCK_CAREER_SHOWCASE: CareerEvent[] = [
  {
    careerEventId: 15,
    type: 'ACHIEVEMENT',
    title: '결제 시스템 MSA 전환 완료',
    description:
      '모놀리스 결제를 3개 마이크로서비스로 분리하고 배포 주기를 3배 단축했습니다.',
    impactMetric: '다운타임 0분',
    eventDate: '2026-04-25',
    meetingRound: 12,
  },
  {
    careerEventId: 14,
    type: 'ACHIEVEMENT',
    title: '공통 DatePicker 컴포넌트 제안 -> 팀 도입',
    description: '3개 팀이 중복 개발 중인 DatePicker를 공통화하여 약 60시간을 절감했습니다.',
    impactMetric: '공수 -60h',
    eventDate: '2026-04-10',
    meetingRound: 11,
  },
  {
    careerEventId: 13,
    type: 'ACHIEVEMENT',
    title: '검색 응답 p95 40% 개선',
    description: 'Elasticsearch 인덱싱 재설계로 p95 응답 시간을 800ms에서 480ms로 낮췄습니다.',
    impactMetric: 'p95 -40%',
    eventDate: '2026-03-05',
    meetingRound: 9,
  },
  {
    careerEventId: 12,
    type: 'LEARNING',
    title: 'React 서버 컴포넌트 팀 전파',
    description: 'RSC 패턴 도입 및 전파 세션 2회를 진행하고 초기 로딩을 개선했습니다.',
    impactMetric: 'LCP -40%',
    eventDate: '2026-01-20',
    meetingRound: 8,
  },
  {
    careerEventId: 11,
    type: 'ACHIEVEMENT',
    title: '분기 MVP 수상',
    description: '크로스팀 협업 이니셔티브에서 핵심 역할을 완수했습니다.',
    impactMetric: 'MVP 수상',
    eventDate: '2025-11-10',
    meetingRound: 7,
  },
];

export const MOCK_CAREER_TIMELINE: CareerEvent[] = [
  {
    careerEventId: 20,
    type: 'ACHIEVEMENT',
    title: 'API 응답 속도 30% 개선 완료',
    description: '대시보드 핵심 API 캐싱 전략을 개선했습니다.',
    eventDate: '2025-05-20',
    meetingRound: 6,
  },
  {
    careerEventId: 19,
    type: 'LEARNING',
    title: '팀 커뮤니케이션 방식에 대한 인사이트 정리',
    description: '회고 내용을 팀 운영 가이드로 정리했습니다.',
    eventDate: '2025-04-15',
    meetingRound: 5,
  },
  {
    careerEventId: 18,
    type: 'BLOCKER',
    title: '업무 우선순위 조정 필요성 인식',
    description: '동시 진행 업무의 병목을 리더와 정리했습니다.',
    eventDate: '2025-03-28',
    meetingRound: 4,
  },
  {
    careerEventId: 17,
    type: 'ACHIEVEMENT',
    title: '신규 기능 런칭 및 팀 발표 성공적 완료',
    description: '주요 기능 출시와 기술 공유를 완료했습니다.',
    eventDate: '2025-03-10',
    meetingRound: 3,
  },
];
