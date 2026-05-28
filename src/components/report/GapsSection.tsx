import type { Gaps } from '@/types/report';

const riskColors: Record<string, string> = {
  DANGER: 'bg-red-100 text-red-700',
  WARNING: 'bg-yellow-100 text-yellow-700',
  SAFE: 'bg-green-100 text-green-700',
};

const riskLabels: Record<string, string> = {
  DANGER: '위험',
  WARNING: '주의',
  SAFE: '안전',
};

const directionLabels: Record<string, string> = {
  OVERREPORT: '과장 보고',
  UNDERREPORT: '축소 보고',
  ALIGNED: '일치',
};

interface Props {
  data: Gaps;
}

export default function GapsSection({ data }: Props) {
  const { alignmentGap, honestyGap, executionGap } = data;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        갭 분석
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Alignment Gap */}
        <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            정렬 갭
          </p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900">{alignmentGap.score}</span>
            <span className="text-sm text-gray-400 mb-1">/100</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{alignmentGap.detail}</p>
        </div>

        {/* Honesty Gap */}
        <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              정직 갭
            </p>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColors[honestyGap.riskLevel]}`}
            >
              {riskLabels[honestyGap.riskLevel]}
            </span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900">{honestyGap.gap}</span>
            <span className="text-sm text-gray-400 mb-1">점 차이</span>
          </div>
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>설문 점수</span>
              <span className="font-medium text-gray-700">{honestyGap.surveyScore}</span>
            </div>
            <div className="flex justify-between">
              <span>심리적 안전감</span>
              <span className="font-medium text-gray-700">{honestyGap.safetyScore}</span>
            </div>
            <div className="flex justify-between">
              <span>방향</span>
              <span className="font-medium text-gray-700">
                {directionLabels[honestyGap.direction]}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Gap */}
        <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            실행 갭
          </p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900">{executionGap.score}</span>
            <span className="text-sm text-gray-400 mb-1">/100</span>
          </div>
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>이행</span>
              <span className="font-medium text-green-600">{executionGap.fulfilled}건</span>
            </div>
            <div className="flex justify-between">
              <span>미이행</span>
              <span className="font-medium text-red-500">{executionGap.missed}건</span>
            </div>
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-green-400"
              style={{
                width: `${executionGap.totalPromises === 0 ? 0 : (executionGap.fulfilled / executionGap.totalPromises) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

