import { useRef, useState, useCallback } from 'react';

export function useArduinoSerial() {
  const [connected, setConnected] = useState(false);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);

  const connect = useCallback(async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial API는 Chrome/Edge 브라우저에서만 지원됩니다.');
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
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

  return { connected, connect, send };
}
