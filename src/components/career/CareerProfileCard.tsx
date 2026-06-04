import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { CareerStats } from '@/types/career';

interface CareerProfileCardProps {
  stats: CareerStats;
}

function getInitial(name: string) {
  return name.trim().charAt(0) || '멤';
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="min-w-[64px]">
      <p className="text-base font-semibold leading-none text-gray-900">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-gray-400">{label}</p>
    </div>
  );
}

export default function CareerProfileCard({ stats }: CareerProfileCardProps) {
  const displayJobTitle = stats.jobTitle?.trim() || '팀원';
  const displayAiSummary =
    stats.aiSummary?.trim() || `${stats.teamName}팀의 ${displayJobTitle} 입니다.`;

  return (
    <Card className="rounded-lg border-gray-100 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-base font-semibold text-white">
            {getInitial(stats.name)}
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight text-gray-950">{stats.name}</h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              {stats.jobTitle} · {stats.teamName}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-7 gap-y-4">
              <StatItem value={`${stats.totalMeetings}회`} label="총 1on1" />
              <StatItem value={`${stats.achievementCount}건`} label="성취" />
              <StatItem value={`${stats.leaderEndorsementCount}회`} label="리더 공인" />
              <StatItem value={`상위 ${stats.contributionPercentile}%`} label="기여도" />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            className="rounded-lg border border-gray-200 bg-gray-50 text-slate-700 hover:bg-gray-100 print:hidden"
          >
            PDF 저장
          </Button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-sm font-medium leading-6 text-slate-500">"{displayAiSummary}"</p>
      </div>
    </Card>
  );
}
