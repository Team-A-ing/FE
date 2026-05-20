import { useState, useEffect, useRef } from "react";
import { fetchAnalysisStatus } from "@/api/analysis";
import type { AnalysisStatusData } from "@/types/analysis";

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 180_000;

export function useMeetingStatus(meetingId: string | null, active: boolean) {
  const [status, setStatus] = useState<AnalysisStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!meetingId || !active) return;

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