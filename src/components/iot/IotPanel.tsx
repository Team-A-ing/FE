import { useEffect } from 'react';
import { useTalkRatioStream } from '@/features/meeting/useTalkRatioStream';
import { useArduinoSerial } from '@/features/meeting/useArduinoSerial';

interface Props {
  meetingId: string | undefined;
  isRecording?: boolean;
}

export default function IotPanel({ meetingId, isRecording }: Props) {
  const meetingIdNum = meetingId ? Number(meetingId) : null;
  const ratio = useTalkRatioStream(isRecording ? meetingIdNum : null);
  const { connected, connect, send } = useArduinoSerial();

  const leaderRatio = ratio?.leaderRatio ?? 0;

  useEffect(() => {
    if (!ratio || !isRecording) return;
    send(ratio.leaderRatio >= 70 ? 'R' : 'G');
  }, [ratio, isRecording, send]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">발화 비율</p>

      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${
            isRecording
              ? leaderRatio >= 70 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
              : 'bg-gray-300'
          }`}
        />
        <span className="text-sm text-gray-700">
          리더 <span className="font-semibold">{leaderRatio}%</span>
          {' / '}
          멤버 <span className="font-semibold">{ratio?.memberRatio ?? 0}%</span>
        </span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            leaderRatio >= 70 ? 'bg-red-400' : 'bg-teal-400'
          }`}
          style={{ width: `${leaderRatio}%` }}
        />
      </div>

      {leaderRatio >= 70 && isRecording && (
        <p className="text-xs text-red-500">리더 발화 비율이 높습니다 (권장 40%)</p>
      )}

      <button
        onClick={connected ? undefined : connect}
        className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        {connected ? 'LED 연결됨' : 'LED 연결'}
      </button>
    </div>
  );
}
