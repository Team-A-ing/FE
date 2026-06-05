import { useRef, useState, useCallback, useEffect } from 'react';

export function useArduinoSerial() {
  const [connected, setConnected] = useState(false);
  const portRef = useRef<any | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);

  const connect = useCallback(async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial API는 Chrome/Edge 브라우저에서만 지원됩니다.');
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      portRef.current = port;
      writerRef.current = port.writable.getWriter();
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  const send = useCallback(async (signal: 'R' | 'G') => {
    if (!writerRef.current) return;
    try {
      await writerRef.current.write(new TextEncoder().encode(signal + '\n'));
    } catch { /* 연결 끊김 무시 */ }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (writerRef.current) {
        await writerRef.current.close();
        writerRef.current = null;
      }
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
    } catch { /* ignore */ }
    setConnected(false);
  }, []);

  // 언마운트 시 포트 정리
  useEffect(() => {
    return () => {
      if (writerRef.current) writerRef.current.releaseLock();
      if (portRef.current) portRef.current.close().catch(() => {});
    };
  }, []);

  return { connected, connect, send, disconnect };
}
