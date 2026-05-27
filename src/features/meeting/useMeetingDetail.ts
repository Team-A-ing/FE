import { useState, useEffect } from 'react';
import { fetchMeetingDetail } from '@/api/meetings';
import type { MeetingDetail } from '@/types/meeting';
// 테스트용 데이터(백엔드 연결 시 삭제)
const MOCK_MEETING: MeetingDetail = {
  meetingId: 0,
  round: 1,
  scheduledAt: new Date().toISOString(),
  durationSec: null,
  status: 'PENDING',
  leaderName: '나',
  partnerName: '김민준',
};

export function useMeetingDetail(meetingId: string | undefined) {
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }
    // 테스트 조건, 백엔드 정상 연결 시 삭제
    if (import.meta.env.VITE_USE_MOCK === 'true' && meetingId.startsWith('mock-')) {
      setMeeting(MOCK_MEETING);
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
