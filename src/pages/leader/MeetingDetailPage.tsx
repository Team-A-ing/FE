import { useState, useCallback, useEffect, useRef } from "react";
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
import LeaderReportView from "@/components/report/LeaderReportView";
import PreBriefingCard from "@/components/meeting/PreBriefingCard";
import { usePreBriefing } from "@/features/meeting/usePreBriefing";
import { useSurveyCompletion } from "@/features/meeting/useSurveyCompletion";

type LocalStatus = "pending" | "recording" | "uploading" | "analyzing" | "completed" | "error";

export default function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingDetail(meetingId);
  const { data: briefing, loading: briefingLoading, error: briefingError, retry: retryBriefing } = usePreBriefing(meetingId);
  const recorder = useRecorder();
  const { upload } = useUploadRecording();
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [localStatus, setLocalStatus] = useState<LocalStatus>("pending");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pendingUploadRef = useRef<{ blob: Blob; durationSec: number } | null>(null);
  const { completed: surveyCompleted } = useSurveyCompletion(
    meetingId,
    !loading && !error && localStatus === "pending",
  );

  useEffect(() => {
    if (meeting?.status === "ANALYZING" || meeting?.status === "TRANSCRIBING") {
      setLocalStatus("analyzing");
    }
    if (meeting?.status === "COMPLETED") {
      setLocalStatus("completed");
    }
  }, [meeting?.status]);

  const handleStartRecording = useCallback(async () => {
    await recorder.start();
    setLocalStatus("recording");
  }, [recorder]);

  const performUpload = useCallback(async (id: string, blob: Blob, durationSec: number) => {
    setLocalStatus("uploading");
    setUploadError(null);
    try {
      await upload(id, blob, durationSec);
      setLocalStatus("analyzing");
    } catch (e) {
      const msg = e instanceof Error ? e.message : '업로드에 실패했습니다.';
      setUploadError(msg);
      setLocalStatus("error");
    }
  }, [upload]);

  const handleEndMeeting = useCallback(async () => {
    if (!meetingId) return;
    setShowEnd(false);
    const { blob, durationSec } = await recorder.stop();
    pendingUploadRef.current = { blob, durationSec };
    await performUpload(meetingId, blob, durationSec);
  }, [meetingId, recorder, performUpload]);

  const handleRetry = useCallback(async () => {
    if (!meetingId || !pendingUploadRef.current) return;
    const { blob, durationSec } = pendingUploadRef.current;
    await performUpload(meetingId, blob, durationSec);
  }, [meetingId, performUpload]);

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

  if (localStatus === "uploading") {
    return (
      <PageLayout>
        <div className="flex flex-col h-full">
          <MeetingHeader meeting={meeting} />
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4 pb-32">
            <div className="w-10 h-10 border-4 border-[#5F74FA] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">녹음 파일을 업로드 중입니다...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (localStatus === "error") {
    return (
      <PageLayout>
        <div className="flex flex-col">
          <MeetingHeader meeting={meeting} />
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
            <p className="text-base font-semibold text-red-500">
              {uploadError ?? '오류가 발생했습니다.'}
            </p>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-lg bg-[#5F74FA] text-sm text-white font-medium hover:bg-[#4E62E6]"
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate('/leader/meetings')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            >
              목록으로 돌아가기
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
          <AnalysisLoading
            role="leader"
            recordingDuration={recorder.elapsed}
            meetingId={meetingId!}
            onCompleted={() => setLocalStatus("completed")}
          />
        </div>
      </PageLayout>
    );
  }

  if (localStatus === "completed") {
    return (
      <PageLayout>
        <div className="flex flex-col h-full">
          <MeetingHeader meeting={meeting} />
          <LeaderReportView meetingId={meetingId!} />
        </div>
      </PageLayout>
    );
  }

  const surveyDone = surveyCompleted || meeting.surveySubmitted === true;

  return (
    <PageLayout>
      <div className="flex h-full">
        <div className="flex-1 flex flex-col h-full">
          <MeetingHeader meeting={meeting} />

          {!recorder.isRecording && localStatus === "pending" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 py-8 pb-32">
              {briefingLoading && (
                <div className="w-full max-w-[560px] rounded-xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
                  <div className="h-5 w-40 rounded bg-gray-100" />
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <div className="h-20 rounded-lg bg-gray-100" />
                    <div className="h-20 rounded-lg bg-gray-100" />
                    <div className="h-20 rounded-lg bg-gray-100" />
                  </div>
                  <div className="mt-4 h-16 rounded-lg bg-gray-100" />
                </div>
              )}
              {!briefingLoading && briefing && <PreBriefingCard data={briefing} />}
              {!briefingLoading && briefingError && (
                <div className="w-full max-w-[560px] rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                  <div className="flex items-center justify-between gap-4">
                    <span>{briefingError}</span>
                    <button
                      type="button"
                      onClick={retryBriefing}
                      className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}
              <div className={`text-center text-sm ${surveyDone ? 'text-[#5F74FA]' : 'text-gray-400'}`}>
                {surveyDone ? (
                  <>
                    <p className="font-medium">멤버의 사전 서베이가 완료되었습니다.</p>
                    <p>미팅을 시작할 수 있습니다.</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">멤버의 사전 서베이가 완료되지 않았습니다.</p>
                    <p>멤버의 사전 서베이가 완료된 후 미팅을 시작할 수 있습니다.</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowStart(true)}
                disabled={!surveyDone}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  surveyDone
                    ? 'text-white bg-[#5F74FA] hover:bg-[#4E62E6] shadow-lg shadow-[#5F74FA]/30'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              >
                1on1 미팅 시작하기
              </button>
              {import.meta.env.VITE_SKIP_RECORDING === 'true' && surveyDone && (
                <label className="mt-2 cursor-pointer px-6 py-2 rounded-full border border-dashed border-gray-400 text-sm text-gray-500 hover:border-[#5F74FA] hover:text-[#5F74FA] transition-colors">
                  [테스트] 파일 선택해서 업로드
                  <input
                    type="file"
                    accept="audio/*,.webm"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && meetingId) performUpload(meetingId, file, 0);
                    }}
                  />
                </label>
              )}
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
    <div className="px-8 pt-6 pb-4 border-b border-gray-200">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">{meeting.memberName}님과의 {meeting.round}회차 1on1</h1>
        <span className="text-sm text-gray-400">{dateStr}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
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
