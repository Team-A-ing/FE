import type { User } from '@/types/user'
import type { Meeting, MeetingStatus } from '@/types/meeting'
import type {
  RadarMember,
  BlockerWord,
  FeedbackCard,
  CareerMemoryItem,
  GapScore,
} from '@/types/analysis'
import type { MeetingPromise } from '@/types/promise'

// ---- 공통 래퍼 ----
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// ---- Auth ----
export interface LoginResponse {
  accessToken: string
  user: User
}

export interface SignupResponse {
  user: User
}

// ---- Meeting ----
export interface UploadRecordingResponse {
  meetingId: string
  status: MeetingStatus
}

export interface MeetingStatusResponse {
  meetingId: string
  status: MeetingStatus
  progress?: number // 0~100
}

// ---- Analysis ----
export interface AnalysisResultResponse {
  meetingId: string
  gapScore: GapScore
  feedbackCards: FeedbackCard[]
}

export interface TeamRadarResponse {
  teamId: string
  members: RadarMember[]
}

export interface TeamBlockerResponse {
  teamId: string
  blockers: BlockerWord[]
}

export interface CareerMemoryResponse {
  memberId: string
  timeline: CareerMemoryItem[]
}

// ---- Survey ----
export interface SurveyQuestion {
  id: string
  text: string
  type: 'scale' | 'text'
}

export interface SurveySubmitPayload {
  meetingId: string
  answers: { questionId: string; value: string | number }[]
}

// ---- Promise Ledger ----
export interface PromiseLedgerResponse {
  meetingId: string
  promises: MeetingPromise[]
}

// ---- Re-export domain types for convenience ----
export type { Meeting, User, MeetingPromise, FeedbackCard, CareerMemoryItem }
