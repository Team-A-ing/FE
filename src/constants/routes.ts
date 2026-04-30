export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',

  LEADER_DASHBOARD: '/leader/dashboard',
  LEADER_MEETING: (meetingId: string) => `/leader/meeting/${meetingId}`,
  LEADER_PROMISES: '/leader/promises',

  MEMBER_DASHBOARD: '/member/dashboard',
  MEMBER_MEETING: (meetingId: string) => `/member/meeting/${meetingId}`,
  MEMBER_SURVEY: (meetingId: string) => `/member/survey/${meetingId}`,
} as const
