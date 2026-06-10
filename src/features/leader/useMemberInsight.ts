import { useEffect, useState } from 'react';
import { fetchMemberInsight } from '@/api/career';
import type { MemberInsight } from '@/types/memberInsight';

export function useMemberInsight(memberId: string | undefined) {
  const [data, setData] = useState<MemberInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMemberInsight(memberId!);
        if (!ignore) setData(result);
      } catch {
        if (!ignore) {
          setData(null);
          setError('멤버 상세 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [memberId]);

  return { data, loading, error };
}
