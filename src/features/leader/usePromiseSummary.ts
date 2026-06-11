import { useCallback, useEffect, useState } from 'react';
import { completePromise, fetchPromiseSummary } from '@/api/promises';
import { MOCK_PROMISE_SUMMARY } from '@/data/mockPromiseSummary';
import type { MemberPromiseSummary, TeamPromiseSummaryData } from '@/types/promise';

const EMPTY: TeamPromiseSummaryData = { leaderPromises: null, memberPromises: [] };

function completeInSummary(summary: MemberPromiseSummary, promiseId: string): MemberPromiseSummary {
  const target = summary.promises.find(p => p.promiseId === promiseId);
  if (!target || target.isCompleted) return summary;
  const wasOverdue = target.status === 'OVERDUE';
  return {
    ...summary,
    promises: summary.promises.map(p =>
      p.promiseId === promiseId ? { ...p, isCompleted: true } : p,
    ),
    stats: {
      ...summary.stats,
      completed: summary.stats.completed + 1,
      pending: wasOverdue ? summary.stats.pending : Math.max(0, summary.stats.pending - 1),
      overdue: wasOverdue ? Math.max(0, summary.stats.overdue - 1) : summary.stats.overdue,
    },
  };
}

export function usePromiseSummary(teamId?: string) {
  const [data, setData] = useState<TeamPromiseSummaryData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData(EMPTY);
      setLoading(false);
      setError(null);
      return;
    }

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setData({ leaderPromises: null, memberPromises: MOCK_PROMISE_SUMMARY });
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPromiseSummary(teamId!);
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData(EMPTY);
          setError('미이행 약속 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [teamId]);

  // 체크박스 완료 시: 약속을 목록에서 제거하지 않고 체크된(isCompleted) 상태로 유지하며
  // 완료 개수를 증가시킨다. 리더/멤버 양쪽 섹션 모두 갱신.
  // PATCH로 서버에 완료 시각을 영속화한다. 당일에는 체크된 채 유지되고,
  // 다음 날 대시보드를 다시 열면 BE가 제외하여 사라진다.
  const complete = useCallback(async (promiseId: string) => {
    setData(prev => ({
      leaderPromises: prev.leaderPromises ? completeInSummary(prev.leaderPromises, promiseId) : null,
      memberPromises: prev.memberPromises.map(member => completeInSummary(member, promiseId)),
    }));
    try {
      await completePromise(promiseId);
    } catch {
      // silent — 낙관적 업데이트 유지
    }
  }, []);

  return { data, loading, error, complete };
}
