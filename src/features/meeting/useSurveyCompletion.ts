import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { fetchSurvey } from '@/api/meetings';

const POLL_INTERVAL_MS = 3000;

interface ApiErrorBody {
  code?: string;
}

function isSurveyMissing(err: unknown) {
  if (!axios.isAxiosError<ApiErrorBody>(err)) return false;
  return err.response?.status === 404 || err.response?.data?.code === 'SURVEY_NOT_FOUND';
}

export function useSurveyCompletion(meetingId: string | undefined, active: boolean) {
  const [completed, setCompleted] = useState(false);
  const [checking, setChecking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!meetingId || !active) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    setChecking(true);
    setCompleted(false);

    const clearPoll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const check = async () => {
      try {
        await fetchSurvey(meetingId);
        if (cancelled) return;
        setCompleted(true);
        setChecking(false);
        clearPoll();
      } catch (err) {
        if (cancelled) return;
        if (isSurveyMissing(err)) {
          setCompleted(false);
          setChecking(false);
          return;
        }
        setChecking(false);
      }
    };

    check();
    intervalRef.current = setInterval(check, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearPoll();
    };
  }, [meetingId, active]);

  return { completed, checking };
}
