import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useLeaderGrowth } from '@/features/leader/useLeaderGrowth';
import type {
  CoachingExecution,
  LeaderPromiseStats,
  MemberCadence,
  MonthlyTrendPoint,
} from '@/types/leaderGrowth';

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
  max = 100,
}: {
  points: MonthlyTrendPoint[];
  unit: string;
  colorOf: (value: number) => string;
  max?: number;
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
              style={{ width: `${Math.min((p.value / max) * 100, 100)}%` }}
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

// ── 멤버별 1on1 주기 ────────────────────────────────────────────────────────

function cadenceStyle(days: number | null) {
  if (days === null) return { label: '아직 1on1 없음', cls: 'bg-red-50 text-red-500' };
  if (days >= 30) return { label: `${days}일 전`, cls: 'bg-red-50 text-red-500' };
  if (days >= 14) return { label: `${days}일 전`, cls: 'bg-amber-50 text-amber-600' };
  return { label: days === 0 ? '오늘' : `${days}일 전`, cls: 'bg-gray-100 text-gray-600' };
}

function CadenceList({ items }: { items: MemberCadence[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((m) => {
        const { label, cls } = cadenceStyle(m.daysSinceLastMeeting);
        return (
          <li key={m.memberId} className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-700">{m.memberName}</span>
            <div className="flex items-center gap-2">
              {m.lastMeetingDate && (
                <span className="text-[11px] text-gray-400">{m.lastMeetingDate}</span>
              )}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
                {label}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CoachingExecutionCard({
  execution,
  promiseStats,
}: {
  execution: CoachingExecution;
  promiseStats: LeaderPromiseStats;
}) {
  const [open, setOpen] = useState<'completed' | 'pending' | null>(null);
  const pending = execution.total - execution.completed;
  const completedItems = execution.completedItems ?? [];
  const pendingItems = execution.pendingItems ?? [];
  const list = open === 'completed' ? completedItems : open === 'pending' ? pendingItems : [];

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">코칭 실행률</p>
      <p className="mt-1 text-xs text-gray-400">미팅 후 제안된 액션 플랜 중 실제로 실행한 비율</p>

      {execution.total > 0 ? (
        <>
          <div className="mt-4 flex items-end gap-8">
            <div>
              <p className="text-3xl font-bold text-gray-900">{Math.round(execution.executionRate)}%</p>
              <p className="mt-0.5 text-xs text-gray-400">실행률</p>
            </div>
            <p className="pb-1 text-sm text-gray-600">
              받은 제안 <span className="font-semibold">{execution.total}건</span>
            </p>
          </div>

          {/* 이행 / 미이행 토글 — 클릭 시 해당 목록 펼침 */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => (v === 'completed' ? null : 'completed'))}
              className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm transition ${
                open === 'completed' ? 'border-teal-300 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold text-teal-600">이행 {execution.completed}건</span>
              <span className="ml-1 text-xs text-gray-400">{open === 'completed' ? '▲' : '▼'}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => (v === 'pending' ? null : 'pending'))}
              className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm transition ${
                open === 'pending' ? 'border-amber-300 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold text-amber-600">미이행 {pending}건</span>
              <span className="ml-1 text-xs text-gray-400">{open === 'pending' ? '▲' : '▼'}</span>
            </button>
          </div>

          {open && (
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {list.length === 0 ? (
                <li className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-center text-xs text-gray-400">
                  {open === 'completed' ? '아직 이행한 액션 플랜이 없습니다.' : '미이행 액션 플랜이 없습니다.'}
                </li>
              ) : (
                list.map((item) => (
                  <li
                    key={item.planId}
                    className="flex items-start gap-2 rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <span
                      className={`mt-0.5 flex-shrink-0 text-sm ${
                        open === 'completed' ? 'text-teal-500' : 'text-gray-300'
                      }`}
                    >
                      {open === 'completed' ? '✓' : '○'}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm leading-snug ${open === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {item.content}
                      </p>
                      {item.memberName && <p className="text-[11px] text-gray-400">{item.memberName}</p>}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </>
      ) : (
        <TrendEmpty message="아직 제안된 액션 플랜이 없습니다." />
      )}

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="mb-2.5 text-xs font-semibold text-gray-500">내 약속 이행</p>
        {promiseStats.total > 0 ? (
          <div className="flex items-center gap-6">
            <p className="text-xl font-bold text-gray-900">
              {Math.round(promiseStats.doneRate)}%
              <span className="ml-1 text-xs font-normal text-gray-400">이행률</span>
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-teal-600">이행 {promiseStats.done}</span>
              <span className="text-gray-500">대기 {promiseStats.pending}</span>
              <span className="text-red-500">미이행 {promiseStats.missed}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">아직 등록한 약속이 없습니다.</p>
        )}
      </div>
    </Card>
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
            {/* 핵심 인사이트: 리더 행동 변화 → 팀 신호 변화 */}
            {data.keyInsight && (
              <Card className="border border-teal-200 bg-teal-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  나의 변화가 만든 팀의 변화
                </p>
                <p className="mt-2 text-base font-semibold leading-relaxed text-gray-900">
                  {data.keyInsight}
                </p>
              </Card>
            )}

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

              {/* 1on1 운영 규칙성 */}
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  1on1 운영 규칙성
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  월별 진행한 1on1 횟수 — 꾸준함이 신뢰의 기본입니다
                </p>
                <div className="mt-4">
                  {data.monthlyMeetings.length > 0 ? (
                    <TrendRows
                      points={data.monthlyMeetings}
                      unit="건"
                      colorOf={() => 'bg-sky-400'}
                      max={Math.max(...data.monthlyMeetings.map((p) => p.value), 1)}
                    />
                  ) : (
                    <TrendEmpty message="최근 6개월간 진행한 1on1이 없습니다." />
                  )}
                </div>
                {data.memberCadence.length > 0 && (
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="mb-2.5 text-xs font-semibold text-gray-500">
                      멤버별 마지막 1on1
                    </p>
                    <CadenceList items={data.memberCadence} />
                  </div>
                )}
              </Card>

              {/* 코칭 실행률 */}
              <CoachingExecutionCard
                execution={data.coachingExecution}
                promiseStats={data.promiseStats}
              />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
