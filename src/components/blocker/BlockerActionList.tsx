import Card from '@/components/ui/Card';
import type { BlockerCloudColor } from '@/types/blocker';

export interface BlockerActionFeedbackItem {
  title: string;
  content: string;
  type?: 'positive' | 'negative' | 'neutral';
  accent?: BlockerCloudColor;
}

function BlockerActionCard({ title, content, accent }: BlockerActionFeedbackItem) {
  return (
    <Card
      className="p-4 shadow-none"
      style={accent ? { backgroundColor: accent.bg, borderColor: accent.border } : undefined}
    >
      <h4
        className="mb-1 text-sm font-semibold"
        style={accent ? { color: accent.text } : undefined}
      >
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-gray-600">{content}</p>
    </Card>
  );
}

interface BlockerActionListProps {
  items: BlockerActionFeedbackItem[];
}

export default function BlockerActionList({ items }: BlockerActionListProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <BlockerActionCard key={`${item.title}-${index}`} {...item} />
      ))}
    </div>
  );
}
