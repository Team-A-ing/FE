import axios from 'axios';
import { useMemo, useState } from 'react';
import { submitSurvey } from '@/api/meetings';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const issueOptions = [
  { value: '업무 블로커', label: '업무 진행을 막는 이슈가 있어요' },
  { value: '리소스 요청', label: '인력/도구 등 리소스가 부족해요' },
  { value: '커리어 성장', label: '커리어 방향에 대해 이야기하고 싶어요' },
  { value: '팀 분위기', label: '팀 분위기/협업에 대해 이야기하고 싶어요' },
  { value: '프로세스 개선', label: '프로세스 개선이 필요해요' },
  { value: '인정/피드백', label: '인정이나 피드백을 받고 싶어요' },
  { value: '기타', label: '기타 주제' },
];

const energyOptions = [
  { value: 1, icon: '😫', label: '많이 지쳤어요' },
  { value: 2, icon: '😳', label: '조금 힘들어요' },
  { value: 3, icon: '😊', label: '보통이에요' },
  { value: 4, icon: '😄', label: '좋아요' },
  { value: 5, icon: '🔥', label: '최고예요' },
];

const desiredRoleOptions = [
  { value: '방향성 코칭', label: '방향성을 잡아주세요' },
  { value: '의사결정 도움', label: '의사결정을 도와주세요' },
  { value: '리소스 지원', label: '리소스를 확보해 주세요' },
  { value: '경청/공감', label: '들어주시고 공감해 주세요' },
  { value: '기술적 멘토링', label: '기술적 조언이 필요해요' },
];

const submitErrorMessages: Record<string, string> = {
  SURVEY_ALREADY_SUBMITTED: '이미 서베이를 제출한 미팅입니다.',
  FORBIDDEN: '본인이 참여한 미팅에만 서베이를 제출할 수 있습니다.',
  MEETING_NOT_FOUND: '존재하지 않는 미팅입니다.',
};

interface ApiErrorBody {
  code?: string;
  message?: string;
}

export interface SurveyFormProps {
  leaderName: string;
  scheduledAt: string;
  meetingId: number;
}

export default function SurveyForm({ leaderName, scheduledAt, meetingId }: SurveyFormProps) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number | null>(3);
  const [desiredRoles, setDesiredRoles] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    meetingId > 0 && selectedIssues.length > 0 && energyLevel !== null && desiredRoles.length > 0;

  const selectedEnergyLabel = useMemo(
    () => energyOptions.find((option) => option.value === energyLevel)?.label ?? '',
    [energyLevel],
  );

  const scheduledDate = useMemo(
    () =>
      new Date(scheduledAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }),
    [scheduledAt],
  );

  const toggleValue = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setMessage('');
    setError('');
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const getSubmitErrorMessage = (err: unknown) => {
    if (axios.isAxiosError<ApiErrorBody>(err)) {
      const code = err.response?.data?.code;
      return (code && submitErrorMessages[code]) ?? err.response?.data?.message;
    }
    return undefined;
  };

  const handleSubmit = async () => {
    if (!canSubmit || energyLevel === null || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      await submitSurvey({
        meetingId,
        scores: {
          issues: selectedIssues,
          energyLevel,
          desiredRoles,
        },
      });
      setMessage('서베이가 제출되었습니다.');
    } catch (err) {
      setError(getSubmitErrorMessage(err) ?? '서베이 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[560px] flex-col items-center">
      <p className="text-sm font-bold tracking-wide text-slate-400">
        {leaderName}님과 1on1이 예정되어 있습니다.
      </p>
      <h1 className="mt-5 text-center text-2xl font-bold leading-snug text-gray-900">
        사전 설문 조사를 진행해 주세요
      </h1>
      <p className="mt-4 text-center text-base tracking-wide text-slate-400">{scheduledDate}요일</p>

      <Card className="mt-10 w-full rounded-[20px] border-gray-200 px-9 py-9 shadow-sm">
        <div className="space-y-9">
          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q1. 오늘 꼭 다루고 싶은 이슈는?</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {issueOptions.map((issue) => {
                const isSelected = selectedIssues.includes(issue.value);
                return (
                  <button
                    key={issue.value}
                    type="button"
                    onClick={() => toggleValue(issue.value, selectedIssues, setSelectedIssues)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {issue.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q2. 지금 나의 에너지 레벨은?</h2>
            <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
              {energyOptions.map((energy) => {
                const isSelected = energy.value === energyLevel;
                return (
                  <button
                    key={energy.value}
                    type="button"
                    onClick={() => {
                      setEnergyLevel(energy.value);
                      setMessage('');
                      setError('');
                    }}
                    className={`flex aspect-square min-h-[88px] flex-col items-center justify-center rounded-[18px] border text-center transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_0_0_1px_rgba(139,92,246,0.9)]'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl font-extrabold leading-none">{energy.icon}</span>
                    <span className="mt-3 text-[11px] font-bold">{energy.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q3. 이번 미팅에서 리더에게 바라는 역할은?</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {desiredRoleOptions.map((role) => {
                const isSelected = desiredRoles.includes(role.value);
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => toggleValue(role.value, desiredRoles, setDesiredRoles)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="pt-1">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`h-14 w-full text-base ${
                canSubmit
                  ? 'bg-gray-900 text-white hover:bg-gray-700'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-100 disabled:opacity-100'
              }`}
            >
              {isSubmitting ? '제출 중...' : '제출하기'}
            </Button>
            {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
            {error && <p className="mt-4 text-center text-sm font-medium text-red-600">{error}</p>}
            <p className="mt-9 text-center text-sm text-slate-400">소요시간 약 30초</p>
            <span className="sr-only">현재 에너지 레벨: {selectedEnergyLabel}</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
