import { useEffect, useState } from 'react';
import { fetchMemberReport } from '@/api/meetings';
import { MOCK_MEMBER_REPORT } from '@/data/mockMemberReport';
import type { MemberReportData } from '@/types/memberReport';

export function useMemberReport(meetingId: string | undefined) {
  const [data, setData] = useState<MemberReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      setError('미팅 정보를 찾을 수 없습니다.');
      return;
    }

    if (import.meta.env.VITE_USE_MOCK?.trim() === 'true') {
      const timer = setTimeout(() => {
        setData({
          ...MOCK_MEMBER_REPORT,
          meetingId: Number(meetingId) || MOCK_MEMBER_REPORT.meetingId,
        });
        setLoading(false);
      }, 250);

      return () => clearTimeout(timer);
    }

    setLoading(true);
    setError(null);
    fetchMemberReport(meetingId)
      .then(setData)
      .catch(() => setError('멤버 리포트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [meetingId]);

  return { data, loading, error };
}
