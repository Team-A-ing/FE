import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import { useMemberReport } from '@/features/member/useMemberReport';
import type {
  ConfirmedAchievement,
  LeaderPromise,
  MemberAchievementType,
  MemberPromiseCategory,
  MemberPromiseStatus,
} from '@/types/memberReport';

const achievementStyles: Record<MemberAchievementType, { keyword: string; card: string; text: string }> = {
  ACHIEVEMENT: {
    keyword: '성취',
    card: 'border-gray-200 bg-gray-50',
    text: 'text-emerald-700',
  },
  INITIATIVE: {
    keyword: '주도',
    card: 'border-gray-200 bg-gray-50',
    text: 'text-blue-700',
  },
  GROWTH: {
    keyword: '성장',
    card: 'border-gray-200 bg-gray-50',
    text: 'text-violet-700',
  },
  CONTRIBUTION: {
    keyword: '기여',
    card: 'border-gray-200 bg-gray-50',
    text: 'text-sky-700',
  },
  FEEDBACK: {
    keyword: '피드백',
    card: 'border-gray-200 bg-gray-50',
    text: 'text-amber-700',
  },
};

const categoryTextStyles: Record<MemberPromiseCategory, string> = {
  RESOURCE: 'text-blue-700',
  TEAM_BUILDING: 'text-violet-700',
  RECOGNITION: 'text-amber-700',
  PROCESS: 'text-teal-700',
};

const categoryLabels: Record<MemberPromiseCategory, string> = {
  RESOURCE: '리소스',
  TEAM_BUILDING: '팀빌딩',
  RECOGNITION: '인정',
  PROCESS: '프로세스',
};

const statusLabels: Record<MemberPromiseStatus, string> = {
  PENDING: '진행 중',
  DONE: '완료',
};

function formatDuration(durationSec: number | null) {
  if (!durationSec || durationSec <= 0) return '-';
  return `${Math.floor(durationSec / 60)}분`;
}

function formatDate(date: string) {
  const normalizedDate = date.slice(0, 10);
  const parsedDate = new Date(`${normalizedDate}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function sortPromises(promises: LeaderPromise[]) {
  return [...promises].sort((a, b) => {
    if (a.status === 'DONE' && b.status !== 'DONE') return 1;
    if (a.status !== 'DONE' && b.status === 'DONE') return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}

function AchievementCard({ achievement }: { achievement: ConfirmedAchievement }) {
  const style = achievementStyles[achievement.type];

  return (
    <article className={`rounded-xl border p-4 ${style.card}`}>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-sm font-bold ${style.text}`}>#{style.keyword}</span>
          <h3 className="text-base font-bold leading-6 text-gray-950">{achievement.title}</h3>
        </div>

        <p className="text-sm leading-6 text-gray-800">
          {achievement.description}{' '}
          <span className={`ml-1 text-xs font-semibold ${style.text}`}>
            {achievement.impactMetric}
          </span>
        </p>

        <p className="mt-1 border-l-2 border-gray-300 pl-3 text-sm leading-6 text-gray-600">
          "{achievement.leaderQuote}" - {achievement.leaderName}
        </p>
      </div>
    </article>
  );
}

function PromiseItem({ promise }: { promise: LeaderPromise }) {
  const isDone = promise.status === 'DONE';
  const categoryTone = categoryTextStyles[promise.category];
  const cardTone = isDone ? 'border-gray-200 bg-gray-100' : 'border-gray-200 bg-white';

  return (
    <li className={`rounded-xl border p-4 ${cardTone}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className={categoryTone}>#{categoryLabels[promise.category]}</span>
            <span className={isDone ? 'text-gray-500' : categoryTone}>
              마감 {formatDate(promise.dueDate)}
            </span>
          </div>

          <p
            className={`mt-2 text-sm font-semibold leading-6 ${
              isDone
                ? 'text-gray-500 line-through decoration-gray-500 decoration-2'
                : 'text-gray-950'
            }`}
          >
            {promise.content}
          </p>
        </div>

        <span
          className={`shrink-0 text-xs font-bold ${
            isDone ? 'text-gray-500' : 'text-emerald-700'
          }`}
        >
          {statusLabels[promise.status]}
        </span>
      </div>
    </li>
  );
}

export default function MemberReportPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { data: report, loading, error } = useMemberReport(meetingId);
  const sortedPromises = useMemo(
    () => sortPromises(report?.leaderPromises ?? []),
    [report?.leaderPromises],
  );

  if (loading) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-[1120px] p-6">
          <Card className="p-6">
            <p className="text-sm text-gray-500">멤버 리포트를 불러오는 중입니다.</p>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (error || !report) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-[1120px] p-6">
          <Card className="p-6">
            <p className="text-sm text-gray-500">{error ?? '멤버 리포트를 찾을 수 없습니다.'}</p>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-[1120px] bg-[#F7F8FA] p-6">
        <header className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">{formatDate(report.meetingDate)}</p>
              <h1 className="mt-2 text-2xl font-bold text-gray-950">1on1 분석 리포트</h1>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-500">
              <span className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1">
                # {report.round}회차
              </span>
              <span className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1">
                {formatDuration(report.durationSec)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{report.leaderName}님과의 미팅</p>
        </header>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950">오늘의 성과</h2>
            <span className="text-sm font-semibold text-gray-500">
              {report.confirmedAchievements.length}개
            </span>
          </div>
          <Card className="p-4">
            {report.confirmedAchievements.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">분석 결과가 없습니다.</p>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {report.confirmedAchievements.map((achievement) => (
                  <AchievementCard key={achievement.careerEventId} achievement={achievement} />
                ))}
              </div>
            )}
          </Card>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-950">리더의 약속 장부</h2>
            <span className="text-sm font-semibold text-gray-500">{sortedPromises.length}개</span>
          </div>
          <Card className="p-4">
            {sortedPromises.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">분석 결과가 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {sortedPromises.map((promise) => (
                  <PromiseItem key={promise.promiseId} promise={promise} />
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
