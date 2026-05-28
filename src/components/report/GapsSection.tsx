import { PieChart, Pie, Cell } from 'recharts';
import Badge from '@/components/ui/Badge';
import type { Gaps } from '@/types/report';

const EMPTY_COLOR = '#f3f4f6';
const ALIGNED_COLOR = '#d1d5db'; // gray-300, inconspicuous shared-score region

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

interface HonestyGapDonutProps {
  surveyScore: number;
  safetyScore: number;
  gap: number;
  riskLevel: string;
}

function HonestyGapDonut({ surveyScore, safetyScore, gap, riskLevel }: HonestyGapDonutProps) {
  const s = Math.max(0, Math.min(100, surveyScore));
  const f = Math.max(0, Math.min(100, safetyScore));
  const aligned = Math.min(s, f) / 100;
  const diff = Math.abs(s - f) / 100;
  const empty = Math.max(0, 1 - aligned - diff);
  const gapColor = riskDonutColors[riskLevel] ?? '#22c55e';
  return (
    <div className="relative w-[120px] h-[120px] mx-auto">
      <PieChart width={120} height={120}>
        <Pie
          data={[{ value: diff }, { value: aligned }, { value: empty }]}
          cx={60}
          cy={60}
          innerRadius={40}
          outerRadius={52}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill={gapColor} />
          <Cell fill={ALIGNED_COLOR} />
          <Cell fill={EMPTY_COLOR} />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900 leading-none">{gap}</span>
        <span className="text-xs text-gray-400 mt-0.5">pt gap</span>
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
          <HonestyGapDonut
            surveyScore={honestyGap.surveyScore}
            safetyScore={honestyGap.safetyScore}
            gap={honestyGap.gap}
            riskLevel={honestyGap.riskLevel}
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
              <span>상태</span>
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
            ratio={executionGap.score / 100}
            fillColor="#22c55e"
            centerLabel={String(executionGap.score)}
            subLabel="/100"
          />
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>이행</span>
              <span className="font-medium text-green-600">{executionGap.fulfilled} 개</span>
            </div>
            <div className="flex justify-between">
              <span>미이행</span>
              <span className="font-bold text-red-500">{executionGap.missed} 개</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
