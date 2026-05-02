export interface FeedbackCardProps {
  title: string;
  content: string;
  type?: 'positive' | 'negative' | 'neutral';
}

export function FeedbackCard({ title, content, type = 'neutral' }: FeedbackCardProps) {
  const colors = {
    positive: 'border-green-200 bg-green-50',
    negative: 'border-red-200 bg-red-50',
    neutral: 'border-gray-200 bg-gray-50',
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[type]}`}>
      <h4 className="text-sm font-medium text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
}

export default FeedbackCard;
