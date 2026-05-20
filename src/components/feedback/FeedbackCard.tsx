export interface FeedbackCardProps {
  title: string;
  content: string;
  type?: 'error' | 'warning' | 'info' | 'success';
}

export const feedbackCardStyles = {
  error: {
    card: 'border-red-200 bg-red-50',
    title: 'text-red-700',
  },
  warning: {
    card: 'border-yellow-200 bg-yellow-50',
    title: 'text-yellow-700',
  },
  info: {
    card: 'border-blue-200 bg-blue-50',
    title: 'text-blue-700',
  },
  success: {
    card: 'border-green-200 bg-green-50',
    title: 'text-green-700',
  },
} as const;

export function FeedbackCard({ title, content, type = 'info' }: FeedbackCardProps) {
  const styles = feedbackCardStyles[type];

  return (
    <div className={`rounded-xl border p-4 ${styles.card}`}>
      <h4 className={`mb-1 text-sm font-medium ${styles.title}`}>{title}</h4>
      <p className="whitespace-pre-line text-sm text-gray-600">{content}</p>
    </div>
  );
}

export default FeedbackCard;
