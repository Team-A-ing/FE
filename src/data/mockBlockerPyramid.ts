import type { BlockerPyramidData } from '@/types/blocker';

export const MOCK_BLOCKER_PYRAMID: BlockerPyramidData = {
  blockerKeywords: [
    { keyword: 'QA 리소스 부족', count: 12, mentionedBy: 5, relatedMembers: [{ memberId: 1, memberName: '김지수', mentionCount: 4 }, { memberId: 2, memberName: '이민준', mentionCount: 3 }] },
    { keyword: '프론트엔드 소통 지연', count: 10, mentionedBy: 4, relatedMembers: [{ memberId: 3, memberName: '박서연', mentionCount: 3 }] },
    { keyword: '코드 리뷰 병목', count: 9, mentionedBy: 4, relatedMembers: [{ memberId: 1, memberName: '김지수', mentionCount: 2 }] },
    { keyword: '기획 변경 잦음', count: 8, mentionedBy: 3, relatedMembers: [] },
    { keyword: 'API 스펙 불명확', count: 7, mentionedBy: 3, relatedMembers: [] },
    { keyword: '배포 일정 압박', count: 6, mentionedBy: 3, relatedMembers: [] },
    { keyword: '의사결정 지연', count: 5, mentionedBy: 2, relatedMembers: [] },
    { keyword: '테스트 환경 불안정', count: 4, mentionedBy: 2, relatedMembers: [] },
    { keyword: '문서 최신화 부족', count: 3, mentionedBy: 2, relatedMembers: [] },
    { keyword: '회의 피로도', count: 2, mentionedBy: 1, relatedMembers: [] },
  ],
  actionPrescriptions: [
    {
      severity: 'ERROR',
      title: 'QA 리소스 부족 반복 언급',
      dataSummary: '5명의 멤버가 최근 미팅에서 총 12회 언급',
      actionGuide: '이번 주 주간 회의에서 배포 일정 조정 또는 QA 인력 충원 여부를 검토하세요.',
    },
    {
      severity: 'WARNING',
      title: 'Speech Act 급감 멤버 감지',
      dataSummary: '강다은, 오재민 님의 Initiative가 최근 3회 평균 대비 60% 이상 감소',
      actionGuide: '이번 주 안에 비공개 1on1을 먼저 배정하세요.',
    },
    {
      severity: 'INFO',
      title: 'Alignment Gap 개선 가능',
      dataSummary: '팀 평균 Alignment Gap 35점으로 의제 공유 부족 신호가 있습니다.',
      actionGuide: '스프린트 킥오프 전 30분 의제 사전 공유를 도입하세요.',
    },
  ],
};
