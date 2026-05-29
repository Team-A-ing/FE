import { useState } from 'react';
import Card from '@/components/ui/Card';
import type { TeamHealthScoreData, TeamHealthTrend } from '@/types/teamHealth';

export interface TeamHealthScoreCardProps {
  data: TeamHealthScoreData;
}

const trendMessageStyles: Record<TeamHealthTrend, string> = {
  IMPROVING: 'text-emerald-600',
  STABLE: 'text-gray-500',
  DECLINING: 'text-red-500',
};

const trendLabels: Record<TeamHealthTrend, string> = {
  IMPROVING: '개선',
  STABLE: '안정',
  DECLINING: '감소',
};

const TEAM_HEALTH_BAR_COLOR = '#2dd4bf';

export default function TeamHealthScoreCard({ data }: TeamHealthScoreCardProps) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const score = Math.round(data.teamHealthScore);
  const alerts = data.alerts ?? [];
  const hasAlerts = alerts.length > 0;

  return (
    <Card className="mb-5 p-5">
      <div className="grid gap-5">
        <div className="min-w-0">
          <p className="text-base font-semibold text-gray-700">Team Health Score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold leading-none text-gray-950">
              {score}
            </span>
            <span className="pb-1 text-base font-medium text-gray-400">/100</span>
          </div>
          <div className="mt-3 h-1.5 w-full max-w-[33%] min-w-[180px] overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, score))}%`,
                backgroundColor: TEAM_HEALTH_BAR_COLOR,
              }}
            />
          </div>
          <p className={`mt-3 text-sm font-semibold ${trendMessageStyles[data.trend]}`}>
            현재 추세는 {trendLabels[data.trend]} 상태입니다. 
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setAlertsOpen((open) => !open)}
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700"
            aria-expanded={alertsOpen}
          >
            <span>이상 탐지 알림 {hasAlerts ? alerts.length : 0}건</span>
            <span className="text-xs text-gray-400">{alertsOpen ? '접기' : '펼치기'}</span>
          </button>

          {alertsOpen && (
            <div className="mt-3">
              {hasAlerts ? (
                <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
                  {alerts.map((alert) => (
                    <li key={alert}>
                      {alert}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">
                  표시할 이상 탐지 알림이 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
