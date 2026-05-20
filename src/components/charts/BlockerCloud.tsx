interface BlockerWord {
  text: string;
  value: number;
}

export interface BlockerCloudProps {
  words: BlockerWord[];
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6', '#3B82F6', '#EF4444'];

export default function BlockerCloud({ words }: BlockerCloudProps) {
  const sorted = [...words].sort((a, b) => b.value - a.value);
  const max = sorted[0]?.value || 1;

  return (
    <div className="w-full h-full flex flex-wrap items-center justify-center gap-2 p-4 content-center">
      {sorted.map((word, i) => {
        const size = 12 + (word.value / max) * 16;
        return (
          <span
            key={word.text}
            style={{
              fontSize: `${size}px`,
              color: COLORS[i % COLORS.length],
              fontWeight: word.value > max * 0.6 ? 700 : 500,
              lineHeight: 1.4,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
