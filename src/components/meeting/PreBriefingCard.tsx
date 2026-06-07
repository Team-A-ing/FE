import { useState } from 'react';
import { feedbackCardStyles, type FeedbackCardProps } from '@/components/feedback/FeedbackCard';
import type { PendingPromise, PreBriefingData } from '@/types/meeting';

interface Props {
  data: PreBriefingData;
}

interface CoachingGuideViewModel {
  focusArea: string;
  guideSummary: string;
  evidence: string[];
  suggestedQuestions: string[];
}

const guideBoxClassName = 'rounded-xl border border-slate-200 px-4 py-4';
type FeedbackTone = NonNullable<FeedbackCardProps['type']>;

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

function formatDueDate(value: string | null) {
  if (!value) return '기한 미정';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `기한 ${value}`;

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function getInitials(name: string) {
  return name.trim().slice(-2) || '?';
}

function getFocusAreaClassName(focusArea: string) {
  if (focusArea.includes('약속') || focusArea.includes('점검')) {
    return 'border-amber-300 bg-amber-100 text-amber-800';
  }
  if (focusArea.includes('솔직') || focusArea.includes('유도')) {
    return 'border-rose-300 bg-rose-100 text-rose-800';
  }
  if (focusArea.includes('경청') || focusArea.includes('듣기')) {
    return 'border-blue-300 bg-blue-100 text-blue-800';
  }
  return 'border-slate-300 bg-slate-100 text-slate-800';
}

function getFocusAreaTone(focusArea: string): FeedbackTone | 'neutral' {
  if (focusArea.includes('솔직') || focusArea.includes('유도')) {
    return 'error';
  }
  if (focusArea.includes('약속') || focusArea.includes('점검')) {
    return 'warning';
  }
  if (focusArea.includes('경청') || focusArea.includes('듣기')) {
    return 'info';
  }
  return 'neutral';
}

function getFocusAreaBoxStyles(focusArea: string) {
  const tone = getFocusAreaTone(focusArea);

  if (tone === 'neutral') {
    return {
      card: 'border-slate-200 bg-slate-50',
      title: 'text-slate-700',
    };
  }

  return feedbackCardStyles[tone];
}

function buildFallbackGuide(data: PreBriefingData): CoachingGuideViewModel {
  const overdueCount = data.pendingPromises.filter((promise) => promise.overdue).length;
  const hasPendingPromises = data.pendingPromises.length > 0;
  const hasSpeechAlerts = (data.lastMeeting?.speechActAlerts.length ?? 0) > 0;

  const focusArea = overdueCount > 0 ? '약속 점검' : hasSpeechAlerts ? '경청 강화' : '대화 준비';

  const guideSummary = hasPendingPromises
    ? `지난 미팅에서 남은 약속 ${data.pendingPromises.length}건을 먼저 확인하고, 진행을 막는 지점이 있는지 차분히 들어보세요.`
    : '멤버의 최근 업무 상황과 컨디션을 먼저 확인하고, 다음 액션을 함께 정리해보세요.';

  const evidence = [
    ...data.pendingPromises.map((promise) => {
      const dueDate = promise.dueDate ? ` · 기한 ${promise.dueDate}` : '';
      const status = promise.overdue ? '기한 초과' : '진행 중';
      return `${promise.content} (${status}${dueDate})`;
    }),
    ...(data.lastMeeting?.speechActAlerts ?? []),
    ...(data.lastMeeting?.blockerKeywords.length
      ? [`직전 미팅 주요 blocker: ${data.lastMeeting.blockerKeywords.join(', ')}`]
      : []),
  ];

  const suggestedQuestions = data.recommendedTopics.length
    ? data.recommendedTopics
    : ['최근 업무에서 가장 신경 쓰이는 부분은 무엇인가요?', '지난 미팅 이후 제가 확인해야 할 약속이나 지원이 있었나요?'];

  return {
    focusArea,
    guideSummary,
    evidence,
    suggestedQuestions,
  };
}

function ActionItemStatusBadge({ overdue }: { overdue: boolean }) {
  return (
    <span
      className={
        overdue
          ? 'shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-100'
          : 'shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100'
      }
    >
      {overdue ? '기한 초과' : '진행 중'}
    </span>
  );
}

function ActionItems({ items }: { items: PendingPromise[] }) {
  return (
    <div className={`mt-4 bg-white ${guideBoxClassName}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500">액션아이템</p>
          <p className="mt-1 text-xs font-medium text-gray-400">이번 1on1에서 확인할 미이행 약속</p>
        </div>
        <span className="text-xs font-semibold text-gray-400">{items.length}개</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-400">
          확인할 미이행 약속이 없습니다.
        </p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
          {items.map((item, index) => (
            <div
              key={item.promiseId}
              className={`flex items-center justify-between gap-4 px-3 py-3 ${
                index > 0 ? 'border-t border-gray-100' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-gray-900">{item.content}</p>
                <p className="mt-1 text-xs font-medium text-gray-400">{formatDueDate(item.dueDate)}</p>
              </div>
              <ActionItemStatusBadge overdue={item.overdue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PreBriefingCard({ data }: Props) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const guide = data.coachingGuide ?? buildFallbackGuide(data);
  const focusBoxStyles = getFocusAreaBoxStyles(guide.focusArea);

  return (
    <section className="w-full max-w-[600px] rounded-xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-semibold text-[#4E62E6]">
            {getInitials(data.memberName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-gray-900">
              {data.memberName}님과 {data.round}회차 1on1
            </p>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {formatSchedule(data.scheduledAt)} · {data.memberJobTitle || '직무 정보 없음'}
            </p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getFocusAreaClassName(guide.focusArea)}`}>
          {guide.focusArea}
        </span>
      </div>

      <div className={`mt-5 ${guideBoxClassName} ${focusBoxStyles.card}`}>
        <p className={`text-xs font-bold ${focusBoxStyles.title}`}>이번 미팅 포커스</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-800">{guide.guideSummary}</p>

        <div className="mt-3 border-t border-slate-200/80 pt-2">
          <button
            type="button"
            onClick={() => setEvidenceOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-lg py-1.5 text-left text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            <span>{evidenceOpen ? '근거 접기' : '근거 보기'}</span>
            <span
              className="text-gray-400 transition-transform"
              style={{ transform: evidenceOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▾
            </span>
          </button>

          {evidenceOpen && (
            <div className="mt-2 flex flex-col gap-2 rounded-lg bg-white/70 px-3 py-3">
              {guide.evidence.length > 0 ? (
                guide.evidence.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <p className="text-xs leading-relaxed text-gray-600">{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">표시할 근거가 아직 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`mt-4 bg-white ${guideBoxClassName}`}>
        <p className="text-xs font-semibold text-gray-500">오늘 물어볼 질문</p>
        <div className="mt-2.5 flex flex-col gap-2">
          {guide.suggestedQuestions.map((question, index) => (
            <p key={`${question}-${index}`} className="text-sm leading-relaxed text-gray-900">
              {question}
            </p>
          ))}
        </div>
      </div>

      <ActionItems items={data.pendingPromises} />
    </section>
  );
}
