import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import CareerProfileCard from '@/components/career/CareerProfileCard';
import CareerTimelineSection from '@/components/career/CareerTimelineSection';
import ShowcaseSection from '@/components/career/ShowcaseSection';
import { useCareerDashboard } from '@/features/member/useCareerDashboard';
import { useMemberInsight } from '@/features/leader/useMemberInsight';
import type {
  MemberInsightActionPlan,
  MemberInsightPromise,
  MemberInsightPromiseStatus,
  MemberInsightTrendPoint,
} from '@/types/memberInsight';

const PROMISE_STATUS: Record<MemberInsightPromiseStatus, { label: string; cls: string }> = {
  DONE: { label: '이행', cls: 'bg-emerald-50 text-emerald-600' },
  PENDING: { label: '미이행', cls: 'bg-gray-100 text-gray-500' },
  OVERDUE: { label: '연체', cls: 'bg-red-50 text-red-500' },
};

const LEVEL_CLS: Record<string, string> = {
  좋음: 'bg-emerald-50 text-emerald-600',
  보통: 'bg-gray-100 text-gray-600',
  낮음: 'bg-red-50 text-red-500',
};

function groupByDate<T extends { date: string | null }>(items: T[]): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const key = it.date ?? '날짜 미상';
    const arr = map.get(key) ?? [];
    if (!map.has(key)) map.set(key, arr);
    arr.push(it);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function TrendSection({ points }: { points: MemberInsightTrendPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-gray-400">아직 분석된 미팅이 없습니다.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {points.map((p, i) => {
        const prev = i > 0 ? points[i - 1].healthScore : null;
        const diff = prev === null ? null : Math.round((p.healthScore - prev) * 10) / 10;
        const arrow = diff === null ? '' : diff >= 3 ? '↑ 좋아짐' : diff <= -3 ? '↓ 낮아짐' : '≈ 비슷';
        const arrowCls = diff === null ? 'text-gray-300'
          : diff >= 3 ? 'text-emerald-600' : diff <= -3 ? 'text-red-500' : 'text-gray-400';
        return (
          <li key={p.round} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{p.round}회차</span>
              <span className="text-xs text-gray-400">{p.date ?? ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${LEVEL_CLS[p.level] ?? 'bg-gray-100 text-gray-600'}`}>
                {p.level}
              </span>
              <span className={`text-xs font-medium ${arrowCls}`}>{arrow}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PromisesSection({ promises }: { promises: MemberInsightPromise[] }) {
  const grouped = useMemo(() => groupByDate(promises), [promises]);
  if (promises.length === 0) {
    return <p className="text-sm text-gray-400">아직 약속이 없습니다.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {grouped.map(([date, items]) => (
        <div key={date}>
          <p className="mb-1.5 text-xs font-semibold text-gray-400">{date}</p>
          <ul className="flex flex-col gap-1.5">
            {items.map((p) => (
              <li key={p.promiseId} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">{p.content}</p>
                  {p.round > 0 && <p className="mt-0.5 text-xs text-gray-400">{p.round}회차</p>}
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${PROMISE_STATUS[p.status].cls}`}>
                  {PROMISE_STATUS[p.status].label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ActionPlansSection({ plans }: { plans: MemberInsightActionPlan[] }) {
  const grouped = useMemo(() => groupByDate(plans), [plans]);
  if (plans.length === 0) {
    return <p className="text-sm text-gray-400">아직 액션 플랜이 없습니다.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {grouped.map(([date, items]) => (
        <div key={date}>
          <p className="mb-1.5 text-xs font-semibold text-gray-400">{date}</p>
          <ul className="flex flex-col gap-1.5">
            {items.map((a) => (
              <li key={a.planId} className="flex items-start gap-2 rounded-lg border border-gray-100 px-3 py-2">
                <span className={`mt-0.5 flex-shrink-0 text-sm ${a.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}>
                  {a.isCompleted ? '✓' : '○'}
                </span>
                <p className={`text-sm ${a.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {a.content}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function LeaderMemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: career, loading: careerLoading, errors: careerErrors } = useCareerDashboard(memberId);
  const { data: insight, loading: insightLoading, error: insightError } = useMemberInsight(memberId);

  const title = insight?.memberName ?? '멤버 상세';

  return (
    <PageLayout>
      <div className="mx-auto flex max-w-[1120px] flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ← 뒤로
            </button>
            <h1 className="mt-1 text-xl font-bold text-gray-900">
              {title}
              {insight?.jobTitle && (
                <span className="ml-2 text-sm font-normal text-gray-400">{insight.jobTitle}</span>
              )}
            </h1>
          </div>
        </div>

        {/* 커리어 포트폴리오 (멤버 화면 재사용) */}
        {!careerLoading && career.stats && <CareerProfileCard stats={career.stats} />}
        {!careerLoading && !careerErrors.showcase && <ShowcaseSection events={career.showcase} />}
        {!careerLoading && !careerErrors.timeline && <CareerTimelineSection events={career.timeline} />}

        {/* 멤버 상세 (리더 전용) */}
        {insightLoading ? (
          <Card className="p-5">
            <p className="text-sm text-gray-400">멤버 상세 정보를 불러오는 중입니다.</p>
          </Card>
        ) : insightError ? (
          <Card className="p-5">
            <p className="text-sm text-gray-400">{insightError}</p>
          </Card>
        ) : insight ? (
          <>
            <SectionCard title="상태 추세" desc="미팅 회차별 소통 상태 변화입니다.">
              <TrendSection points={insight.statusTrend} />
            </SectionCard>
            <SectionCard title="약속" desc="날짜별 약속과 이행 상태입니다.">
              <PromisesSection promises={insight.promises} />
            </SectionCard>
            <SectionCard title="누적 액션 플랜" desc="미팅마다 정한 다음 액션입니다.">
              <ActionPlansSection plans={insight.actionPlans} />
            </SectionCard>
          </>
        ) : null}
      </div>
    </PageLayout>
  );
}
