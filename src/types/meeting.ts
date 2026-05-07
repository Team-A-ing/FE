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