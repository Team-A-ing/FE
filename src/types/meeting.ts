export type MeetingStatus = 'pending' | 'recording' | 'uploading' | 'analyzing' | 'done' | 'error'

export interface Meeting {
  id: string
  leaderId: string
  memberId: string
  scheduledAt: string
  status: MeetingStatus
  recordingUrl?: string
}
