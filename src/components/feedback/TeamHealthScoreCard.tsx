import BarChart, { type BarChartDataPoint } from '@/components/charts/BarChart';
import Card from '@/components/ui/Card';
import type { TeamHealthScoreData, TeamHealthTrend } from '@/types/teamHealth';

export interface TeamHealthScoreCardProps {
  data: TeamHealthScoreData;
}

const trendMessageStyles: Record<TeamHealthTrend, string> = {
  IMPROVING: 'text-emerald-600',
  DECLINING: 'text-red-500',
  UNCHANGED: 'text-gray-500',
};

const trendLabels: Record<TeamHealthTrend, string> = {
  IMPROVING: '개선',
  DECLINING: '감소',
  UNCHANGED: '동일',
};

const TEAM_HEALTH_BAR_COLOR = '#2dd4bf';

function formatDiff(diff: number) {
  if (diff > 0) return `+${diff}`;
  return `${diff}`;
}

function formatMonth(yearMonth: string) {
  const [, month] = yearMonth.split('-');
  return month ? `${Number(month)}월` : yearMonth;
}

export default function TeamHealthScoreCard({ data }: TeamHealthScoreCardProps) {
  const chartData: BarChartDataPoint[] = data.history.map((item, index) => ({
    label: formatMonth(item.yearMonth),
    value: item.score,
    color: index === data.history.length - 1 ? TEAM_HEALTH_BAR_COLOR : undefined,
  }));

  return (
    <Card className="mb-5 p-5">
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(320px,460px)] lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-base font-semibold text-gray-700">Team Health Score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold leading-none text-gray-950">
              {data.currentScore}
            </span>
            <span className="pb-1 text-base font-medium text-gray-400">/100</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, data.currentScore))}%`,
                backgroundColor: TEAM_HEALTH_BAR_COLOR,
              }}
            />
          </div>
          <p className={`mt-3 text-sm font-semibold ${trendMessageStyles[data.trend]}`}>
            전월 대비 {formatDiff(data.diff)}점 {trendLabels[data.trend]}
          </p>
        </div>

        <BarChart
          data={chartData}
          barColor={TEAM_HEALTH_BAR_COLOR}
          showBottomBar={false}
          widthClassName="w-full"
        />
      </div>
    </Card>
  );
}
