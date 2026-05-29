import { useMemo, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ScatterRadar from '@/components/charts/ScatterRadar';
import BlockerPyramid from '@/components/charts/BlockerPyramid';
import ActionFeedbackList from '@/components/feedback/ActionFeedbackList';
import TeamHealthScoreCard from '@/components/feedback/TeamHealthScoreCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useRadarData } from '@/features/leader/useRadarData';
import { useBlockerPyramid } from '@/features/leader/useBlockerPyramid';
import { useTeamHealthScore } from '@/features/leader/useTeamHealthScore';
import { useAuthStore } from '@/stores/authStore';
import type { CommunicationBalance } from '@/types/analysis';

// ── Talk Ratio Bar ─────────────────────────────────────────────────────────────

function TalkRatioBar({
  memberRatio,
}: {
  memberRatio: number;
}) {
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-teal-400 transition-all"
        style={{ width: `${memberRatio}%` }}
      />
    </div>
  );
}

// ── Communication Balance Row ─────────────────────────────────────────────────

function CommRow({ item }: { item: CommunicationBalance }) {
  const badgeColor =
    item.status === '위험' ? 'red' : item.status === '관찰' ? 'yellow' : 'green';

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm text-gray-600 w-10 flex-shrink-0">{item.name}</span>
      <div className="flex-1 min-w-0">
        <TalkRatioBar memberRatio={item.memberRatio} />
      </div>
      <Badge label={item.status} color={badgeColor} />
    </div>
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

type ChartTab = 'radar' | 'blocker';

export default function LeaderDashboard() {
  const teamId = useAuthStore((state) => state.user?.teamId);
  const {
    data: radarData,
    comms,
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
  const [activeTab, setActiveTab] = useState<ChartTab>('radar');
  const radarItems = radarData ?? [];
  const communicationItems = comms ?? [];
  const blockerKeywords = blockerPyramid?.blockerKeywords ?? [];
  const actionFeedbackItems = useMemo(() => {
    return blockerPyramid?.actionPrescriptions ?? [];
  }, [blockerPyramid]);

  return (
    <PageLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-5">팀 인사이트 대시보드</h1>

        {teamHealthLoading && (
          <Card className="mb-5 p-5">
            <p className="text-sm font-medium text-gray-500">Team Health Score를 불러오는 중입니다.</p>
          </Card>
        )}
        {!teamHealthLoading && teamHealthError && (
          <Card className="mb-5 p-5">
            <p className="text-sm font-medium text-gray-400">{teamHealthError}</p>
          </Card>
        )}
        {!teamHealthLoading && teamHealthScore && <TeamHealthScoreCard data={teamHealthScore} />}
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
                      <span className="text-sm font-medium text-gray-400">{radarError}</span>
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
                    <span className="text-sm font-medium text-gray-400">{blockerError}</span>
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
              <p className="text-sm font-medium text-gray-400">{blockerError}</p>
            )}
            {!blockerLoading && !blockerError && actionFeedbackItems.length > 0 && (
              <ActionFeedbackList items={actionFeedbackItems} />
            )}
            {!blockerLoading && !blockerError && actionFeedbackItems.length === 0 && (
              <EmptyState message="아직 제안할 Action Feedback이 없습니다." />
            )}
          </Card>
          </div>

          {/* Right: Communication Balance */}
          <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">
            {/* Communication Balance */}
            <Card className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                1on1 소통 균형
              </p>
              <div className="flex flex-col">
                {communicationItems.length > 0 ? (
                  communicationItems.map((item) => (
                    <CommRow key={item.memberId} item={item} />
                  ))
                ) : (
                  <p className="py-4 text-sm font-medium text-gray-400">아직 1on1 소통 균형 데이터가 없습니다.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
