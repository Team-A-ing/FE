export type PromiseStatus = 'pending' | 'done' | 'missed'
export type PromiseOwner = 'leader' | 'member'
export type LeaderPromiseStatus = 'PENDING' | 'DONE' | 'MISSED'
export type LeaderPromiseCategory = 'RESOURCE' | 'TEAM_BUILDING' | 'RECOGNITION' | 'PROCESS'

export interface MeetingPromise {
  id: string
  meetingId: string
  owner: PromiseOwner
  content: string
  dueDate?: string
  status: PromiseStatus
}

export interface OverduePromise {
  promiseId: number
  content: string
  category: LeaderPromiseCategory
  dueDate: string
  status: LeaderPromiseStatus
  fromMeetingRound: number
  memberName: string
}
