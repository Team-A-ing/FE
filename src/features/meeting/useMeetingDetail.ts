import { useState, useEffect } from 'react';
import { fetchMeetingDetail } from '@/api/meetings';
import type { MeetingDetail } from '@/types/meeting';

export function useMeetingDetail(meetingId: string | undefined) {
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchMeetingDetail(meetingId)
      .then(setMeeting)
      .catch(() => setError('미팅 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [meetingId]);

  return { meeting, loading, error };
}
