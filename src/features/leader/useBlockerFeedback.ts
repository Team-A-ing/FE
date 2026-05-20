import { useState, useEffect } from 'react';

interface ActionItem {
  title: string;
  content: string;
  type?: 'positive' | 'negative' | 'neutral';
}

interface BlockerFeedbackData {
  summary: string;
  actions: ActionItem[];
}

const MOCK_FEEDBACK: BlockerFeedbackData = {
  summary:
    "QA 리소스 부족과 소통 지연이 주요 병목입니다. 즉각적인 대응이 필요합니다.",
  actions: [
    {
      title: "QA 리소스 부족",
      content: "이번 주 주간 회의에서 QA 충원 또는 일정 조정 안건을 상정하세요.",
      type: "negative",
    },
    {
      title: "소통 지연 발생",
      content: "위험군 멤버에게 비공식 1on1을 배정하세요.",
      type: "neutral",
    },
    {
      title: "프로세스 개선 제안",
      content: "스프린트 시작 전 의제 사전 공유를 도입하세요.",
      type: "positive",
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