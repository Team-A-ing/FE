import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const issueOptions = ['업무 블로커', '커리어 성장', '팀 협업', '리소스 요청', '기타'];
const energyOptions = [
  { value: 1, icon: '😫', label: '많이 지침' },
  { value: 2, icon: '😳', label: '조금 힘듦' },
  { value: 3, icon: '😊', label: '보통' },
  { value: 4, icon: '😄', label: '좋음' },
  { value: 5, icon: '🔥', label: '최고!' },
];
const desiredRoleOptions = ['그냥 들어주기', '방향성 코칭', '의사결정 도움', '리소스 확보'];

interface SurveyFormProps {
  leaderName: string;
  scheduledAt: string;
  meetingId: number;
}

export default function SurveyForm({ leaderName, scheduledAt, meetingId }: SurveyFormProps) {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number | null>(3);
  const [desiredRoles, setDesiredRoles] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const canSubmit = selectedIssues.length > 0 && energyLevel !== null && desiredRoles.length > 0;

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
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload = { meetingId, issues: selectedIssues, energyLevel, desiredRoles };
    console.log('survey payload', payload);
    setMessage('설문이 제출되었습니다.');
  };

  return (
    <section className="mx-auto flex w-full max-w-[560px] flex-col items-center">
      <p className="text-sm font-bold tracking-wide text-slate-400">
        {leaderName}님과 1on1이 예정되어 있습니다.
      </p>
      <h1 className="mt-5 text-center text-2xl font-bold leading-snug text-gray-900">
        사전 설문 조사를 진행해 주세요!
      </h1>
      <p className="mt-4 text-center text-base tracking-wide text-slate-400">{scheduledDate}</p>

      <Card className="mt-10 w-full rounded-[20px] border-gray-200 px-9 py-9 shadow-sm">
        <div className="space-y-9">
          <section>
            <h2 className="text-lg font-extrabold text-gray-900">Q1. 오늘 꼭 다루고 싶은 이슈는?</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {issueOptions.map((issue) => {
                const isSelected = selectedIssues.includes(issue);
                return (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => toggleValue(issue, selectedIssues, setSelectedIssues)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {issue}
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
                    onClick={() => { setEnergyLevel(energy.value); setMessage(''); }}
                    className={`flex aspect-square min-h-[88px] flex-col items-center justify-center rounded-[18px] border text-center transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_0_0_1px_rgba(139,92,246,0.9)]'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl leading-none">{energy.icon}</span>
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
                const isSelected = desiredRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleValue(role, desiredRoles, setDesiredRoles)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="pt-1">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`h-14 w-full text-base ${
                canSubmit
                  ? 'bg-gray-900 text-white hover:bg-gray-700'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-100 disabled:opacity-100'
              }`}
            >
              제출하기
            </Button>
            {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
            <p className="mt-9 text-center text-sm text-slate-400">
              소요시간 약 30초 <span aria-hidden="true">⏱️</span>
            </p>
            <span className="sr-only">현재 에너지 레벨: {selectedEnergyLabel}</span>
          </div>
        </div>
      </Card>
    </section>
  );
}
