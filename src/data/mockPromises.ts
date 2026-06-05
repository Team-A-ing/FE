import type { OverduePromise } from '@/types/promise';

export const MOCK_OVERDUE_PROMISES: OverduePromise[] = [
  {
    promiseId: 5,
    content: 'QA 리소스 이슈 에스컬레이션',
    category: 'TEAM_BUILDING',
    dueDate: '2026-05-12',
    status: 'PENDING',
    fromMeetingRound: 11,
    memberName: '김민준',
  },
  {
    promiseId: 4,
    content: 'AWS 프로덕션 접근 권한 부여',
    category: 'RESOURCE',
    dueDate: '2026-05-15',
    status: 'PENDING',
    fromMeetingRound: 12,
    memberName: '강다은',
  },
  {
    promiseId: 6,
    content: 'MSA 전환 성과 5분 발표 준비',
    category: 'RECOGNITION',
    dueDate: '2026-05-20',
    status: 'MISSED',
    fromMeetingRound: 10,
    memberName: '이서연',
  },
];
