interface BadgeProps {
  label: string;
  color?: 'red' | 'yellow' | 'orange' | 'green' | 'gray';
}

export default function Badge({ label, color = 'gray' }: BadgeProps) {
  const colors = {
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
}
