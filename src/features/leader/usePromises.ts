import { useEffect, useMemo, useState } from 'react';
import { fetchOverduePromises } from '@/api/promises';
import { MOCK_OVERDUE_PROMISES } from '@/data/mockPromises';
import type { OverduePromise } from '@/types/promise';

function sortByDueDate(promises: OverduePromise[]) {
  return [...promises].sort((a, b) => {
    const aTime = new Date(a.dueDate).getTime();
    const bTime = new Date(b.dueDate).getTime();
    return aTime - bTime;
  });
}

export function usePromises(teamId?: string) {
  const [promises, setPromises] = useState<OverduePromise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setPromises([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setPromises(MOCK_OVERDUE_PROMISES);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;

    async function loadPromises() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchOverduePromises();
        if (!ignore) setPromises(result);
      } catch {
        if (!ignore) {
          setPromises([]);
          setError('미이행 약속 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPromises();

    return () => {
      ignore = true;
    };
  }, [teamId]);

  const pendingPromises = useMemo(() => {
    return sortByDueDate(promises.filter((promise) => promise.status !== 'DONE'));
  }, [promises]);

  return { promises: pendingPromises, loading, error };
}
