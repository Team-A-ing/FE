export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  LEADER_DASHBOARD: '/leader/dashboard',
  LEADER_MEETING: (id: string) => `/leader/meeting/${id}`,
  LEADER_PROMISES: '/leader/promises',
  MEMBER_DASHBOARD: '/member/dashboard',
  MEMBER_MEETING: (id: string) => `/member/meeting/${id}`,
  MEMBER_REPORT: (id: string) => `/member/meeting/${id}/report`,
  MEMBER_SURVEY: (id: string) => `/member/survey/${id}`,
} as const;
