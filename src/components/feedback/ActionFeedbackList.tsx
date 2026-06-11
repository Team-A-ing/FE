import { useState } from 'react';
import FeedbackCard, { type FeedbackCardProps } from '@/components/feedback/FeedbackCard';
import type { RelatedMember } from '@/types/blocker';

export interface ActionFeedbackItem {
  severity: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  dataSummary: string;
  actionGuide: string;
  relatedMembers?: RelatedMember[];
}

interface ActionFeedbackListProps {
  items: ActionFeedbackItem[];
}

const severityToFeedbackType: Record<
  ActionFeedbackItem['severity'],
  NonNullable<FeedbackCardProps['type']>
> = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
};

export const actionFeedbackStyles = {
  actionGuide: 'text-sm font-semibold text-gray-800',
  dataSummary: 'text-xs font-normal text-gray-500',
} as const;

// "N명의 멤버" 요약을 누르면 누가 언급했는지 펼쳐 보여줌
function DataSummary({ item }: { item: ActionFeedbackItem }) {
  const [open, setOpen] = useState(false);
  const members = item.relatedMembers ?? [];

  if (members.length === 0) {
    return <p className={actionFeedbackStyles.dataSummary}>{item.dataSummary}</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${actionFeedbackStyles.dataSummary} flex items-center gap-1 hover:text-gray-700 transition-colors`}
        aria-expanded={open}
      >
        <span>{item.dataSummary}</span>
        <span className="text-[10px]">{open ? '▲' : '▼ 멤버 보기'}</span>
      </button>
      {open && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {members.map((m) => (
            <span
              key={m.memberId}
              className="rounded-full bg-white/70 border border-gray-200 px-2 py-0.5 text-xs text-gray-700"
            >
              {m.memberName} <span className="text-gray-400">{m.mentionCount}회</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ActionFeedbackList({ items }: ActionFeedbackListProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <FeedbackCard
          key={`${item.title}-${index}`}
          title={item.title}
          content={
            <div className="space-y-1">
              <p className={actionFeedbackStyles.actionGuide}>{item.actionGuide}</p>
              <DataSummary item={item} />
            </div>
          }
          type={severityToFeedbackType[item.severity]}
        />
      ))}
    </div>
  );
}
