import { useEffect, useState } from 'react';
import { fetchPromiseReminders } from '@/api/promises';
import type { PromiseReminderData } from '@/types/promise';

export function usePromiseReminders() {
  const [data, setData] = useState<PromiseReminderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const result = await fetchPromiseReminders();
        if (!ignore) setData(result);
      } catch {
        // 리마인더는 보조 정보 — 실패 시 배너를 표시하지 않음
        if (!ignore) setData(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading };
}
