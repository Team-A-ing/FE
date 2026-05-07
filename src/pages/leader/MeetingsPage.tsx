import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useMeetingStore } from "@/stores/meetingStore";
import type { MeetingData } from "@/types/meeting";
import { ROUTES } from "@/constants/routes";

const statusMap: Record<MeetingData["status"], { label: string; badge: string }> = {
  pending: { label: "대기 중", badge: "bg-yellow-100 text-yellow-700" },
  recording: { label: "녹음 중", badge: "bg-blue-100 text-blue-700" },
  analyzing: { label: "분석 중", badge: "bg-purple-100 text-purple-700" },
  completed: { label: "완료", badge: "bg-emerald-100 text-emerald-700" },
};

const actionItems = [
  { id: "a1", title: "지난 회의 액션 리뷰", description: "지난 1on1에서 약속한 실행 항목을 확인하세요." },
  { id: "a2", title: "이번 주 목표 설정", description: "다음 미팅까지 달성할 목표를 정리하세요." },
  { id: "a3", title: "피드백 정리", description: "직접적인 피드백을 메모하고 공유하세요." },
];

export default function MeetingsPage() {
  const meetings = useMeetingStore((s) => s.meetings);
  const setCreateModalOpen = useMeetingStore((s) => s.setCreateModalOpen);
  const navigate = useNavigate();

  const sortedMeetings = useMemo(
    () => [...meetings].sort((a, b) => a.date.localeCompare(b.date)),
    [meetings]
  );

  const nextMeeting = sortedMeetings.find((m) => m.status === "pending");
  const historyMeetings = sortedMeetings.filter((m) => m.id !== nextMeeting?.id);
  const uniqueMembers = useMemo(
    () =>
      Array.from(
        new Map(meetings.map((m) => [m.partner.id, m.partner])).values()
      ),
    [meetings]
  );

  return (
    <PageLayout>
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold">1on1 미팅</h1>
            <p className="text-sm text-gray-500 mt-1">
              전체 1on1 미팅 현황을 한눈에 보고, 개별 미팅으로 바로 이동할 수 있어요.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-[#5F74FA] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4E62E6]"
          >
            새 1on1 만들기
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">예정된 미팅</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">다음 1on1 일정</h2>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  총 {meetings.length}개
                </span>
              </div>

              {nextMeeting ? (
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.LEADER_MEETING(nextMeeting.id))}
                  className="mt-6 w-full rounded-3xl border border-blue-100 bg-blue-50 p-6 text-left text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-100"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{nextMeeting.date}</p>
                      <h3 className="mt-2 text-xl font-semibold text-gray-900">
                        {nextMeeting.partner.name}님과의 1on1
                      </h3>
                      <p className="mt-3 text-sm text-gray-600">
                        {nextMeeting.myRole === "leader" ? "내가 리더" : "내가 멤버"}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusMap[nextMeeting.status].badge}`}>
                      {statusMap[nextMeeting.status].label}
                    </span>
                  </div>
                </button>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                  예정된 미팅이 없습니다.
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">내 미팅 기록</h3>
                  <p className="text-sm text-gray-500">최근 1on1 이력을 확인할 수 있어요.</p>
                </div>
                <span className="text-sm text-gray-500">총 {historyMeetings.length}건</span>
              </div>

              {historyMeetings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                  아직 기록된 미팅이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {historyMeetings.map((meeting) => (
                    <button
                      key={meeting.id}
                      type="button"
                      onClick={() => navigate(ROUTES.LEADER_MEETING(meeting.id))}
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-gray-300 hover:bg-gray-100"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{meeting.partner.name}</p>
                          <h4 className="text-base font-semibold text-gray-900">
                            {meeting.date}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMap[meeting.status].badge}`}>
                            {statusMap[meeting.status].label}
                          </span>
                          <span className="text-sm text-gray-500">{meeting.myRole === "leader" ? "내가 리더" : "내가 멤버"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">1on1 멤버</h3>
                  <p className="text-sm text-gray-500">이번 달에 만나야 할 멤버를 확인해보세요.</p>
                </div>
                <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  + 추가
                </button>
              </div>

              {uniqueMembers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  아직 추가된 멤버가 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {uniqueMembers.map((member) => (
                    <div key={member.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">액션 아이템</h3>
                <p className="text-sm text-gray-500">다음에 챙겨야 할 액션을 미리 확인하세요.</p>
              </div>

              <div className="space-y-3">
                {actionItems.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
