import { useRef, useState, useCallback, useEffect } from 'react';
import apiClient from '@/api/client';

const LEADER_RATIO_THRESHOLD = 70; // 리더 발화 비율 경고 기준 (%)
const SIGNAL_INTERVAL_MS = 4000;   // BE에 신호 전송 주기
const VAD_THRESHOLD = 0.015;       // 발화 감지 진폭 임계값

interface IotState {
  leaderRatio: number;
  ledColor: 'GREEN' | 'RED';
  connected: boolean;
}

export function useIoTTalkRatio(meetingId: string | undefined) {
  const [state, setState] = useState<IotState>({ leaderRatio: 0, ledColor: 'GREEN', connected: false });
  const portRef = useRef<SerialPort | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const leaderSecondsRef = useRef(0);
  const totalSecondsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Web Serial 연결
  const connectSerial = useCallback(async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial은 Chrome에서만 지원됩니다.');
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      writerRef.current = port.writable.getWriter();
      setState(prev => ({ ...prev, connected: true }));
      // 연결 시 파란 불
      await sendSerial('B');
    } catch (e) {
      console.error('Serial 연결 실패:', e);
    }
  }, []);

  const sendSerial = async (cmd: 'R' | 'G' | 'B') => {
    if (!writerRef.current) return;
    await writerRef.current.write(new TextEncoder().encode(cmd));
  };

  // VAD 기반 발화 시간 측정 시작
  const startVAD = useCallback(async () => {
    if (!meetingId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);
      let lastTick = Date.now();

      // 100ms마다 진폭 체크 → 발화 감지
      const tick = () => {
        if (ctx.state === 'closed') return;
        analyser.getFloatTimeDomainData(buffer);
        const rms = Math.sqrt(buffer.reduce((s, v) => s + v * v, 0) / buffer.length);
        const now = Date.now();
        const elapsed = (now - lastTick) / 1000;
        lastTick = now;
        totalSecondsRef.current += elapsed;
        if (rms > VAD_THRESHOLD) leaderSecondsRef.current += elapsed;
        timeoutRef.current = setTimeout(tick, 100);
      };
      tick();
    } catch (e) {
      console.error('마이크 접근 실패:', e);
      return;
    }

    // BE에 주기적으로 신호 전송 + LED 업데이트
    intervalRef.current = setInterval(async () => {
      const ls = leaderSecondsRef.current;
      const ts = totalSecondsRef.current;
      if (ts === 0) return;

      const ratio = Math.round((ls / ts) * 100);
      const ledColor = ratio >= LEADER_RATIO_THRESHOLD ? 'RED' : 'GREEN';
      setState({ leaderRatio: ratio, ledColor, connected: !!portRef.current });
      await sendSerial(ledColor === 'RED' ? 'R' : 'G');

      // BE 업데이트 (팀원 등 다른 화면에서도 확인 가능)
      try {
        await apiClient.patch(`/api/v1/meetings/${meetingId}/talk-signal`, {
          leaderSeconds: Math.round(ls),
          totalSeconds: Math.round(ts),
        });
      } catch { /* 네트워크 오류는 무시 */ }
    }, SIGNAL_INTERVAL_MS);
  }, [meetingId]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    leaderSecondsRef.current = 0;
    totalSecondsRef.current = 0;
  }, []);

  const disconnectSerial = useCallback(async () => {
    try {
      await sendSerial('G'); // 종료 시 초록으로
    } catch { /* 포트가 이미 닫혔을 수 있음 */ } finally {
      writerRef.current?.releaseLock();
      await portRef.current?.close().catch(() => {});
      portRef.current = null;
      writerRef.current = null;
      setState(prev => ({ ...prev, connected: false }));
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { state, connectSerial, disconnectSerial, startVAD, stop };
}
