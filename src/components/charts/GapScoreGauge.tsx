export interface GapScoreGaugeProps {
  score: number;
  label?: string;
}

export default function GapScoreGauge({ score, label = 'Gap Score' }: GapScoreGaugeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-3xl font-bold text-gray-900">{score}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
