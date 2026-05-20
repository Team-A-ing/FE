import { useState, useEffect } from 'react';

interface ActionPrescription {
  severity: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  dataSummary: string;
  actionGuide: string;
}

interface BlockerFeedbackData {
  summary: string;
  actionPrescriptions: ActionPrescription[];
}

const MOCK_FEEDBACK: BlockerFeedbackData = {
  summary:
    'QA 리소스 부족과 프론트엔드 소통 지연이 주요 병목으로 반복 언급되었습니다. 즉각적인 일정 조정과 1on1 보완이 필요합니다.',
  actionPrescriptions: [
    {
      severity: 'ERROR',
      title: 'QA 리소스 부족 반복 언급',
      dataSummary: '3명의 멤버가 최근 3회 미팅에서 총 5회 언급',
      actionGuide: '이번 주 주간 회의에서 배포 일정 조정 또는 QA 인력 충원 안건을 상정하세요.',
    },
    {
      severity: 'WARNING',
      title: 'Speech Act 급감 멤버 감지',
      dataSummary: '강다은, 윤재원 - Initiative 최근 3회 평균 대비 60% 이상 감소',
      actionGuide: '이번 주 안에 비공식 1on1을 먼저 배정하세요.',
    },
    {
      severity: 'INFO',
      title: 'Alignment Gap 개선 가능',
      dataSummary: '팀 평균 Alignment Gap 35점 (논의했으나 결론 없음 수준)',
      actionGuide: '스프린트 킥오프 전 30분 내 의제 사전 공유를 도입하세요.',
    },
  ],
};

export function useBlockerFeedback(_teamId?: string) {
  const [blockerFeedback, setBlockerFeedback] = useState<BlockerFeedbackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlockerFeedback(MOCK_FEEDBACK);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { blockerFeedback, loading };
}
