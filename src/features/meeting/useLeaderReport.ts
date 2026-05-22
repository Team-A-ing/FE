import { useState, useEffect } from 'react';
import { fetchLeaderReport } from '@/api/meetings';
import type { LeaderReport } from '@/types/report';

const MOCK_LEADER_REPORT: LeaderReport = {
  meetingId: 10,
  round: 12,
  memberName: '강다은',
  memberJobTitle: '시니어 FE 엔지니어',
  meetingDate: '2026-05-08',
  durationSec: 2400,
  gaps: {
    alignmentGap: {
      score: 35,
      detail: "서베이에서 선택한 '커리어 성장' 주제 — 언급은 되었으나 구체적 결론 없음",
    },
    honestyGap: {
      surveyScore: 87,
      safetyScore: 31,
      gap: 56,
      direction: 'OVERREPORT',
      riskLevel: 'DANGER',
    },
    executionGap: {
      score: 40,
      totalPromises: 3,
      fulfilled: 1,
      missed: 2,
    },
  },
  safetyScore: 31,
  speechActs: {
    vulnerability: {
      count: 1,
      baselineAvg: 2.3,
      changeRate: -57,
      instances: [{ text: '사실 그 부분은 잘 모르겠습니다', timestamp: '02:15' }],
    },
    constructiveDissent: {
      count: 1,
      baselineAvg: 1.0,
      changeRate: 0,
      instances: [
        { text: '이번 스프린트도 QA가 부족해서 배포를 또 미뤘어요', timestamp: '08:42' },
      ],
    },
    initiative: {
      count: 0,
      baselineAvg: 2.8,
      changeRate: -100,
      instances: [],
    },
  },
  talkRatio: { leaderRatio: 70, memberRatio: 30, recommendedLeaderRatio: 40 },
  feedbacks: [
    {
      feedbackId: 1,
      severity: 'ERROR',
      title: 'Initiative 0회 — 베이스라인 대비 100% 하락',
      evidenceQuote:
        '"제가 한번 맡아볼게요" 류의 발화 없음 (최근 3회 평균 2.8회)',
      dataSummary:
        'Vulnerability 1회(-57%) / Dissent 1회(변동없음) / Initiative 0회(-100%). Safety Score 31점.',
      actionGuide:
        '다음 미팅에서 "요즘 새로 시도해보고 싶은 거 있어?" 같은 개방형 질문으로 시작해 보세요.',
    },
    {
      feedbackId: 2,
      severity: 'WARNING',
      title: '멤버 발언 비율 30% — 권장(60%) 미달',
      evidenceQuote: '리더 연속 발화 구간 7턴 × 2회 감지',
      dataSummary:
        '리더 발화 70%, 멤버 30%. 권장 비율 40/60 대비 리더 과다 발화.',
      actionGuide:
        '다음 1on1 시작 5분은 질문만 하세요. "3초 pause" 기법을 연습해 보세요.',
    },
    {
      feedbackId: 3,
      severity: 'SUCCESS',
      title: 'QA 리소스 이슈를 명확하게 제기했습니다',
      evidenceQuote:
        '"이번 스프린트도 QA가 부족해서 배포를 또 미뤘어요" (08:42)',
      dataSummary:
        'Constructive Dissent 1회. 구체적 상황+의견 제시 — 고품질 발화.',
      actionGuide:
        '"그 외에 팀 차원에서 바꿨으면 하는 게 있어?" 로 더 꺼내도록 유도하세요.',
    },
  ],
  nextActionPlans: [
    { planId: 1, content: '다음 1on1 시작 5분은 질문만 합니다.', isCompleted: false },
    {
      planId: 2,
      content: 'QA 리소스 이슈에 대해 이번 주 목요일까지 구체적 답변을 전달합니다.',
      isCompleted: false,
    },
    {
      planId: 3,
      content: "발화 비율을 40% 이하로 줄이기 위해 '3초 pause' 기법을 연습합니다.",
      isCompleted: true,
    },
    {
      planId: 4,
      content: '강다은 님의 MSA 전환 성과를 5월 올핸즈 미팅에서 공개 발표합니다.',
      isCompleted: false,
    },
  ],
  promises: {
    previous: [
      { promiseId: 1, content: '기술 블로그 주제 함께 정하기', status: 'DONE' },
      { promiseId: 2, content: 'AWS 프로덕션 접근 권한 부여', status: 'MISSED' },
      { promiseId: 3, content: 'QA 리소스 이슈 에스컬레이션', status: 'MISSED' },
    ],
    new: [
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
        content: '강다은 성과 올핸즈 발표',
        category: 'RECOGNITION',
        dueDate: '2026-05-20',
        status: 'PENDING',
      },
    ],
  },
};

export function useLeaderReport(meetingId: string | undefined) {
  const [report, setReport] = useState<LeaderReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setReport(MOCK_LEADER_REPORT);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchLeaderReport(meetingId)
      .then(setReport)
      .catch(() => setError('리포트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [meetingId, retryCount]);

  const retry = () => setRetryCount((c) => c + 1);
  return { report, loading, error, retry };
}
