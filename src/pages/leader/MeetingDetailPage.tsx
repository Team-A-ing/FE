import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useRecorder } from "@/features/meeting/useRecorder";
import { useUploadRecording } from "@/features/meeting/useUploadRecording";
import { useMeetingDetail } from "@/features/meeting/useMeetingDetail";
import StartMeetingModal from "@/components/ui/StartMeetingModal";
import EndMeetingModal from "@/components/ui/EndMeetingModal";
import RecordingFloatingBar from "@/components/ui/RecordingFloatingBar";
import AnalysisLoading from "@/components/loading/AnalysisLoading";
import type { MeetingDetail } from "@/types/meeting";

type LocalStatus = "pending" | "recording" | "analyzing";

export default function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingDetail(meetingId);
  const recorder = useRecorder();
  const { upload } = useUploadRecording();
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [localStatus, setLocalStatus] = useState<LocalStatus>("pending");

  useEffect(() => {
    if (meeting?.status === "ANALYZING" || meeting?.status === "RECORDING") {
      setLocalStatus(meeting.status.toLowerCase() as LocalStatus);
    }
  }, [meeting?.status]);

  const handleStartRecording = useCallback(async () => {
    await recorder.start();
    setLocalStatus("recording");
  }, [recorder]);

  const handleEndMeeting = useCallback(() => {
    recorder.stop();
    setLocalStatus("analyzing");
    setShowEnd(false);
    setTimeout(() => {
      const blob = recorder.getBlob();
      if (blob && meetingId) upload(meetingId, blob);
    }, 500);
  }, [recorder, meetingId, upload]);

  if (loading) {
    return (
      <PageLayout>
        <div className="p-8 text-sm text-gray-400">불러오는 중...</div>
      </PageLayout>
    );
  }

  if (error || !meeting) {
    return (
      <PageLayout>
        <div className="p-8">
          <div className="flex flex-col gap-4 items-start">
            <h1 className="text-xl font-bold">1on1 미팅</h1>
            <p className="text-sm text-gray-500">
              {error ?? "요청하신 미팅을 찾을 수 없습니다. 목록으로 돌아가서 다시 선택해주세요."}
            </p>
            <button
              onClick={() => navigate('/leader/meetings')}
              className="rounded-lg bg-[#5F74FA] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4E62E6]"
            >
              1on1 목록으로 이동
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (localStatus === "analyzing") {
    return (
      <PageLayout>
        <div className="flex flex-col">
          <MeetingHeader meeting={meeting} />
          <AnalysisLoading role="leader" recordingDuration={recorder.elapsed} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex">
        <div className="flex-1 flex flex-col">
          <MeetingHeader meeting={meeting} />

          {!recorder.isRecording && localStatus === "pending" && (
            <div className="border-t border-gray-200 px-8 py-4 flex justify-center">
              <button
                onClick={() => setShowStart(true)}
                className="px-8 py-3 rounded-full text-white font-medium bg-[#5F74FA] hover:bg-[#4E62E6] shadow-lg shadow-[#5F74FA]/30 transition-all"
              >
                1on1 미팅 시작하기
              </button>
            </div>
          )}
          {localStatus === "recording" && (
            <div className="border-t border-gray-200 px-8 py-6 flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-[#5F74FA]">🎙 녹음 중입니다</span>
              <span className="text-xs text-gray-400">아래 플로팅 바에서 미팅을 종료할 수 있습니다.</span>
            </div>
          )}
        </div>

        <div className="w-[280px] border-l border-gray-200 p-6 flex flex-col gap-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">나만의 노트</h4>
            <textarea
              className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-[#4E62E6]"
              placeholder="나만 볼 수 있는 메모입니다."
            />
          </div>
        </div>

        <StartMeetingModal isOpen={showStart} onClose={() => setShowStart(false)} onStart={handleStartRecording} />
        <EndMeetingModal isOpen={showEnd} onClose={() => setShowEnd(false)} onEnd={handleEndMeeting} />
        <RecordingFloatingBar
          isRecording={recorder.isRecording}
          elapsed={recorder.elapsed}
          audioLevel={recorder.audioLevel}
          isLeader={true}
          onEndClick={() => setShowEnd(true)}
        />
      </div>
    </PageLayout>
  );
}

function MeetingHeader({ meeting }: { meeting: MeetingDetail }) {
  const dateStr = new Date(meeting.scheduledAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-8 py-4 border-b border-gray-200">
      <h1 className="text-xl font-bold">{dateStr}</h1>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <span className="w-6 h-6 rounded-full bg-[#5F74FA] flex items-center justify-center text-white text-xs">
          {meeting.leaderName[0]}
        </span>
        <span>{meeting.leaderName} (리더)</span>
        <span className="text-gray-300">↔</span>
        <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs">
          {meeting.memberName[0]}
        </span>
        <span>{meeting.memberName}</span>
      </div>
    </div>
  );
}
