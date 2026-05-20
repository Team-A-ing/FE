import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import LeaderDashboard from '@/pages/leader/LeaderDashboard';
import MeetingsPage from '@/pages/leader/MeetingsPage';
import LeaderMeetingDetailPage from '@/pages/leader/MeetingDetailPage';
import PromiseLedgerPage from '@/pages/leader/PromiseLedgerPage';
import MemberDashboard from '@/pages/member/MemberDashboard';
import MemberMeetingDetailPage from '@/pages/member/MeetingDetailPage';
import SurveyPage from '@/pages/member/SurveyPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/leader/dashboard', element: <LeaderDashboard /> },
  { path: '/leader/meetings', element: <MeetingsPage /> },
  { path: '/leader/meeting/:meetingId', element: <LeaderMeetingDetailPage /> },
  { path: '/leader/promises', element: <PromiseLedgerPage /> },
  { path: '/leader/reports', element: <LeaderDashboard /> },
  { path: '/leader/overview', element: <LeaderDashboard /> },
  { path: '/member/dashboard', element: <MemberDashboard /> },
  { path: '/member/meeting/:meetingId', element: <MemberMeetingDetailPage /> },
  { path: '/member/survey/:meetingId', element: <SurveyPage /> },
  { path: '/settings', element: <LeaderDashboard /> },
  { path: '/invite', element: <LeaderDashboard /> },
]);

export default router;
