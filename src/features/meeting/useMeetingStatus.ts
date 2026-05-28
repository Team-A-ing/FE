import { useState, useEffect, useRef } from "react";
import { fetchAnalysisStatus } from "@/api/analysis";
import type { AnalysisStatusData, AnalysisStepKey } from "@/types/analysis";
import { WITTY_COPIES } from "@/components/loading/loadingCopies";

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 180_000;
const MOCK_STEP_DELAY_MS = 2000;

const MOCK_STEPS: Array<Omit<AnalysisStatusData, 'meetingId'>> = [
  { step: 'STT',       stepNumber: 1, totalSteps: 4, progress: 15,  stepLabel: 'STT 변환',   wittyMessage: { leader: WITTY_COPIES.leader[0], member: WITTY_COPIES.member[0] } },
  { step: 'NLP',       stepNumber: 2, totalSteps: 4, progress: 40,  stepLabel: 'NLP 분석',   wittyMessage: { leader: WITTY_COPIES.leader[1], member: WITTY_COPIES.member[1] } },
  { step: 'SCORING',   stepNumber: 3, totalSteps: 4, progress: 65,  stepLabel: '스코어링',   wittyMessage: { leader: WITTY_COPIES.leader[2], member: WITTY_COPIES.member[2] } },
  { step: 'FEEDBACK',  stepNumber: 4, totalSteps: 4, progress: 85,  stepLabel: '피드백 생성', wittyMessage: { leader: WITTY_COPIES.leader[3], member: WITTY_COPIES.member[3] } },
  { step: 'COMPLETED' as AnalysisStepKey, stepNumber: 4, totalSteps: 4, progress: 100, stepLabel: '완료', wittyMessage: { leader: WITTY_COPIES.leader[3], member: WITTY_COPIES.member[3] } },
];

export function useMeetingStatus(meetingId: string | null, active: boolean) {
  const [status, setStatus] = useState<AnalysisStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!meetingId || !active) return;

    if (import.meta.env.VITE_USE_MOCK === 'true' && meetingId.startsWith('mock-')) {
      const numericId = parseInt(meetingId.replace('mock-', '')) || 0;
      let stepIndex = 0;

      const runNextStep = () => {
        if (stepIndex >= MOCK_STEPS.length) return;
        setStatus({ ...MOCK_STEPS[stepIndex], meetingId: numericId });
        stepIndex++;
        if (stepIndex < MOCK_STEPS.length) {
          timeoutRef.current = setTimeout(runNextStep, MOCK_STEP_DELAY_MS);
        }
      };

      runNextStep();
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    startTimeRef.current = Date.now();

    const poll = async () => {
      if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setError('분석 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      try {
        const data = await fetchAnalysisStatus(meetingId);
        setStatus(data);
        if (data.step === 'COMPLETED' || data.step === 'FAILED') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (data.step === 'FAILED') {
            setError('분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
        }
      } catch {
        // 일시적 네트워크 오류는 무시하고 계속 폴링
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [meetingId, active]);

  return { status, error };
}