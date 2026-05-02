export type PromiseStatus = 'pending' | 'done' | 'missed'
export type PromiseOwner = 'leader' | 'member'

export interface MeetingPromise {
  id: string
  meetingId: string
  owner: PromiseOwner
  content: string
  dueDate?: string
  status: PromiseStatus
}
