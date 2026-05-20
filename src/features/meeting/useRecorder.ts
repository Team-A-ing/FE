import { useState, useRef, useCallback } from "react";

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const elapsedRef = useRef(0);

  const tickAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    const buf = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    setAudioLevel(Math.sqrt(sum / buf.length));
    rafRef.current = requestAnimationFrame(tickAudioLevel);
  }, []);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const mr = new MediaRecorder(stream, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 16000,
    });
    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorderRef.current = mr;
    mr.start(1000);
    setIsRecording(true);
    setElapsed(0);
    elapsedRef.current = 0;
    timerRef.current = setInterval(() => {
      setElapsed((t) => {
        const next = t + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
    rafRef.current = requestAnimationFrame(tickAudioLevel);
  }, [tickAudioLevel]);

  const stop = useCallback((): Promise<{ blob: Blob; durationSec: number }> => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        reject(new Error('녹음이 시작되지 않았습니다.'));
        return;
      }
      const durationSec = elapsedRef.current;
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        blobRef.current = blob;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        resolve({ blob, durationSec });
      };
      recorder.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsRecording(false);
      setAudioLevel(0);
    });
  }, []);

  return { isRecording, elapsed, audioLevel, start, stop };
}