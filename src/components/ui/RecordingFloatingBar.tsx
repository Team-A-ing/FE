interface Props {
  isRecording: boolean;
  elapsed: number;
  audioLevel: number;
  isLeader: boolean;
  onEndClick: () => void;
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function RecordingFloatingBar({
  isRecording,
  elapsed,
  audioLevel,
  isLeader,
  onEndClick,
}: Props) {
  if (!isRecording) return null;

  const bars = Array.from({ length: 24 }, (_, i) => {
    const h = Math.max(4, Math.min(28, audioLevel * 220 * Math.sin((i + Date.now() / 180) * 0.5) + 8));
    return h;
  });

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white rounded-full shadow-lg border border-gray-200 px-6 py-3 flex items-center gap-5">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-medium text-gray-700">녹음 중</span>
      </div>

      <div className="flex items-end gap-[2px] h-7">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-full bg-[#5F74FA] transition-all duration-75"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <span className="text-sm font-mono text-gray-600 min-w-[48px]">{fmt(elapsed)}</span>

      {isLeader && (
        <button
          onClick={onEndClick}
          className="ml-2 px-5 py-2 rounded-full text-sm font-medium text-white bg-[#5F74FA] hover:bg-[#4E62E6] transition-colors"
        >
          1on1 미팅 종료하기
        </button>
      )}
    </div>
  );
}