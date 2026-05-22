import { useState } from 'react';
import { completeActionPlan } from '@/api/actionPlans';
import type { ActionPlan } from '@/types/report';

interface Props {
  items: ActionPlan[];
}

export default function ActionPlanSection({ items }: Props) {
  const [completed, setCompleted] = useState<Set<number>>(
    new Set(items.filter((i) => i.isCompleted).map((i) => i.planId))
  );
  const [errorId, setErrorId] = useState<number | null>(null);
  const isMock = import.meta.env.VITE_USE_MOCK === 'true';

  const handleToggle = async (planId: number, currentlyDone: boolean) => {
    if (currentlyDone) return;
    setCompleted((prev) => new Set([...prev, planId]));
    setErrorId(null);
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

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Next Action Plan
      </h3>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {items.map((item, idx) => {
          const done = completed.has(item.planId);
          const isLast = idx === items.length - 1;
          return (
            <div key={item.planId}>
              <label
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  done ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => handleToggle(item.planId, done)}
                  className="mt-0.5 w-4 h-4 accent-[#5F74FA] flex-shrink-0"
                />
                <span
                  className={`text-sm text-gray-700 ${done ? 'line-through text-gray-400' : ''}`}
                >
                  {item.content}
                </span>
              </label>
              {errorId === item.planId && (
                <p className="px-4 pb-2 text-xs text-red-500">
                  저장에 실패했습니다. 다시 시도해주세요.
                </p>
              )}
              {!isLast && <div className="border-t border-gray-100" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
