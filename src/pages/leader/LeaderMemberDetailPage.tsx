import { useMemo, useState } from 'react';
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

interface GroupEntry<T> {
  date: string;
  meetingTitle: string;
  items: T[];
}

function groupByMeeting<T extends { date: string | null; meetingTitle: string }>(items: T[]): GroupEntry<T>[] {
  const map = new Map<string, GroupEntry<T>>();
  for (const it of items) {
    const date = it.date ?? '날짜 미상';
    const key = `${date}__${it.meetingTitle}`;
    if (!map.has(key)) map.set(key, { date, meetingTitle: it.meetingTitle, items: [] });
    map.get(key)!.items.push(it);
  }
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}

function AccordionGroup({ date, meetingTitle, children }: { date: string; meetingTitle: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 py-1 text-left"
      >
        <span className="text-xs font-semibold text-gray-500">{date}</span>
        <span className="text-xs text-gray-400">{meetingTitle}</span>
        <span className="ml-auto text-xs text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="mt-1.5">{children}</div>}
    </div>
  );
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
        const arrow = diff === null ? '' : diff >= 3 ? '↑ 이전보다 좋아짐' : diff <= -3 ? '↓ 이전보다 낮아짐' : '≈ 이전과 비슷';
        const arrowCls = diff === null ? 'text-gray-300'
          : diff >= 3 ? 'text-emerald-600' : diff <= -3 ? 'text-red-500' : 'text-gray-400';
        return (
          <li key={p.round} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{p.round}회차</span>
                <span className="text-xs text-gray-400">{p.date ?? ''}</span>
                {p.meetingTitle && <span className="text-xs text-gray-400">· {p.meetingTitle}</span>}
              </div>
              {arrow && <span className={`text-xs font-medium ${arrowCls}`}>{arrow}</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function PromisesSection({ promises }: { promises: MemberInsightPromise[] }) {
  const grouped = useMemo(() => groupByMeeting(promises), [promises]);
  if (promises.length === 0) {
    return <p className="text-sm text-gray-400">아직 약속이 없습니다.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {grouped.map((g) => (
        <AccordionGroup key={`${g.date}__${g.meetingTitle}`} date={g.date} meetingTitle={g.meetingTitle}>
          <ul className="flex flex-col gap-1.5">
            {g.items.map((p) => (
              <li key={p.promiseId} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-xs font-medium ${p.ownerType === 'LEADER' ? 'text-violet-500' : 'text-teal-500'}`}>
                      {p.ownerType === 'LEADER' ? '리더' : '멤버'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{p.content}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${PROMISE_STATUS[p.status].cls}`}>
                  {PROMISE_STATUS[p.status].label}
                </span>
              </li>
            ))}
          </ul>
        </AccordionGroup>
      ))}
    </div>
  );
}

function ActionPlansSection({
  plans,
  onToggle,
}: {
  plans: MemberInsightActionPlan[];
  onToggle: (planId: number, nextCompleted: boolean) => void;
}) {
  const grouped = useMemo(() => groupByMeeting(plans), [plans]);
  if (plans.length === 0) {
    return <p className="text-sm text-gray-400">아직 액션 플랜이 없습니다.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {grouped.map((g) => (
        <AccordionGroup key={`${g.date}__${g.meetingTitle}`} date={g.date} meetingTitle={g.meetingTitle}>
          <ul className="flex flex-col gap-1.5">
            {g.items.map((a) => (
              <li key={a.planId}>
                <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={a.isCompleted}
                    onChange={(e) => onToggle(a.planId, e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-emerald-500"
                  />
                  <span className={`text-sm leading-snug ${a.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {a.content}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </AccordionGroup>
      ))}
    </div>
  );
}

export default function LeaderMemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { data: career, loading: careerLoading, errors: careerErrors } = useCareerDashboard(memberId);
  const { data: insight, loading: insightLoading, error: insightError, toggleActionPlan } = useMemberInsight(memberId);

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
            <SectionCard title="회차별 소통 참여도" desc="멤버가 미팅에서 고민·의견·제안을 얼마나 자유롭게 꺼냈는지를 회차별로 보여줍니다.">
              <TrendSection points={insight.statusTrend} />
            </SectionCard>
            <SectionCard title="약속" desc="날짜별 약속과 이행 상태입니다.">
              <PromisesSection promises={insight.promises} />
            </SectionCard>
            <SectionCard title="누적 액션 플랜" desc="미팅마다 정한 다음 액션입니다. 체크박스로 이행/미이행을 표시하면 '나의 리더십 성장'의 코칭 실행률에 반영됩니다.">
              <ActionPlansSection plans={insight.actionPlans} onToggle={toggleActionPlan} />
            </SectionCard>
          </>
        ) : null}
      </div>
    </PageLayout>
  );
}
