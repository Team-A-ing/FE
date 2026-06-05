import { useEffect } from 'react';
import { useIoTTalkRatio } from '@/features/meeting/useIoTTalkRatio';

interface Props {
  meetingId: string | undefined;
  isRecording?: boolean;
}

export default function IotPanel({ meetingId, isRecording }: Props) {
  const { state, connectSerial, disconnectSerial, startVAD, stop } = useIoTTalkRatio(meetingId);

  // 녹음 시작 시 자동으로 VAD 측정 시작
  useEffect(() => {
    if (isRecording) {
      startVAD();
    } else {
      stop();
    }
  }, [isRecording]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">발화 비율</p>

      {/* LED 상태 + 비율 */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${
            isRecording
              ? state.ledColor === 'RED' ? 'bg-red-500 animate-pulse' : 'bg-green-500'
              : 'bg-gray-300'
          }`}
        />
        <span className="text-sm text-gray-700">
          리더 <span className="font-semibold">{state.leaderRatio}%</span>
          {' / '}
          멤버 <span className="font-semibold">{100 - state.leaderRatio}%</span>
        </span>
      </div>

      {/* 진행바 */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            state.leaderRatio >= 70 ? 'bg-red-400' : 'bg-teal-400'
          }`}
          style={{ width: `${state.leaderRatio}%` }}
        />
      </div>

      {state.leaderRatio >= 70 && isRecording && (
        <p className="text-xs text-red-500">리더 발화 비율이 높습니다 (권장 40%)</p>
      )}

      {/* LED 연결 버튼 — 작게 하단에 */}
      <button
        onClick={state.connected ? disconnectSerial : connectSerial}
        className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
        {state.connected ? 'LED 연결 해제' : 'LED 연결'}
      </button>
    </div>
  );
}
