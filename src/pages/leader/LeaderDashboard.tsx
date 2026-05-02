import { useState, useRef } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ScatterRadar from '@/components/charts/ScatterRadar';
import BlockerCloud from '@/components/charts/BlockerCloud';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useRadarData } from '@/features/leader/useRadarData';
import { useBlockerData } from '@/features/leader/useBlockerData';
import type { ActionItem, CommunicationBalance } from '@/types/analysis';

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  extra?: React.ReactNode;
}

function KpiCard({ title, value, sub, extra }: KpiCardProps) {
  return (
    <Card className="p-4 flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-2 font-medium">{title}</p>
      <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      {extra && <div className="mt-2">{extra}</div>}
    </Card>
  );
}

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

// ── Action Priority Dot ───────────────────────────────────────────────────────

const priorityColor: Record<ActionItem['priority'], string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-green-400',
};

function ActionRow({ item }: { item: ActionItem }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityColor[item.priority]}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

type ChartTab = 'radar' | 'blocker';

export default function LeaderDashboard() {
  const { data: radarData, stats, actions, comms, loading } = useRadarData('team-1');
  const { words } = useBlockerData('team-1');
  const [activeTab, setActiveTab] = useState<ChartTab>('radar');
  const [riskThreshold, setRiskThreshold] = useState(0.5);
  // 입력 필드용 별도 문자열 state (편집 중엔 자유롭게, blur 시 확정)
  const [riskInputValue, setRiskInputValue] = useState('0.5');
  const riskInputRef = useRef<HTMLInputElement>(null);

  // 0.1 단위로 내림 처리
  const applyRiskInput = (raw: string) => {
    const num = parseFloat(raw);
    if (isNaN(num)) {
      setRiskInputValue(riskThreshold.toFixed(1));
      return;
    }
    const clamped = Math.min(1, Math.max(0, num));
    const floored = Math.floor(clamped * 10) / 10;
    setRiskThreshold(floored);
    setRiskInputValue(floored.toFixed(1));
  };

  // Derived delta display
  const motivationDelta = stats?.motivationDelta ?? 0;
  const turnoverDelta = stats?.turnoverRiskDelta ?? 0;

  return (
    <PageLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-5">팀 대시보드</h1>

        {/* ── KPI Row ── */}
        <div className="flex gap-3 mb-5">
          {/* 팀 동기 지수 */}
          <KpiCard
            title="팀 동기 지수"
            value={
              <span>
                <span className="text-blue-500">{stats?.motivationIndex ?? '--'}</span>
                <span className="text-base font-normal text-gray-400">/100</span>
              </span>
            }
            sub={
              stats ? (
                <span className={motivationDelta >= 0 ? 'text-teal-500' : 'text-red-400'}>
                  전분기 대비 {motivationDelta >= 0 ? '+' : ''}{motivationDelta}{' '}
                  {motivationDelta >= 0 ? '▲' : '▼'}
                </span>
              ) : undefined
            }
          />

          {/* 이탈 리스크 인원 */}
          <KpiCard
            title="이탈 리스크 인원"
            value={
              <span>
                <span className="text-red-500">{stats?.turnoverRiskCount ?? '--'}</span>
                <span className="text-base font-normal text-gray-500">명</span>
              </span>
            }
            sub={
              stats ? (
                <span className={turnoverDelta <= 0 ? 'text-teal-500' : 'text-red-400'}>
                  전분기 대비 {turnoverDelta > 0 ? '+' : ''}{turnoverDelta}{' '}
                  {turnoverDelta <= 0 ? '▼' : '▲'}
                </span>
              ) : undefined
            }
          />

          {/* 1on1 완료율 */}
          <KpiCard
            title="1on1 완료율"
            value={
              <span className="text-teal-500">
                {stats?.meetingCompletionRate ?? '--'}%
              </span>
            }
            sub="이번 달 기준"
          />

          {/* 액션 이행률 */}
          <KpiCard
            title="액션 이행률"
            value={
              <span className="text-orange-400">
                {stats?.actionCompletionRate ?? '--'}%
              </span>
            }
            sub="이번 달 기준"
          />

          {/* 팀 평균 발화 비율 */}
          <KpiCard
            title="팀 평균 발화 비율"
            value={
              loading ? (
                <span className="text-gray-300">--</span>
              ) : (
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-6">팀원</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full"
                        style={{ width: `${stats?.memberTalkRatio ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-7 text-right">
                      {stats?.memberTalkRatio}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-6">리더</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-300 rounded-full"
                        style={{ width: `${stats?.leaderTalkRatio ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-7 text-right">
                      {stats?.leaderTalkRatio}%
                    </span>
                  </div>
                  <p className="text-xs text-teal-500 mt-0.5">팀 발화 비율 적정</p>
                </div>
              )
            }
          />
        </div>

        {/* ── Main Content Row ── */}
        <div className="flex gap-4">
          {/* Left: Chart Card */}
          <Card className="flex-1 min-w-0 p-4">
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
                Blocker Map
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
                <div style={{ height: 380 }}>
                  <ScatterRadar
                    data={radarData}
                    riskThreshold={riskThreshold}
                    onMemberClick={(id) => console.log('clicked', id)}
                  />
                </div>

                {/* Risk sensitivity slider */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex-shrink-0">리스크 민감도</span>
                  <div className="flex-1 relative h-1.5 bg-gradient-to-r from-red-300 to-red-100 rounded-full">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={riskThreshold}
                      onChange={(e) => {
                        const v = Math.floor(Number(e.target.value) * 10) / 10;
                        setRiskThreshold(v);
                        setRiskInputValue(v.toFixed(1));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ touchAction: 'none' }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-red-400 rounded-full shadow pointer-events-none"
                      style={{ left: `calc(${riskThreshold * 100}% - 6px)` }}
                    />
                  </div>
                  {/* 직접 입력 가능한 숫자 필드 */}
                  <input
                    ref={riskInputRef}
                    type="text"
                    inputMode="decimal"
                    value={riskInputValue}
                    onChange={(e) => setRiskInputValue(e.target.value)}
                    onBlur={(e) => applyRiskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyRiskInput(riskInputValue);
                        riskInputRef.current?.blur();
                      }
                    }}
                    className="w-10 text-xs text-center text-gray-700 border border-gray-200 rounded-md py-0.5 focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-200"
                  />
                </div>
              </>
            )}

            {activeTab === 'blocker' && (
              <div style={{ height: 460 }}>
                <BlockerCloud words={words} />
              </div>
            )}
          </Card>

          {/* Right: Action Items + Communication Balance */}
          <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">
            {/* Action Items */}
            <Card className="p-4 flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                리더 우선 액션 아이템
              </p>
              <div className="flex flex-col gap-2">
                {actions.map((item) => (
                  <ActionRow key={item.id} item={item} />
                ))}
              </div>
            </Card>

            {/* Communication Balance */}
            <Card className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                1on1 소통 균형
              </p>
              <div className="flex flex-col">
                {comms.map((item) => (
                  <CommRow key={item.memberId} item={item} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
