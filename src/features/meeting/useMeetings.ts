import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { fetchMeetings } from '@/api/meetings';
import type { MeetingListItem } from '@/types/meeting';

export function useMeetings() {
  const teamId = useAuthStore((s) => s.user?.teamId);
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!teamId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMeetings(teamId);
      setMeetings(data);
    } catch {
      setError('미팅 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  return { meetings, isLoading, error, refetch: load };
}
