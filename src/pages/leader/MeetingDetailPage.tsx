import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useChunkedRecorder } from "@/features/meeting/useChunkedRecorder";
import { useTalkRatioStream } from "@/features/meeting/useTalkRatioStream";
import TalkRatioBadge from "@/components/meeting/TalkRatioBadge";
import { useUploadRecording } from "@/features/meeting/useUploadRecording";
import { useMeetingDetail } from "@/features/meeting/useMeetingDetail";
import StartMeetingModal from "@/components/ui/StartMeetingModal";
import EndMeetingModal from "@/components/ui/EndMeetingModal";
import RecordingFloatingBar from "@/components/ui/RecordingFloatingBar";
import AnalysisLoading from "@/components/loading/AnalysisLoading";
import type { MeetingDetail } from "@/types/meeting";
import LeaderReportView from "@/components/report/LeaderReportView";
import IotPanel from "@/components/iot/IotPanel";
import PreBriefingCard from "@/components/meeting/PreBriefingCard";
import { usePreBriefing } from "@/features/meeting/usePreBriefing";
import { useSurveyCompletion } from "@/features/meeting/useSurveyCompletion";
import { useMemberChecklist } from "@/features/meeting/useMemberChecklist";
import type { MemberInsightActionPlan, MemberInsightPromise } from "@/types/memberInsight";

type LocalStatus = "pending" | "recording" | "uploading" | "analyzing" | "completed" | "error";

export default function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingDetail(meetingId);
  const { data: briefing, loading: briefingLoading, error: briefingError, retry: retryBriefing } = usePreBriefing(meetingId);
  const recorder = useChunkedRecorder(meetingId ? Number(meetingId) : 0);
  const { upload } = useUploadRecording();
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [localStatus, setLocalStatus] = useState<LocalStatus>("pending");
  const ratio = useTalkRatioStream(localStatus === "recording" ? (meetingId ? Number(meetingId) : null) : null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pendingUploadRef = useRef<{ blob: Blob; durationSec: number } | null>(null);
  const { completed: surveyCompleted } = useSurveyCompletion(
    meetingId,
    !loading && !error && localStatus === "pending",
  );
  const checklist = useMemberChecklist(meeting?.memberId);
  // 미팅 화면 진입 시점에 '미완료'였던 항목만 패널에 고정 노출 — 체크해도 사라지지 않고 완료 표시로 남는다.
  const checklistPlans = checklist.outstanding
    ? checklist.actionPlans.filter((p) => checklist.outstanding!.plans.has(p.planId))
    : [];
  const checklistPromises = checklist.outstanding
    ? checklist.promises.filter((p) => checklist.outstanding!.promises.has(p.promiseId))
    : [];

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
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
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
            <div className="border-t border-gray-200 px-8 py-6 flex flex-col items-center gap-3">
              <TalkRatioBadge leaderRatio={ratio?.leaderRatio ?? null} calibrationState={recorder.calibrationState} />
              <span className="text-sm font-medium text-[#5F74FA]">🎙 녹음 중입니다</span>
              <span className="text-xs text-gray-400">아래 플로팅 바에서 미팅을 종료할 수 있습니다.</span>
            </div>
          )}
        </div>

        <div className="w-[320px] border-l border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <MeetingChecklist
            loading={checklist.loading}
            error={checklist.error}
            plans={checklistPlans}
            promises={checklistPromises}
            onTogglePlan={checklist.toggleActionPlan}
            onTogglePromise={checklist.togglePromise}
          />
          <MeetingNotes meetingId={meetingId!} />
          <IotPanel ratio={ratio} isRecording={localStatus === 'recording'} />
        </div>

        <StartMeetingModal isOpen={showStart} onClose={() => setShowStart(false)} onStart={handleStartRecording} />
        <EndMeetingModal isOpen={showEnd} onClose={() => setShowEnd(false)} onEnd={handleEndMeeting} />
        <RecordingFloatingBar
          isRecording={recorder.isRecording}
          elapsed={recorder.elapsed}
          audioLevel={0}
          isLeader={true}
          onEndClick={() => setShowEnd(true)}
        />
      </div>
    </PageLayout>
  );
}

function MeetingChecklist({
  loading,
  error,
  plans,
  promises,
  onTogglePlan,
  onTogglePromise,
}: {
  loading: boolean;
  error: string | null;
  plans: MemberInsightActionPlan[];
  promises: MemberInsightPromise[];
  onTogglePlan: (planId: number, nextCompleted: boolean) => void;
  onTogglePromise: (promiseId: number, nextDone: boolean) => void;
}) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">지난 미팅 체크</h4>
      <p className="text-xs text-gray-400 mb-3">이번 1on1에서 함께 확인하고 체크하세요.</p>

      {loading ? (
        <div className="space-y-2">
          <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
          <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      ) : error ? (
        <p className="text-xs text-gray-400">{error}</p>
      ) : plans.length === 0 && promises.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center text-xs text-gray-400">
          확인할 액션 플랜이나 약속이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-500">액션 플랜</p>
              <ul className="flex flex-col gap-1.5">
                {plans.map((p) => (
                  <ChecklistRow
                    key={`plan-${p.planId}`}
                    checked={p.isCompleted}
                    label={p.content}
                    caption={`${p.round}회차`}
                    onToggle={(next) => onTogglePlan(p.planId, next)}
                  />
                ))}
              </ul>
            </div>
          )}
          {promises.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-500">미이행 약속</p>
              <ul className="flex flex-col gap-1.5">
                {promises.map((p) => (
                  <ChecklistRow
                    key={`promise-${p.promiseId}`}
                    checked={p.status === "DONE"}
                    label={p.content}
                    caption={`${p.round}회차 · ${p.ownerType === "LEADER" ? "리더" : "멤버"}`}
                    onToggle={(next) => onTogglePromise(p.promiseId, next)}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChecklistRow({
  checked,
  label,
  caption,
  onToggle,
}: {
  checked: boolean;
  label: string;
  caption: string;
  onToggle: (next: boolean) => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-100 px-2.5 py-2 hover:bg-gray-50">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#5F74FA]"
        />
        <span className="min-w-0">
          <span className={`block text-sm leading-snug ${checked ? "text-gray-400 line-through" : "text-gray-800"}`}>
            {label}
          </span>
          <span className="text-[11px] text-gray-400">{caption}</span>
        </span>
      </label>
    </li>
  );
}

function MeetingNotes({ meetingId }: { meetingId: string }) {
  const storageKey = `meeting-note-${meetingId}`;
  const [note, setNote] = useState(() => localStorage.getItem(storageKey) ?? "");

  useEffect(() => {
    setNote(localStorage.getItem(storageKey) ?? "");
  }, [storageKey]);

  const handleChange = (value: string) => {
    setNote(value);
    localStorage.setItem(storageKey, value);
  };

  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">나만의 노트</h4>
      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-[#4E62E6]"
        placeholder="나만 볼 수 있는 메모입니다."
      />
    </div>
  );
}

function MeetingHeader({ meeting }: { meeting: MeetingDetail }) {
  const dateStr = meeting.scheduledAt
    ? new Date(meeting.scheduledAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : '일정 미정';

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
