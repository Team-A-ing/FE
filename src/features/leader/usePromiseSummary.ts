import { useCallback, useEffect, useState } from 'react';
import { completePromise, fetchPromiseSummary } from '@/api/promises';
import { MOCK_PROMISE_SUMMARY } from '@/data/mockPromiseSummary';
import type { MemberPromiseSummary } from '@/types/promise';

export function usePromiseSummary(teamId?: string) {
  const [data, setData] = useState<MemberPromiseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setData(MOCK_PROMISE_SUMMARY);
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
          setData([]);
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

  // 체크박스 완료 시: 해당 약속을 목록에서 제거하고 완료 개수를 증가시킨다.
  // 멤버 카드는 유지하여 m/n 완료 배지가 갱신되는 것을 보여준다.
  // PATCH로 서버 상태(DONE)를 영속화하여 다음 날 대시보드에도 반영되게 한다.
  const complete = useCallback(async (promiseId: string) => {
    setData(prev =>
      prev.map(member => {
        const target = member.promises.find(p => p.promiseId === promiseId);
        if (!target) return member;
        const wasOverdue = target.status === 'OVERDUE';
        return {
          ...member,
          promises: member.promises.filter(p => p.promiseId !== promiseId),
          stats: {
            ...member.stats,
            completed: member.stats.completed + 1,
            pending: wasOverdue ? member.stats.pending : Math.max(0, member.stats.pending - 1),
            overdue: wasOverdue ? Math.max(0, member.stats.overdue - 1) : member.stats.overdue,
          },
        };
      }),
    );
    try {
      await completePromise(promiseId);
    } catch {
      // silent — 낙관적 업데이트 유지
    }
  }, []);

  return { data, loading, error, complete };
}
