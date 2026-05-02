import FeedbackCard, { type FeedbackCardProps } from './FeedbackCard';

interface FeedbackCardListProps {
  items: FeedbackCardProps[];
}

export default function FeedbackCardList({ items }: FeedbackCardListProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <FeedbackCard key={i} {...item} />
      ))}
    </div>
  );
}
