import { useCallback, useEffect, useState } from 'react';
import { fetchPreBriefing } from '@/api/meetings';
import { MOCK_PRE_BRIEFING } from '@/data/mockPreBriefing';
import type { PreBriefingData } from '@/types/meeting';

export function usePreBriefing(meetingId: string | undefined) {
  const [data, setData] = useState<PreBriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }

    if (import.meta.env.VITE_USE_MOCK === 'true' && meetingId.startsWith('mock-')) {
      setData(MOCK_PRE_BRIEFING);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPreBriefing(meetingId)
      .then((briefing) => {
        if (!cancelled) setData(briefing);
      })
      .catch(() => {
        if (!cancelled) setError('미팅 전 브리핑을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [meetingId, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return { data, loading, error, retry };
}
