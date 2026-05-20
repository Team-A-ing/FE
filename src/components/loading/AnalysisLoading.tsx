import { useNavigate } from "react-router-dom";
import { ANALYSIS_STEPS, WITTY_COPIES } from "./loadingCopies";
import { useMeetingStatus } from "@/features/meeting/useMeetingStatus";
import type { AnalysisStep } from "@/types/meeting";

interface Props {
  role: "leader" | "member";
  recordingDuration?: number;
  meetingId: string;
}

function formatDuration(s?: number) {
  if (!s) return "00:00:00";
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export default function AnalysisLoading({ role, recordingDuration, meetingId }: Props) {
  const navigate = useNavigate();
  const { status, error } = useMeetingStatus(meetingId, true);
  const copies = WITTY_COPIES[role];

  const progress = status?.progress ?? 0;
  const displayStep = Math.min(3, Math.max(0, (status?.stepNumber ?? 1) - 1)) as AnalysisStep;
  const isCompleted = status?.step === 'COMPLETED';

  const r = 42;
  const circ = 2 * Math.PI * r;

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
        <p className="text-base font-semibold text-red-500">{error}</p>
        <button
          onClick={() => navigate('/leader/meetings')}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
        <p className="text-lg font-bold text-[#5F74FA]">분석이 완료되었습니다! 🎉</p>
        <button
          onClick={() => navigate('/leader/meetings')}
          className="px-5 py-2.5 rounded-lg bg-[#5F74FA] text-sm text-white font-medium hover:bg-[#4E62E6]"
        >
          결과 보러 가기
        </button>
      </div>
    );
  }

  const wittyMessage = status?.wittyMessage?.[role] ?? copies[displayStep];

  return (
    <div className="flex-1 flex flex-col">
      {/* 상단 탭 */}
      <div className="border-b border-gray-200 px-8 py-4">
        <p className="text-sm text-gray-500">🎙️ 녹음 완료 {formatDuration(recordingDuration)}</p>
        <div className="flex gap-4 mt-4 -mb-[1px]">
          {["미팅 본문", "요약", "분석"].map((tab, i) => (
            <button
              key={tab}
              className={`pb-2 text-sm font-medium ${
                i === 0
                  ? "border-b-2 border-[#5F74FA] text-[#5F74FA]"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 안내 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 m-3">
        <h2 className="text-lg font-bold text-[#5F74FA] mb-2">
          1on1 미팅 분석중
        </h2>
        <p className="text-sm text-gray-500 text-center mb-1">
          약 3분의 시간이 소요되며, 브라우저·서버 환경에 따라 조금 더 지체될 수 있습니다.
        </p>
        <p className="text-sm text-gray-500 text-center mb-4">
          분석이 완료되면 우측 하단 알림으로 알려드릴게요!
        </p>
        <p className="text-sm text-yellow-600 font-semibold mb-6">
          화면을 나가시지 말고 대기해주세요!
        </p>
        <p className="text-xs text-gray-400">
          새로고침을 하지 않도록 주의해주세요! 다른 탭을 열어 업무를 보시는 것은 괜찮아요!
        </p>
      </div>

      {/* 하단 프로그레스 카드 */}
      <div className="border-t border-gray-200 p-6">
        <div className="max-w-md mx-auto">
          {/* 원형 프로그레스 */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r={r} fill="none" stroke="#8B5CF6" strokeWidth="8"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - progress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#8B5CF6]">{Math.round(progress)}</span>
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
            <p className="font-semibold text-sm">
              {ANALYSIS_STEPS[displayStep].icon} {status?.stepLabel ?? ANALYSIS_STEPS[displayStep].label}
            </p>
            <p className="text-xs text-gray-400">
              Step {displayStep + 1} / {status?.totalSteps ?? 4}
            </p>
          </div>

          {/* 단계 리스트 */}
          <div className="space-y-3 mb-6">
            {ANALYSIS_STEPS.map((s, i) => {
              const active = i === displayStep;
              const done = i < displayStep;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                    active
                      ? "border-[#5F74FA] bg-white shadow-sm"
                      : done
                        ? "border-green-200 bg-green-50"
                        : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        active
                          ? "bg-[#5F74FA] text-white"
                          : done
                            ? "bg-green-400 text-white"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {done ? "✓" : s.icon}
                    </div>
                    <span className={`text-sm ${active ? "font-medium text-gray-800" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {active && <span className="text-xs text-[#5F74FA] font-medium">진행 중</span>}
                  {done && <span className="text-xs text-green-500 font-medium">완료</span>}
                </div>
              );
            })}
          </div>

          {/* 위트 카피 */}
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 italic">{wittyMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
