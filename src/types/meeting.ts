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
  status: "pending" | "recording" | "uploading" | "analyzing" | "completed" | "error";
  recordingDuration?: number;
}

export type AnalysisStep = 0 | 1 | 2 | 3;

export type MeetingApiStatus = "CREATED" | "TRANSCRIBING" | "ANALYZING" | "COMPLETED" | "FAILED";

export interface MeetingDetail {
  meetingId: number;
  round: number;
  scheduledAt: string;
  durationSec: number | null;
  status: MeetingApiStatus;
  leaderName: string;
  memberName: string;
  surveySubmitted?: boolean;
}

export interface MeetingListItem {
  meetingId: number;
  round: number;
  partnerName: string;
  scheduledAt: string;
  durationSec: number | null;
  status: MeetingApiStatus;
}

export type MeetingQuadrant = 'STABLE' | 'SILENT_RISK' | 'EXPLICIT_RISK' | 'CONSERVATIVE';

export interface PendingPromise {
  promiseId: number;
  content: string;
  dueDate: string | null;
  overdue: boolean;
}

export interface PreBriefingData {
  meetingId: number;
  round: number;
  memberName: string;
  memberJobTitle: string;
  scheduledAt: string;
  coachingGuide?: {
    focusArea: string;
    guideSummary: string;
    evidence: string[];
    suggestedQuestions: string[];
  };
  survey: {
    submitted: boolean;
    energyLevel: number | null;
    issues: string[];
    desiredRoles: string[];
    surveyScore: number | null;
  };
  lastMeeting: {
    safetyScore: number;
    safetyScoreChange: number | null;
    quadrant: MeetingQuadrant | null;
    honestyGap: {
      direction: string;
      riskLevel: string;
    } | null;
    speechActAlerts: string[];
    blockerKeywords: string[];
  } | null;
  pendingPromises: PendingPromise[];
  recommendedTopics: string[];
}
