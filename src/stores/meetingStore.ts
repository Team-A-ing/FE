import { create } from "zustand";
import type { MeetingData, TeamMember } from "@/types/meeting";

interface MeetingState {
  meetings: MeetingData[];
  currentMeetingId: string | null;
  getCurrentMeeting: () => MeetingData | null;
  createMeeting: (partner: TeamMember, partnerRole: "leader" | "member", date: string) => MeetingData;
  updateMeetingStatus: (id: string, status: MeetingData["status"]) => void;
  setRecordingDuration: (id: string, duration: number) => void;
  isCreateModalOpen: boolean; // 추가
  setCreateModalOpen: (open: boolean) => void; // 추가
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  currentMeetingId: null,
  isCreateModalOpen: false,
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  getCurrentMeeting: () => {
    const { meetings, currentMeetingId } = get();
    return meetings.find((m) => m.id === currentMeetingId) ?? null;
  },

  createMeeting: (partner, partnerRole, date) => {
    const myRole = partnerRole === "leader" ? "member" : "leader";
    const meeting: MeetingData = {
      id: crypto.randomUUID(),
      date,
      partner,
      partnerRole,
      myRole,
      status: "pending",
    };
    set((s) => ({
      meetings: [...s.meetings, meeting],
      currentMeetingId: meeting.id,
    }));
    return meeting;
  },

  updateMeetingStatus: (id, status) =>
    set((s) => ({
      meetings: s.meetings.map((m) => (m.id === id ? { ...m, status } : m)),
    })),

  setRecordingDuration: (id, duration) =>
    set((s) => ({
      meetings: s.meetings.map((m) => (m.id === id ? { ...m, recordingDuration: duration } : m)),
    })),
}));