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

  // 체크박스 완료 시 낙관적으로 해당 약속 제거 후 PATCH 호출
  const complete = useCallback(async (promiseId: string) => {
    setData(prev =>
      prev
        .map(member => ({
          ...member,
          promises: member.promises.filter(p => p.promiseId !== promiseId),
        }))
        .filter(member => member.promises.length > 0),
    );
    try {
      await completePromise(promiseId);
    } catch {
      // silent — 낙관적 업데이트 유지
    }
  }, []);

  return { data, loading, error, complete };
}
