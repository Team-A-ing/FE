import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ScatterRadar, { getQuadrant, QUADRANT_LABELS } from '@/components/charts/ScatterRadar';
import BlockerPyramid from '@/components/charts/BlockerPyramid';
import ActionFeedbackList from '@/components/feedback/ActionFeedbackList';
import TeamHealthScoreCard from '@/components/feedback/TeamHealthScoreCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useRadarData } from '@/features/leader/useRadarData';
import { useBlockerPyramid } from '@/features/leader/useBlockerPyramid';
import { useTeamHealthScore } from '@/features/leader/useTeamHealthScore';
import PromiseSummaryCard from '@/components/report/PromiseSummaryCard';
import { usePromiseSummary } from '@/features/leader/usePromiseSummary';
import { usePromiseReminders } from '@/features/leader/usePromiseReminders';
import { useAuthStore } from '@/stores/authStore';
import TeamCoachingCard from '@/components/feedback/TeamCoachingCard';
import { useTeamCoaching } from '@/features/leader/useTeamCoaching';
import { ROUTES } from '@/constants/routes';
import type { RadarDataPoint, RadarQuadrant } from '@/types/analysis';

// ── Team Member Status Row ─────────────────────────────────────────────────────
// 레이더와 동일한 점수(safetyScore)·사분면 기준(45)을 바 형태로 표시

const QUADRANT_BADGE_COLOR: Record<RadarQuadrant, 'red' | 'yellow' | 'green' | 'gray'> = {
  STABLE: 'green',
  SILENT_RISK: 'yellow',
  EXPLICIT_RISK: 'red',
  CONSERVATIVE: 'gray',
};

const QUADRANT_BAR_COLOR: Record<RadarQuadrant, string> = {
  STABLE: 'bg-teal-400',
  SILENT_RISK: 'bg-amber-400',
  EXPLICIT_RISK: 'bg-red-400',
  CONSERVATIVE: 'bg-indigo-400',
};

