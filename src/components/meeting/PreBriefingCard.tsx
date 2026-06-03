import Badge from '@/components/ui/Badge';
import type { PreBriefingData } from '@/types/meeting';
import { getBlockerRankColor } from '@/utils/blockerColors';

interface Props {
  data: PreBriefingData;
}

const quadrantLabels: Record<string, string> = {
  STABLE: 'STABLE',
  SILENT_RISK: 'SILENT RISK',
  EXPLICIT_RISK: 'EXPLICIT RISK',
  CONSERVATIVE: 'CONSERVATIVE',
};

const quadrantColors: Record<string, 'red' | 'yellow' | 'orange' | 'green' | 'gray'> = {
  STABLE: 'green',
  SILENT_RISK: 'orange',
  EXPLICIT_RISK: 'red',
  CONSERVATIVE: 'yellow',
};

const riskColors: Record<string, 'red' | 'yellow' | 'orange' | 'green' | 'gray'> = {
  DANGER: 'red',
  WARNING: 'orange',
  CAUTION: 'yellow',
  SAFE: 'green',
};

function formatSchedule(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatScore(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : '-';
}

function formatChange(value: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '이전 평균 없음';
  if (value > 0) return `+${Math.round(value)} vs 이전`;
  if (value < 0) return `${Math.round(value)} vs 이전`;
  return '변화 없음';
}

function getInitials(name: string) {
  return name.trim().slice(-2) || '?';
}

function TagList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-xs text-gray-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BlockerTagList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="text-xs text-gray-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => {
        const color = getBlockerRankColor(index + 1);

        return (
          <span
            key={`${item}-${index}`}
            className="rounded-md px-2.5 py-1 text-[11px] font-medium"
            style={{
              backgroundColor: color.bg,
              border: `1px solid ${color.border}`,
              color: color.text,
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}

export default function PreBriefingCard({ data }: Props) {
  const lastMeeting = data.lastMeeting;
  const overdueCount = data.pendingPromises.filter((promise) => promise.overdue).length;

  return (
    <section className="w-full max-w-[560px] rounded-xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-semibold text-[#4E62E6]">
            {getInitials(data.memberName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-gray-900">
              {data.memberName}님과의 {data.round}회차 1on1
            </p>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {formatSchedule(data.scheduledAt)} · {data.memberJobTitle || '직무 정보 없음'}
            </p>
          </div>
        </div>
        {lastMeeting?.quadrant && (
          <Badge
            label={quadrantLabels[lastMeeting.quadrant] ?? lastMeeting.quadrant}
            color={quadrantColors[lastMeeting.quadrant] ?? 'gray'}
          />
        )}
      </div>

      {lastMeeting ? (
        <div className="mb-4 grid grid-cols-1 gap-2.5 border-t border-gray-100 pt-3.5 sm:grid-cols-3">
          <MetricCard
            label="Safety score"
            value={formatScore(lastMeeting.safetyScore)}
            hint={formatChange(lastMeeting.safetyScoreChange)}
            color={{ bg: '#EEF2FF', border: '#C7D2FE', text: '#5F74FA' }}
          />
          <MetricCard
            label="Honesty gap"
            value={lastMeeting.honestyGap?.direction ?? '-'}
            hint={lastMeeting.honestyGap?.riskLevel ?? '데이터 없음'}
            color={{ bg: '#FFF7ED', border: '#FDBA74', text: '#f97316' }}
          />
          <MetricCard
            label="Survey score"
            value={formatScore(data.survey.surveyScore)}
            hint={data.survey.submitted ? '사전 서베이 제출' : '서베이 미제출'}
            color={{ bg: '#F0FDF4', border: '#BBF7D0', text: '#22c55e' }}
          />
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          첫 미팅이라 이전 미팅 데이터가 없습니다.
        </div>
      )}

      <Section title="사전 서베이">
        {data.survey.submitted ? (
          <div className="grid gap-3 sm:grid-cols-[96px_1fr]">
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
              <p className="text-[11px] text-gray-500">Energy</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {data.survey.energyLevel ?? '-'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <TagList items={data.survey.issues} emptyText="선택한 이슈가 없습니다." />
              <TagList items={data.survey.desiredRoles} emptyText="기대 역할이 없습니다." />
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
            멤버가 아직 서베이를 제출하지 않았습니다.
          </p>
        )}
      </Section>

      {(data.pendingPromises.length > 0 || (lastMeeting?.speechActAlerts.length ?? 0) > 0) && (
        <Section title="주의 포인트">
          <div className="flex flex-col gap-2">
            {data.pendingPromises.length > 0 && (
              <div
                className={`rounded-lg px-3 py-2 ${
                  overdueCount > 0 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                <p className="text-xs font-semibold">
                  미이행 약속 {data.pendingPromises.length}건
                  {overdueCount > 0 ? ` · 지연 ${overdueCount}건` : ''}
                </p>
                <p className="mt-1 text-[11px] text-gray-600">
                  {data.pendingPromises.map((promise) => promise.content).join(' · ')}
                </p>
              </div>
            )}
            {lastMeeting?.speechActAlerts.map((alert) => (
              <div key={alert} className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs font-medium text-gray-800">{alert}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="지난 미팅 블로커">
        {lastMeeting ? (
          <BlockerTagList items={lastMeeting.blockerKeywords} emptyText="지난 미팅 블로커가 없습니다." />
        ) : (
          <p className="text-xs text-gray-400">이전 미팅 데이터가 없습니다.</p>
        )}
      </Section>

      <Section title="이번 미팅에서 다뤄볼 주제" isLast>
        {data.recommendedTopics.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data.recommendedTopics.map((topic, index) => (
              <div key={`${topic}-${index}`} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5F74FA]" />
                <p className="text-xs leading-relaxed text-gray-800">{topic}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">추천 주제가 아직 없습니다.</p>
        )}
      </Section>
    </section>
  );
}

function MetricCard({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: string | number;
  hint: string;
  color: {
    bg: string;
    border: string;
    text: string;
  };
}) {
  return (
    <div
      className="rounded-lg border px-3 py-2.5 text-center"
      style={{ backgroundColor: color.bg, borderColor: color.border }}
    >
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold" style={{ color: color.text }}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] font-medium" style={{ color: color.text }}>
        {hint}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className={`${isLast ? '' : 'mb-4'} border-t border-gray-100 pt-3.5`}>
      <p className="mb-2.5 text-xs font-semibold text-gray-500">{title}</p>
      {children}
    </div>
  );
}
