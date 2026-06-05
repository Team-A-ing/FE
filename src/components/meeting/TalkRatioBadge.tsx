interface Props {
  leaderRatio: number | null;
  calibrationState: 'idle' | 'leader' | 'member' | 'done';
}

export default function TalkRatioBadge({ leaderRatio, calibrationState }: Props) {
  if (calibrationState === 'leader') {
    return (
      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
        리더님 먼저 인사해 주세요...
      </div>
    );
  }
  if (calibrationState === 'member') {
    return (
      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
        멤버님 이어서 인사해 주세요...
      </div>
    );
  }
  if (calibrationState !== 'done' || leaderRatio === null) return null;

  const isHigh = leaderRatio >= 70;
  return (
    <div className={`rounded-full px-4 py-2 text-sm font-bold text-white ${isHigh ? 'bg-red-500' : 'bg-green-500'}`}>
      리더 발화 {leaderRatio}%
    </div>
  );
}
