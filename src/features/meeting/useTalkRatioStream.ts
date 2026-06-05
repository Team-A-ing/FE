import { useEffect, useState } from 'react';

interface TalkRatioEvent {
  leaderRatio: number;
  memberRatio: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export function useTalkRatioStream(meetingId: number | null) {
  const [ratio, setRatio] = useState<TalkRatioEvent | null>(null);

  useEffect(() => {
    if (!meetingId) return;
    const token = localStorage.getItem('token');
    const url = `${API_BASE}/api/v1/meetings/${meetingId}/talk-ratio/stream`;
    const es = new EventSource(token ? `${url}?token=${token}` : url);

    es.addEventListener('talkRatio', (e) => {
      try {
        setRatio(JSON.parse(e.data));
      } catch { /* ignore */ }
    });

    es.onerror = () => es.close();

    return () => es.close();
  }, [meetingId]);

  return ratio;
}
