import { PieChart, Pie, Cell } from 'recharts';
import Badge from '@/components/ui/Badge';
import type { Gaps } from '@/types/report';

const EMPTY_COLOR = '#f3f4f6';

const riskBorderColors: Record<string, string> = {
  DANGER: 'border-red-300',
  WARNING: 'border-orange-300',
  CAUTION: 'border-yellow-300',
  SAFE: 'border-gray-200',
};

const riskDonutColors: Record<string, string> = {
  DANGER: '#ef4444',
  WARNING: '#f97316',
  CAUTION: '#eab308',
  SAFE: '#22c55e',
};

const riskBadgeColors: Record<string, 'red' | 'orange' | 'yellow' | 'green'> = {
  DANGER: 'red',
  WARNING: 'orange',
  CAUTION: 'yellow',
  SAFE: 'green',
};

const riskBadgeLabels: Record<string, string> = {
  DANGER: 'Danger',
  WARNING: 'Warning',
  CAUTION: 'Caution',
  SAFE: 'Safe',
};

const directionLabels: Record<string, string> = {
  OVERREPORT: 'Overreporting',
  UNDERREPORT: 'Underreporting',
  ALIGNED: 'Aligned',
};

interface GapDonutProps {
  ratio: number;
  fillColor: string;
  centerLabel: string;
  subLabel?: string;
}

function GapDonut({ ratio, fillColor, centerLabel, subLabel }: GapDonutProps) {
  const clamped = Math.max(0, Math.min(1, ratio));
  return (
    <div className="relative w-[120px] h-[120px] mx-auto">
      <PieChart width={120} height={120}>
        <Pie
          data={[{ value: clamped }, { value: 1 - clamped }]}
          cx={60}
          cy={60}
          innerRadius={40}
          outerRadius={52}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill={fillColor} />
          <Cell fill={EMPTY_COLOR} />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900 leading-none">{centerLabel}</span>
        {subLabel && <span className="text-xs text-gray-400 mt-0.5">{subLabel}</span>}
      </div>
    </div>
  );
}

interface Props {
  data: Gaps;
}

export default function GapsSection({ data }: Props) {
  const { alignmentGap, honestyGap, executionGap } = data;

  const honestyBorder = riskBorderColors[honestyGap.riskLevel] ?? 'border-gray-200';
  const honestyDonutColor = riskDonutColors[honestyGap.riskLevel] ?? '#22c55e';

  const executionRatio =
    executionGap.totalPromises === 0
      ? 0
      : executionGap.fulfilled / executionGap.totalPromises;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Gap Analysis
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

        {/* Alignment Gap */}
        <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Alignment Gap
          </p>
          <GapDonut
            ratio={alignmentGap.score / 100}
            fillColor="#5F74FA"
            centerLabel={String(alignmentGap.score)}
            subLabel="/100"
          />
          <p className="text-xs text-gray-500 leading-relaxed">{alignmentGap.detail}</p>
        </div>

        {/* Honesty Gap */}
        <div className={`rounded-xl border p-4 flex flex-col gap-3 ${honestyBorder}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Honesty Gap
            </p>
            <Badge
              label={riskBadgeLabels[honestyGap.riskLevel] ?? honestyGap.riskLevel}
              color={riskBadgeColors[honestyGap.riskLevel] ?? 'gray'}
            />
          </div>
          <GapDonut
            ratio={Math.min(honestyGap.gap, 100) / 100}
            fillColor={honestyDonutColor}
            centerLabel={String(honestyGap.gap)}
            subLabel="pt gap"
          />
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Survey Score</span>
              <span className="font-medium text-gray-700">{honestyGap.surveyScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Safety Score</span>
              <span className="font-medium text-gray-700">{honestyGap.safetyScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Direction</span>
              <span
                className={`font-medium ${
                  honestyGap.direction === 'OVERREPORT' ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                {directionLabels[honestyGap.direction]}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Gap */}
        <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Execution Gap
          </p>
          <GapDonut
            ratio={executionRatio}
            fillColor={executionGap.totalPromises === 0 ? '#d1d5db' : '#22c55e'}
            centerLabel={String(executionGap.score)}
            subLabel="/100"
          />
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Fulfilled</span>
              <span className="font-medium text-green-600">{executionGap.fulfilled} done</span>
            </div>
            <div className="flex justify-between">
              <span>Missed</span>
              <span className="font-bold text-red-500">{executionGap.missed} missed</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
