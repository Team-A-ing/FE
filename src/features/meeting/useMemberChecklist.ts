import { useCallback, useEffect, useState } from 'react';
import { fetchMemberInsight } from '@/api/career';
import { completeActionPlan, uncompleteActionPlan } from '@/api/actionPlans';
import { completePromise, incompletePromise } from '@/api/promises';
import type { MemberInsightActionPlan, MemberInsightPromise } from '@/types/memberInsight';

/**
 * 한 멤버의 회차별 액션 플랜 / 약속을 불러오고, 체크박스 on/off를 낙관적으로 토글한다.
 * - 리더 미팅 진행 화면(미완료 항목 체크리스트)과
 * - 멤버 커리어 메모리(회차별 약속)에서 공통 사용.
 */
export interface OutstandingSnapshot {
  plans: Set<number>;
  promises: Set<number>;
}

export function useMemberChecklist(memberId: string | number | undefined) {
  const [actionPlans, setActionPlans] = useState<MemberInsightActionPlan[]>([]);
  const [promises, setPromises] = useState<MemberInsightPromise[]>([]);
  // 데이터가 처음 도착한 시점에 '미완료'였던 항목 id 집합 — 체크 후에도 목록 멤버십이 흔들리지 않도록 fetch 직후 1회 고정.
  const [outstanding, setOutstanding] = useState<OutstandingSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memberId === undefined || memberId === '') {
      setActionPlans([]);
      setPromises([]);
      setOutstanding(null);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);
    setOutstanding(null);
    async function load() {
      try {
        const insight = await fetchMemberInsight(String(memberId));
        if (ignore) return;
        setActionPlans(insight.actionPlans);
        setPromises(insight.promises);
        setOutstanding({
          plans: new Set(insight.actionPlans.filter((p) => !p.isCompleted).map((p) => p.planId)),
          promises: new Set(
            insight.promises.filter((p) => p.status !== 'DONE').map((p) => p.promiseId),
          ),
        });
      } catch {
        if (!ignore) {
          setActionPlans([]);
          setPromises([]);
          setError('체크리스트를 불러오지 못했습니다.');
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

  const toggleActionPlan = useCallback(async (planId: number, nextCompleted: boolean) => {
    setActionPlans((prev) =>
      prev.map((p) => (p.planId === planId ? { ...p, isCompleted: nextCompleted } : p)),
    );
    try {
      await (nextCompleted ? completeActionPlan(planId) : uncompleteActionPlan(planId));
    } catch {
      // 실패 시 롤백
      setActionPlans((prev) =>
        prev.map((p) => (p.planId === planId ? { ...p, isCompleted: !nextCompleted } : p)),
      );
    }
  }, []);

  const togglePromise = useCallback(async (promiseId: number, nextDone: boolean) => {
    setPromises((prev) =>
      prev.map((p) => (p.promiseId === promiseId ? { ...p, status: nextDone ? 'DONE' : 'PENDING' } : p)),
    );
    try {
      await (nextDone ? completePromise(String(promiseId)) : incompletePromise(String(promiseId)));
    } catch {
      setPromises((prev) =>
        prev.map((p) => (p.promiseId === promiseId ? { ...p, status: nextDone ? 'PENDING' : 'DONE' } : p)),
      );
    }
  }, []);

  return { actionPlans, promises, outstanding, loading, error, toggleActionPlan, togglePromise };
}
