import { useEffect, useState } from 'react';
import { fetchCareerShowcase, fetchCareerStats, fetchCareerTimeline } from '@/api/career';
import {
  MOCK_CAREER_SHOWCASE,
  MOCK_CAREER_STATS,
  MOCK_CAREER_TIMELINE,
} from '@/data/mockCareer';
import type { CareerEvent, CareerStats } from '@/types/career';

interface CareerDashboardData {
  stats: CareerStats | null;
  showcase: CareerEvent[];
  timeline: CareerEvent[];
}

interface CareerDashboardErrors {
  stats?: string;
  showcase?: string;
  timeline?: string;
}

const initialData: CareerDashboardData = {
  stats: null,
  showcase: [],
  timeline: [],
};

export function useCareerDashboard(memberId: string | undefined) {
  const [data, setData] = useState<CareerDashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<CareerDashboardErrors>({});

  useEffect(() => {
    if (!memberId) {
      setLoading(false);
      setErrors({ stats: '멤버 정보를 찾을 수 없습니다.' });
      return;
    }

    const resolvedMemberId = memberId;

    if (import.meta.env.VITE_USE_MOCK?.trim() === 'true') {
      const timer = setTimeout(() => {
        setData({
          stats: {
            ...MOCK_CAREER_STATS,
            memberId: Number(resolvedMemberId) || MOCK_CAREER_STATS.memberId,
          },
          showcase: MOCK_CAREER_SHOWCASE,
          timeline: MOCK_CAREER_TIMELINE,
        });
        setErrors({});
        setLoading(false);
      }, 250);

      return () => clearTimeout(timer);
    }

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setErrors({});

      const [statsResult, showcaseResult, timelineResult] = await Promise.allSettled([
        fetchCareerStats(resolvedMemberId),
        fetchCareerShowcase(resolvedMemberId),
        fetchCareerTimeline(resolvedMemberId),
      ]);

      if (cancelled) return;

      setData({
        stats: statsResult.status === 'fulfilled' ? statsResult.value : null,
        showcase: showcaseResult.status === 'fulfilled' ? showcaseResult.value : [],
        timeline: timelineResult.status === 'fulfilled' ? timelineResult.value : [],
      });

      setErrors({
        ...(statsResult.status === 'rejected'
          ? { stats: '프로필 정보를 불러오지 못했습니다. 다시 시도해주세요.' }
          : {}),
        ...(showcaseResult.status === 'rejected'
          ? { showcase: '성과 정보를 불러오지 못했습니다. 다시 시도해주세요.' }
          : {}),
        ...(timelineResult.status === 'rejected'
          ? { timeline: '커리어 메모리를 불러오지 못했습니다. 다시 시도해주세요.' }
          : {}),
      });
      setLoading(false);
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [memberId]);

  return { data, loading, errors };
}
