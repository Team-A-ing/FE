import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useLeaderGrowth } from '@/features/leader/useLeaderGrowth';
import type { MonthlyTrendPoint } from '@/types/leaderGrowth';

const RECOMMENDED_LEADER_RATIO = 40;

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  return `${year.slice(2)}.${m}`;
}

function ratioBarColor(value: number) {
  if (value >= 70) return 'bg-red-400';
  if (value >= 50) return 'bg-amber-400';
  return 'bg-teal-400';
}

// ── 월별 추이 바 차트 (공용) ───────────────────────────────────────────────

function TrendRows({
  points,
  unit,
  colorOf,
}: {
  points: MonthlyTrendPoint[];
  unit: string;
  colorOf: (value: number) => string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {points.map((p) => (
        <div key={p.month} className="flex items-center gap-3">
          <span className="w-12 flex-shrink-0 text-xs font-medium text-gray-500">
            {formatMonth(p.month)}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${colorOf(p.value)}`}
              style={{ width: `${Math.min(p.value, 100)}%` }}
            />
          </div>
          <span className="w-14 flex-shrink-0 text-right text-sm font-semibold text-gray-800">
            {p.value}
            {unit}
          </span>
          <span className="w-10 flex-shrink-0 text-right text-[11px] text-gray-400">
            {p.meetingCount}회
          </span>
        </div>
      ))}
    </div>
  );
}

function TrendEmpty({ message }: { message: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center">
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
}

// ── 페이지 ─────────────────────────────────────────────────────────────────

export default function LeaderGrowthPage() {
  const { data, loading, error } = useLeaderGrowth();

  return (
    <PageLayout>
      <div className="mx-auto max-w-[960px] p-6">
        <h1 className="text-xl font-bold text-gray-900">나의 리더십 성장</h1>
        <p className="mt-1 text-sm text-gray-500">
          최근 6개월간 1on1 미팅에서 실제로 관찰된 기록으로 집계한 변화입니다.
        </p>

        {loading && (
          <div className="mt-5 flex flex-col gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-48 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
            </div>
          </div>
        )}

        {!loading && error && (
          <Card className="mt-5 p-5">
            <p className="text-sm font-medium text-gray-400">{error}</p>
          </Card>
        )}

        {!loading && !error && data && (
          <div className="mt-5 flex flex-col gap-4">
            {/* 하이라이트 */}
            {data.highlights.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.highlights.map((h) => (
                  <Card key={h} className="p-4">
                    <p className="text-sm font-semibold leading-relaxed text-gray-800">{h}</p>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              {/* 발화 비율 추이 */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  내 발화 비율 추이
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  월별 평균 리더 발화 비율 — 권장 {RECOMMENDED_LEADER_RATIO}% 이하
                </p>
                <div className="mt-4">
                  {data.talkRatioTrend.length > 0 ? (
                    <TrendRows
                      points={data.talkRatioTrend}
                      unit="%"
                      colorOf={ratioBarColor}
                    />
                  ) : (
                    <TrendEmpty message="아직 발화 비율이 측정된 미팅이 없습니다." />
                  )}
                </div>
              </Card>

              {/* 팀 안전감 신호 추이 */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  팀 안전감 신호 추이
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  내가 진행한 1on1에서 관찰된 팀원들의 솔직한 발화 신호 (월별 평균)
                </p>
                <div className="mt-4">
                  {data.teamSafetyTrend.length > 0 ? (
                    <TrendRows
                      points={data.teamSafetyTrend}
                      unit="점"
                      colorOf={() => 'bg-indigo-400'}
                    />
                  ) : (
                    <TrendEmpty message="아직 분석 완료된 미팅이 없습니다." />
                  )}
                </div>
              </Card>
            </div>

            {/* 약속 이행 통계 */}
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                내 약속 이행
              </p>
              <p className="mt-1 text-xs text-gray-400">
                1on1에서 팀원에게 약속한 항목의 이행 현황 — 약속을 지키는 리더가 솔직한 대화를 만듭니다.
              </p>
              {data.promiseStats.total > 0 ? (
                <div className="mt-4 flex items-end gap-8">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(data.promiseStats.doneRate)}%
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">이행률</p>
                  </div>
                  <div className="flex gap-6 pb-1">
                    <div>
                      <p className="text-lg font-semibold text-teal-600">{data.promiseStats.done}</p>
                      <p className="text-xs text-gray-400">이행</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">{data.promiseStats.pending}</p>
                      <p className="text-xs text-gray-400">대기</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-red-500">{data.promiseStats.missed}</p>
                      <p className="text-xs text-gray-400">미이행</p>
                    </div>
                  </div>
                </div>
              ) : (
                <TrendEmpty message="아직 등록한 약속이 없습니다." />
              )}
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
