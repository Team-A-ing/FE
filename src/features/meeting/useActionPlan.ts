import { useState, useEffect } from 'react';
import { completeActionPlan, uncompleteActionPlan } from '@/api/actionPlans';
import type { ActionPlan } from '@/types/report';

export function useActionPlan(items: ActionPlan[]) {
  const [completed, setCompleted] = useState<Set<number>>(
    () => new Set(items.filter((i) => i.isCompleted).map((i) => i.planId))
  );
  const [errorId, setErrorId] = useState<number | null>(null);
  const isMock = import.meta.env.VITE_USE_MOCK === 'true';

  useEffect(() => {
    setCompleted(new Set(items.filter((i) => i.isCompleted).map((i) => i.planId)));
  }, [items]);

  const toggle = async (planId: number, currentlyDone: boolean) => {
    setErrorId(null);
    if (currentlyDone) {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.delete(planId);
        return next;
      });
      if (!isMock) {
        try {
          await uncompleteActionPlan(planId);
        } catch {
          setCompleted((prev) => new Set([...prev, planId]));
          setErrorId(planId);
        }
      }
      return;
    }
    setCompleted((prev) => new Set([...prev, planId]));
    if (!isMock) {
      try {
        await completeActionPlan(planId);
      } catch {
        setCompleted((prev) => {
          const next = new Set(prev);
          next.delete(planId);
          return next;
        });
        setErrorId(planId);
      }
    }
  };

  return { completed, errorId, toggle };
}
