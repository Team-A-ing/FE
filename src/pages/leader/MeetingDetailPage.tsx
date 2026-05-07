import { useState, useCallback } from "react";
import { useMeetingStore } from "@/stores/meetingStore";
import { useRecorder } from "@/features/meeting/useRecorder";
import { useUploadRecording } from "@/features/meeting/useUploadRecording";
import StartMeetingModal from "@/components/ui/StartMeetingModal";
import EndMeetingModal from "@/components/ui/EndMeetingModal";
import RecordingFloatingBar from "@/components/ui/RecordingFloatingBar";
import AnalysisLoading from "@/components/loading/AnalysisLoading";

export default function MeetingDetailPage() {
  const { meetings, currentMeetingId, getCurrentMeeting, updateMeetingStatus, setRecordingDuration } =
    useMeetingStore();
  const { isCreateModalOpen, setCreateModalOpen } = useMeetingStore(); // 전역 상태 사용
  const meeting = getCurrentMeeting();
  const recorder = useRecorder();
  const { upload } = useUploadRecording();
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const isLeader = meeting?.myRole === "leader";

  const handleStartRecording = useCallback(async () => {
    await recorder.start();
    if (meeting) updateMeetingStatus(meeting.id, "recording");
  }, [meeting, recorder, updateMeetingStatus]);

  const handleEndMeeting = useCallback(() => {
    if (!meeting) return;
    setRecordingDuration(meeting.id, recorder.elapsed);
    recorder.stop();
    updateMeetingStatus(meeting.id, "analyzing");
    setShowEnd(false);

    // 녹음 Blob → BE 업로드
    setTimeout(() => {
      const blob = recorder.getBlob();
      if (blob) upload(meeting.id, blob);
    }, 500);
  }, [meeting, recorder, updateMeetingStatus, setRecordingDuration, upload]);

  // 1. 진행 중인 미팅이 없을 때 (목록 화면)
  if (!meeting) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">1on1 미팅</h1>
          <button
            // 4. 클릭 시 전역 상태를 true로 변경
            onClick={() => setCreateModalOpen(true)} 
            className="px-5 py-2.5 rounded-lg text-sm text-white bg-[#5F74FA] hover:bg-[#4E62E6]"
          >
            새 1on1 만들기
          </button>
        </div>

        <section className="mb-8">
          <h2 className="font-semibold mb-4">예정된 미팅</h2>
          {meetings.filter((m) => m.status === "pending").length === 0 ? (
            <p className="text-sm text-gray-400">예정된 미팅이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {meetings
                .filter((m) => m.status === "pending")
                .map((m) => (
                  <div key={m.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{m.partner.name}</span>
                      <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                        {m.date}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // 2. 분석 중인 상태일 때
  if (meeting.status === "analyzing") {
    return (
      <div className="flex-1 flex flex-col">
        <MeetingHeader meeting={meeting} />
        <AnalysisLoading role={meeting.myRole} recordingDuration={meeting.recordingDuration} />
      </div>
    );
  }

  // 3. 미팅 대기 중이거나 녹음 중일 때 (상세 화면)
  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        <MeetingHeader meeting={meeting} />

        <div className="flex-1 px-8 py-6 overflow-auto">
          <section className="mb-8">
            <h3 className="text-base font-bold flex items-center gap-2 mb-3">📋 미팅 프렙</h3>
            <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-400">
              {isLeader ? "멤버의 미팅 프렙을 기다리고 있어요." : (
                <div>
                  <p className="mb-3">아직 프렙을 공유하지 않았어요. 작성을 완료해주세요.</p>
                  <button className="px-4 py-2 rounded-lg border border-[#5F74FA] text-[#5F74FA] text-sm hover:bg-[#5F74FA]/5">
                    ✏️ 이어 작성하기
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold flex items-center gap-2">💬 질문</h3>
              {isLeader && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs hover:bg-gray-50">✨ AI 질문 생성</button>
                  <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs hover:bg-gray-50">📋 템플릿 불러오기</button>
                </div>
              )}
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <input className="w-full text-sm text-gray-400 outline-none" placeholder="질문을 입력해주세요." readOnly />
            </div>
          </section>
        </div>

        {!recorder.isRecording && isLeader && meeting.status === "pending" && (
          <div className="border-t border-gray-200 px-8 py-4 flex justify-center">
            <button
              onClick={() => setShowStart(true)}
              className="px-8 py-3 rounded-full text-white font-medium bg-[#5F74FA] hover:bg-[#4E62E6] shadow-lg shadow-[#5F74FA]/30 transition-all"
            >
              1on1 미팅 시작하기
            </button>
          </div>
        )}
      </div>

      <div className="w-[280px] border-l border-gray-200 p-6 flex flex-col gap-6">
        <div>
          <h4 className="font-semibold text-sm mb-2">나만의 노트 🔒</h4>
          <textarea className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-[#4E62E6]" placeholder="나만 볼 수 있는 메모입니다." />
        </div>
      </div>

      <StartMeetingModal isOpen={showStart} onClose={() => setShowStart(false)} onStart={handleStartRecording} />
      <EndMeetingModal isOpen={showEnd} onClose={() => setShowEnd(false)} onEnd={handleEndMeeting} />
      <RecordingFloatingBar
        isRecording={recorder.isRecording}
        elapsed={recorder.elapsed}
        audioLevel={recorder.audioLevel}
        isLeader={isLeader}
        onEndClick={() => setShowEnd(true)}
      />
    </div>
  );
}

function MeetingHeader({ meeting }: { meeting: any }) {
  const dateStr = new Date(meeting.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  const leaderName = meeting.myRole === "leader" ? "나" : meeting.partner.name;
  const memberName = meeting.myRole === "member" ? "나" : meeting.partner.name;

  return (
    <div className="px-8 py-4 border-b border-gray-200">
      <h1 className="text-xl font-bold">{dateStr}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <span className="w-6 h-6 rounded-full bg-[#5F74FA] flex items-center justify-center text-white text-xs">{leaderName[0]}</span>
        <span>{leaderName} (리더)</span>
        <span className="text-gray-300">↔</span>
        <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs">{memberName[0]}</span>
        <span>{memberName}</span>
      </div>
    </div>
  );
}