function MemberStatusRow({ item }: { item: RadarDataPoint }) {
  const quadrant = getQuadrant(item);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm text-gray-600 w-10 flex-shrink-0">{item.memberName}</span>
      <div className="flex-1 min-w-0">
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${QUADRANT_BAR_COLOR[quadrant]}`}
            style={{ width: `${Math.min(100, Math.max(0, item.safetyScore))}%` }}
          />
        </div>
      </div>
      <span className="w-7 flex-shrink-0 text-right text-xs font-semibold text-gray-700">
        {Math.round(item.safetyScore)}
      </span>
      <Badge label={QUADRANT_LABELS[quadrant]} color={QUADRANT_BADGE_COLOR[quadrant]} />
    </div>
  );
}

// ── Promise Reminder Banner ────────────────────────────────────────────────────

function PromiseReminderBanner() {
  const { data, loading } = usePromiseReminders();
  if (loading || !data) return null;
  const { overdue, dueSoon } = data;
  if (overdue.length === 0 && dueSoon.length === 0) return null;

  return (
    <Card className="mb-5 border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-amber-900">
          약속 리마인더
          {overdue.length > 0 && ` — 기한 초과 ${overdue.length}건`}
          {dueSoon.length > 0 && ` · 마감 임박 ${dueSoon.length}건`}
        </p>
        <span className="flex-shrink-0 text-xs text-amber-700">
          미이행 약속은 다음 미팅 브리핑에 자동 반영됩니다
        </span>
      </div>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {overdue.map((item) => (
          <li key={item.promiseId} className="flex items-center gap-2 text-sm">
            <span className="flex-shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[11px] font-semibold text-red-600">
              {-item.daysLeft}일 지남
            </span>
            <span className="truncate text-gray-800">{item.content}</span>
            <span className="flex-shrink-0 text-xs text-gray-400">
              {item.memberName} · {item.dueDate}
            </span>
          </li>
        ))}
        {dueSoon.map((item) => (
          <li key={item.promiseId} className="flex items-center gap-2 text-sm">
            <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
              D-{item.daysLeft}
            </span>
            <span className="truncate text-gray-800">{item.content}</span>
            <span className="flex-shrink-0 text-xs text-gray-400">
              {item.memberName} · {item.dueDate}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center py-4">
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
}

function ErrorState({ label }: { label: string }) {
  return (
    <p className="text-sm font-medium text-gray-400">
      {label} 데이터를 불러오지 못했습니다.
    </p>
  );
}

type ChartTab = 'radar' | 'blocker';

export default function LeaderDashboard() {
  const navigate = useNavigate();
  const teamId = useAuthStore((state) => state.user?.teamId);
  const {
    data: radarData,
    loading: radarLoading,
    error: radarError,
  } = useRadarData(teamId);
  const {
    data: blockerPyramid,
    loading: blockerLoading,
    error: blockerError,
  } = useBlockerPyramid(teamId);
  const {
    data: teamHealthScore,
    loading: teamHealthLoading,
    error: teamHealthError,
  } = useTeamHealthScore(teamId);
  const {
    data: promiseSummary,
    loading: promisesLoading,
    error: promisesError,
    complete: completePromise,
  } = usePromiseSummary(teamId);
  const {
    data: coachingData,
    loading: coachingLoading,
    error: coachingError,
  } = useTeamCoaching(teamId);
  const [activeTab, setActiveTab] = useState<ChartTab>('radar');
  const radarItems = radarData ?? [];
  // 낮은 점수(위험) 우선 정렬
  const memberStatusItems = [...radarItems].sort((a, b) => a.safetyScore - b.safetyScore);
  const blockerKeywords = blockerPyramid?.blockerKeywords ?? [];
  const actionFeedbackItems = useMemo(() => {
    return blockerPyramid?.actionPrescriptions ?? [];
  }, [blockerPyramid]);

  return (
    <PageLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-5">팀 인사이트 대시보드</h1>

        <PromiseReminderBanner />

        {teamHealthLoading && (
          <Card className="mb-5 p-5">
            <p className="text-sm font-medium text-gray-500">Team Health Score를 불러오는 중입니다.</p>
          </Card>
        )}
        {!teamHealthLoading && teamHealthError && (
          <Card className="mb-5 p-5">
            <ErrorState label="Team Health Score" />
          </Card>
        )}
        {!teamHealthLoading && teamHealthScore && (
          <TeamHealthScoreCard
            data={teamHealthScore}
            coachingSlot={
              coachingLoading ? (
                <p className="text-sm font-medium text-gray-500">팀 코칭 데이터를 불러오는 중입니다.</p>
              ) : coachingError ? (
                <ErrorState label="팀 코칭" />
              ) : coachingData ? (
                <TeamCoachingCard data={coachingData} variant="inline" />
              ) : (
                <p className="text-sm font-medium text-gray-400">아직 팀 코칭 데이터가 없습니다.</p>
              )
            }
          />
        )}
        {!teamHealthLoading && !teamHealthError && !teamHealthScore && (
          <Card className="mb-5 p-5">
            <p className="text-sm font-medium text-gray-400">아직 Team Health Score를 계산할 데이터가 없습니다.</p>
          </Card>
        )}

        {/* ── Main Content Row ── */}
        <div className="flex gap-4">
          <div className="flex flex-1 min-w-0 flex-col gap-4">
          {/* Chart Card */}
          <Card className="p-4">
            {/* Tab switcher */}
            <div className="flex gap-0 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  activeTab === 'radar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('radar')}
              >
                Team Member Rader
              </button>
              <button
                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  activeTab === 'blocker'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('blocker')}
              >
                Blocker Pyramid
              </button>
            </div>

            {activeTab === 'radar' && (
              <>
                {/* Member filter dropdown (UI only) */}
                <div className="mb-3">
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    <option>전체 멤버 보기</option>
                  </select>
                </div>

                {/* Scatter Chart */}
                <div style={{ height: 300 }}>
                  {radarLoading && (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm font-medium text-gray-400">Team Member Radar를 불러오는 중입니다.</span>
                    </div>
                  )}
                  {!radarLoading && radarError && (
                    <div className="flex h-full items-center justify-center">
                      <ErrorState label="Team Member Radar" />
                    </div>
                  )}
                  {!radarLoading && !radarError && radarItems.length > 0 && (
                    <ScatterRadar
                      data={radarItems}
                      onMemberClick={(id) => console.log('clicked', id)}
                    />
                  )}
                  {!radarLoading && !radarError && radarItems.length === 0 && (
                    <EmptyState message="아직 표시할 팀원 분석 데이터가 없습니다." />
                  )}
                </div>
              </>
            )}

            {activeTab === 'blocker' && (
              <div className="flex flex-col gap-5">
                {blockerLoading && (
                  <div className="flex min-h-[220px] items-center justify-center py-4">
                    <span className="text-sm font-medium text-gray-400">Blocker Pyramid를 불러오는 중입니다.</span>
                  </div>
                )}
                {!blockerLoading && blockerError && (
                  <div className="flex min-h-[220px] items-center justify-center py-4">
                    <ErrorState label="Blocker Pyramid" />
                  </div>
                )}
                {!blockerLoading && !blockerError && (
                  <div className="py-4">
                    {blockerKeywords.length > 0 ? (
                      <BlockerPyramid
                        items={blockerKeywords}
                      />
                    ) : (
                      <EmptyState message="아직 집계된 블로커 키워드가 없습니다." />
                    )}
                  </div>
                )}
              </div>
              
            )}
          </Card>

          <Card className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Action Feedback
            </p>
            {blockerLoading && (
              <p className="text-sm font-medium text-gray-400">Action Feedback을 불러오는 중입니다.</p>
            )}
            {!blockerLoading && blockerError && (
              <ErrorState label="Action Feedback" />
            )}
            {!blockerLoading && !blockerError && actionFeedbackItems.length > 0 && (
              <ActionFeedbackList items={actionFeedbackItems} />
            )}
            {!blockerLoading && !blockerError && actionFeedbackItems.length === 0 && (
              <EmptyState message="아직 제안할 Action Feedback이 없습니다." />
            )}
          </Card>
          </div>

          {/* Right: Team Member Status */}
          <div className="w-[360px] flex-shrink-0 flex flex-col gap-4">
            {/* Team Member Status */}
            <Card className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                팀 멤버 상태
              </p>
              <div className="flex flex-col">
                {radarLoading && (
                  <p className="py-4 text-sm font-medium text-gray-400">팀 멤버 상태 데이터를 불러오는 중입니다.</p>
                )}
                {!radarLoading && radarError && (
                  <ErrorState label="팀 멤버 상태" />
                )}
                {!radarLoading && !radarError && memberStatusItems.length > 0 ? (
                  memberStatusItems.map((item) => (
                    <MemberStatusRow key={item.memberId} item={item} />
                  ))
                ) : null}
                {!radarLoading && !radarError && memberStatusItems.length === 0 && (
                  <p className="py-4 text-sm font-medium text-gray-400">아직 팀 멤버 상태 데이터가 없습니다.</p>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                미이행 약속
              </p>
              <PromiseSummaryCard
                data={promiseSummary}
                onComplete={completePromise}
                onViewMember={(memberId) => navigate(ROUTES.LEADER_MEMBER(memberId))}
                loading={promisesLoading}
                error={promisesError}
              />
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
