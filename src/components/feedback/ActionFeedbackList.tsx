import FeedbackCard, { type FeedbackCardProps } from '@/components/feedback/FeedbackCard';

export interface ActionFeedbackItem {
  severity: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  dataSummary: string;
  actionGuide: string;
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
              <p className={actionFeedbackStyles.dataSummary}>{item.dataSummary}</p>
            </div>
          }
          type={severityToFeedbackType[item.severity]}
        />
      ))}
    </div>
  );
}
