import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import LeaderDashboard from '@/pages/leader/LeaderDashboard'
import MeetingDetailPage from '@/pages/leader/MeetingDetailPage'
import PromiseLedgerPage from '@/pages/leader/PromiseLedgerPage'
import MemberDashboard from '@/pages/member/MemberDashboard'
import MeetingFeedbackPage from '@/pages/member/MeetingFeedbackPage'
import SurveyPage from '@/pages/member/SurveyPage'
import { ROUTES } from '@/constants/routes'

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN,                          element: <LoginPage /> },
  { path: ROUTES.SIGNUP,                         element: <SignupPage /> },
  { path: ROUTES.LEADER_DASHBOARD,               element: <LeaderDashboard /> },
  { path: '/leader/meeting/:meetingId',          element: <MeetingDetailPage /> },
  { path: ROUTES.LEADER_PROMISES,               element: <PromiseLedgerPage /> },
  { path: ROUTES.MEMBER_DASHBOARD,              element: <MemberDashboard /> },
  { path: '/member/meeting/:meetingId',          element: <MeetingFeedbackPage /> },
  { path: '/member/survey/:meetingId',           element: <SurveyPage /> },
])
