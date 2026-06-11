import Accordion from '@/components/ui/Accordion';
import Badge from '@/components/ui/Badge';
import type { PromiseSummaryItem, TeamPromiseSummaryData } from '@/types/promise';

export interface PromiseSummaryCardProps {
  data: TeamPromiseSummaryData;
  onComplete: (promiseId: string) => void;
  onViewMember?: (memberId: string) => void;
  loading?: boolean;
  error?: string | null;
}

function RoleTag({ role }: { role: 'leader' | 'member' }) {
  return (
    <span
      className={`text-xs font-medium ${role === 'leader' ? 'text-violet-500' : 'text-teal-500'}`}
    >
      {role === 'leader' ? '리더' : '멤버'}
    </span>
  );
}

function PromiseItemRow({
  promise,
  onComplete,
}: {
  promise: PromiseSummaryItem;
  onComplete: (id: string) => void;
}) {
  const isOverdue = promise.status === 'OVERDUE' && !promise.isCompleted;
  const isCompleted = promise.isCompleted;

  return (
    <div
      className={`flex gap-3 py-2.5 border-b border-gray-100 last:border-b-0 ${
        isCompleted ? 'opacity-60' : isOverdue ? 'bg-red-50 -mx-3 px-3 rounded' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        disabled={isCompleted}
        className={`mt-0.5 flex-shrink-0 w-4 h-4 accent-teal-500 ${
          isCompleted ? 'cursor-default' : 'cursor-pointer'
        }`}
        onChange={() => {
          if (!isCompleted) onComplete(promise.promiseId);
        }}
      />
      <div className="min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            isCompleted
              ? 'text-gray-400 line-through'
              : isOverdue
                ? 'text-red-700'
                : 'text-gray-800'
          }`}
        >
          {promise.content}
        </p>
        {promise.context && !isCompleted && (
          <p className="mt-0.5 text-xs text-gray-400 leading-snug">{promise.context}</p>
        )}
        <p className="mt-0.5 text-xs text-gray-400">
          {promise.round}회차 미팅
          {promise.partnerName && ` · ${promise.partnerName}님과의 약속`}
        </p>
        {isOverdue && (
          <span className="mt-1 inline-block text-xs font-semibold text-red-500">기한 초과</span>
        )}
      </div>
    </div>
  );
}

export default function PromiseSummaryCard({
  data,
  onComplete,
  onViewMember,
  loading,
  error,
}: PromiseSummaryCardProps) {
  if (loading) {
    return <p className="py-4 text-sm font-medium text-gray-400">미이행 약속을 불러오는 중입니다.</p>;
  }
  if (error) {
    return <p className="text-sm font-medium text-gray-400">{error}</p>;
  }

  const { leaderPromises, memberPromises } = data;

  if (!leaderPromises && memberPromises.length === 0) {
    return <p className="py-4 text-sm font-medium text-gray-400">미이행 약속이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 리더가 멤버들에게 한 약속 종합 — 항상 최상단 */}
      {leaderPromises && (
        <Accordion
          title={
            <span className="flex items-center gap-1.5">
              {leaderPromises.memberName}
              <RoleTag role="leader" />
            </span>
          }
          rightElement={
            <Badge
              label={`${leaderPromises.stats.completed}/${leaderPromises.stats.total} 완료`}
              color={
                leaderPromises.stats.overdue > 0 ? 'red'
                  : leaderPromises.stats.pending > 0 ? 'yellow' : 'green'
              }
            />
          }
          defaultOpen
        >
          {leaderPromises.promises.map(promise => (
            <PromiseItemRow key={promise.promiseId} promise={promise} onComplete={onComplete} />
          ))}
        </Accordion>
      )}

      {/* 멤버가 한 약속 — 멤버별 */}
      {memberPromises.map(member => {
        const { stats } = member;
        const badgeColor = stats.overdue > 0 ? 'red' : stats.pending > 0 ? 'yellow' : 'green';

        return (
          <Accordion
            key={member.memberId}
            title={
              <span className="flex items-center gap-1.5">
                {member.memberName}
                <RoleTag role="member" />
              </span>
            }
            rightElement={
              <Badge label={`${stats.completed}/${stats.total} 완료`} color={badgeColor} />
            }
            defaultOpen
          >
            {onViewMember && (
              <div className="flex justify-end pb-1">
                <button
                  type="button"
                  onClick={() => onViewMember(member.memberId)}
                  className="text-xs font-medium text-teal-600 hover:text-teal-700"
                >
                  자세히 보기 ›
                </button>
              </div>
            )}
            {member.promises.map(promise => (
              <PromiseItemRow key={promise.promiseId} promise={promise} onComplete={onComplete} />
            ))}
          </Accordion>
        );
      })}
    </div>
  );
}
