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

export type SummaryPromiseStatus = 'PENDING' | 'OVERDUE'

export interface PromiseSummaryItem {
  promiseId: string
  content: string
  context: string
  status: SummaryPromiseStatus
  createdAt: string
  round: number
  isCompleted: boolean
}

export interface MemberPromiseSummary {
  memberId: string
  memberName: string
  promises: PromiseSummaryItem[]
  stats: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
}

export interface PromiseReminderItem {
  promiseId: number
  content: string
  dueDate: string
  daysLeft: number
  memberName: string
  meetingTitle: string
}

export interface PromiseReminderData {
  overdue: PromiseReminderItem[]
  dueSoon: PromiseReminderItem[]
}
