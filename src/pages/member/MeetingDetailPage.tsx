import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useMeetingDetail } from "@/features/meeting/useMeetingDetail";
import SurveyForm from "@/components/survey/SurveyForm";
import AnalysisLoading from "@/components/loading/AnalysisLoading";
import type { MeetingDetail } from "@/types/meeting";
import MemberReportPage from "@/pages/member/MemberReportPage";

export default function MemberMeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { meeting, loading, error } = useMeetingDetail(meetingId);

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
              {error ?? "요청하신 미팅을 찾을 수 없습니다."}
            </p>
            <button
              onClick={() => navigate('/member/dashboard')}
              className="rounded-lg bg-[#5F74FA] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4E62E6]"
            >
              대시보드로 이동
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (meeting.status === "ANALYZING") {
    return (
      <PageLayout>
        <div className="flex flex-col">
          <MeetingHeader meeting={meeting} />
          <AnalysisLoading role="member" meetingId={meetingId ?? ""} />
        </div>
      </PageLayout>
    );
  }

  if (meeting.status === "COMPLETED") {
    return <MemberReportPage />;
  }

  return (
    <PageLayout>
      <div className="flex flex-col">
        <MeetingHeader meeting={meeting} />
        <div className="bg-[#F7F8FA] px-5 py-8">
          <SurveyForm
            leaderName={meeting.leaderName}
            scheduledAt={meeting.scheduledAt}
            meetingId={meeting.meetingId}
          />
        </div>
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
        <span className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white text-xs" />
        <span>나</span>
      </div>
    </div>
  );
}
