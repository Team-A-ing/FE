import type { MemberPromiseSummary } from '@/types/promise';

export const MOCK_PROMISE_SUMMARY: MemberPromiseSummary[] = [
  {
    memberId: 'member-1',
    memberName: '김민준',
    promises: [
      {
        promiseId: 'p-1',
        content: 'QA 리소스 이슈 에스컬레이션',
        context: '스프린트 회고 중 QA 병목 논의',
        status: 'OVERDUE',
        createdAt: '2026-05-12',
        meetingTitle: '5/12 1on1 미팅',
      },
      {
        promiseId: 'p-2',
        content: '신규 온보딩 문서 업데이트',
        context: '신규 입사자 적응 이슈 논의 중 제안',
        status: 'PENDING',
        createdAt: '2026-05-28',
        meetingTitle: '5/28 1on1 미팅',
      },
    ],
    stats: { total: 5, completed: 3, pending: 1, overdue: 1 },
  },
  {
    memberId: 'member-2',
    memberName: '강다은',
    promises: [
      {
        promiseId: 'p-3',
        content: 'AWS 프로덕션 접근 권한 부여',
        context: '배포 권한 이슈 논의',
        status: 'PENDING',
        createdAt: '2026-05-20',
        meetingTitle: '5/20 1on1 미팅',
      },
    ],
    stats: { total: 3, completed: 2, pending: 1, overdue: 0 },
  },
  {
    memberId: 'member-3',
    memberName: '이서연',
    promises: [
      {
        promiseId: 'p-4',
        content: 'MSA 전환 성과 5분 발표 준비',
        context: '팀 공유 세션 기획 논의 중 자발적 제안',
        status: 'OVERDUE',
        createdAt: '2026-05-10',
        meetingTitle: '5/10 1on1 미팅',
      },
    ],
    stats: { total: 4, completed: 3, pending: 0, overdue: 1 },
  },
];
