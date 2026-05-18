export type MeetingStatus = 'pending' | 'recording' | 'uploading' | 'analyzing' | 'done' | 'error'

export interface Meeting {
  id: string
  leaderId: string
  memberId: string
  scheduledAt: string
  status: MeetingStatus
  recordingUrl?: string
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface MeetingData {
  id: string;
  date: string;
  partner: TeamMember;
  partnerRole: "leader" | "member";
  myRole: "leader" | "member";
  status: "pending" | "recording" | "analyzing" | "completed";
  recordingDuration?: number;
}

export type AnalysisStep = 0 | 1 | 2 | 3;

export interface MeetingDetail {
  meetingId: number;
  round: number;
  scheduledAt: string;          // ISO 8601, 예: "2026-05-08T14:00:00"
  durationSec: number | null;
  status: "PENDING" | "RECORDING" | "ANALYZING" | "COMPLETED";
  leaderName: string;
  memberName: string;
}