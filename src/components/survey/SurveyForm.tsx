import axios from 'axios';
import { useMemo, useState } from 'react';
import { submitSurvey } from '@/api/meetings';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const vdiQuestions = [
  {
    key: 'vulnerabilityLevel' as const,
    label: 'Q1. 나는 이번 미팅에서 어려움/실수를 솔직히 말할 수 있을 것 같다',
  },
  {
    key: 'dissentLevel' as const,
    label: 'Q2. 나는 리더 의견에 동의하지 않으면 말할 수 있다',
  },
  {
    key: 'initiativeLevel' as const,
    label: 'Q3. 나는 이번 미팅에서 먼저 의견을 제안할 것이다',
  },
];

const levelOptions = [
  { value: 1, label: '전혀\n아니다' },
  { value: 2, label: '아닌\n편이다' },
  { value: 3, label: '보통\n이다' },
  { value: 4, label: '그런\n편이다' },
  { value: 5, label: '매우\n그렇다' },
];

type VdiScores = {
  vulnerabilityLevel: number | null;
  dissentLevel: number | null;
  initiativeLevel: number | null;
};

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
  const [scores, setScores] = useState<VdiScores>({
    vulnerabilityLevel: null,
    dissentLevel: null,
    initiativeLevel: null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    meetingId > 0 &&
    scores.vulnerabilityLevel !== null &&
    scores.dissentLevel !== null &&
    scores.initiativeLevel !== null;

  const scheduledDate = useMemo(() => {
    if (!scheduledAt) return '일정 미정';
    const d = new Date(scheduledAt);
    if (isNaN(d.getTime())) return '일정 미정';
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  }, [scheduledAt]);

  const getSubmitErrorMessage = (err: unknown) => {
    if (axios.isAxiosError<ApiErrorBody>(err)) {
      const code = err.response?.data?.code;
      return (code && submitErrorMessages[code]) ?? err.response?.data?.message;
    }
    return undefined;
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');
    setError('');
    try {
      await submitSurvey({
        meetingId,
        scores: {
          vulnerabilityLevel: scores.vulnerabilityLevel!,
          dissentLevel: scores.dissentLevel!,
          initiativeLevel: scores.initiativeLevel!,
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
      {scheduledDate !== '일정 미정' && (
        <p className="mt-4 text-center text-base tracking-wide text-slate-400">{scheduledDate}요일</p>
      )}

      <Card className="mt-10 w-full rounded-[20px] border-gray-200 px-9 py-9 shadow-sm">
        <div className="space-y-10">
          {vdiQuestions.map((q) => (
            <section key={q.key}>
              <h2 className="text-lg font-extrabold text-gray-900">{q.label}</h2>
              <div className="mt-5 grid grid-cols-5 gap-2">
                {levelOptions.map((opt) => {
                  const isSelected = scores[q.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setScores((prev) => ({ ...prev, [q.key]: opt.value }));
                        setMessage('');
                        setError('');
                      }}
                      className={`flex aspect-square min-h-[72px] flex-col items-center justify-center rounded-[16px] border text-center text-xs font-bold transition-colors whitespace-pre-line ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_0_0_1px_rgba(139,92,246,0.9)]'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg font-extrabold">{opt.value}</span>
                      <span className="mt-1 leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

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
          </div>
        </div>
      </Card>
    </section>
  );
}
