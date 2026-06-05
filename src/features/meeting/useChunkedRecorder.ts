import { useRef, useState, useCallback } from 'react';
import apiClient from '@/api/client';

type CalibrationState = 'idle' | 'leader' | 'member' | 'done';

export function useChunkedRecorder(meetingId: number) {
  const [isRecording, setIsRecording] = useState(false);
  const [calibrationState, setCalibrationState] = useState<CalibrationState>('idle');
  const [elapsed, setElapsed] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const chunkCountRef = useRef(0); // 1=리더 캘리브레이션 전송, 2=멤버 캘리브레이션 전송, 3+=프로덕션

  const sendCalibration = useCallback(async (role: 'leader' | 'member', blob: Blob) => {
    const form = new FormData();
    form.append('audio', blob, 'calib.webm');
    await apiClient.post(`/api/v1/meetings/${meetingId}/calibrate/${role}`, form);
  }, [meetingId]);

  const sendChunk = useCallback(async (blob: Blob) => {
    const form = new FormData();
    form.append('audio', blob, 'chunk.webm');
    await apiClient.post(`/api/v1/meetings/${meetingId}/audio-chunk`, form).catch(() => {});
  }, [meetingId]);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    elapsedRef.current = 0;
    chunkCountRef.current = 0;

    const mr = new MediaRecorder(stream, { mimeType: 'audio/webm', audioBitsPerSecond: 16000 });
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorderRef.current = mr;
    mr.start(1000);
    setIsRecording(true);
    setCalibrationState('leader');

    timerRef.current = setInterval(() => {
      setElapsed((t) => { elapsedRef.current = t + 1; return t + 1; });
    }, 1000);

    // 5초마다: 1회=리더 캘리브레이션, 2회=멤버 캘리브레이션, 3회~=프로덕션 청크
    chunkIntervalRef.current = setInterval(async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      chunksRef.current = [];
      chunkCountRef.current++;

      if (chunkCountRef.current === 1) {
        await sendCalibration('leader', blob);
        setCalibrationState('member');
      } else if (chunkCountRef.current === 2) {
        await sendCalibration('member', blob);
        setCalibrationState('done');
      } else {
        sendChunk(blob);
      }
    }, 5000);
  }, [sendCalibration, sendChunk]);

  const stop = useCallback((): Promise<{ blob: Blob; durationSec: number }> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder) { resolve({ blob: new Blob(), durationSec: 0 }); return; }
      const durationSec = elapsedRef.current;
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        if (chunkIntervalRef.current) clearInterval(chunkIntervalRef.current);
        setIsRecording(false);
        setCalibrationState('idle');
        resolve({ blob, durationSec });
      };
      recorder.stop();
    });
  }, []);

  return { isRecording, calibrationState, elapsed, start, stop };
}
