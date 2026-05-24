import type { TalkRatio } from '@/types/report';

interface Props {
  data: TalkRatio;
}

export default function TalkRatioSection({ data }: Props) {
  const { leaderRatio, memberRatio, recommendedLeaderRatio } = data;
  const isOverTalking = leaderRatio > recommendedLeaderRatio;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        발화 비율
      </h3>
      <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-4">
        {/* Split bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>리더 {leaderRatio}%</span>
            <span>멤버 {memberRatio}%</span>
          </div>
          <div className="relative w-full h-4 rounded-full bg-gray-100 overflow-visible">
            <div
              className="h-full rounded-l-full bg-[#5F74FA] transition-all"
              style={{ width: `${leaderRatio}%` }}
            />
            {/* Recommended leader ratio marker */}
            <div
              className="absolute top-0 h-4 w-0.5 bg-orange-400 rounded"
              style={{ left: `${recommendedLeaderRatio}%` }}
              title={`권장 리더 비율: ${recommendedLeaderRatio}%`}
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="inline-block w-2 h-2 rounded-sm bg-orange-400" />
            <span>권장 리더 비율 {recommendedLeaderRatio}%</span>
          </div>
        </div>

        {/* Warning */}
        {isOverTalking && (
          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <span className="text-yellow-500 text-sm flex-shrink-0">⚠️</span>
            <p className="text-xs text-yellow-700">
              리더 발화 비율({leaderRatio}%)이 권장({recommendedLeaderRatio}%)보다 높습니다.
              멤버가 더 많이 발언할 수 있도록 열린 질문을 활용해 보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
