import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import LeaderDashboard from '@/pages/leader/LeaderDashboard';
import MeetingDetailPage from '@/pages/leader/MeetingDetailPage';
import PromiseLedgerPage from '@/pages/leader/PromiseLedgerPage';
import MemberDashboard from '@/pages/member/MemberDashboard';
import MeetingFeedbackPage from '@/pages/member/MeetingFeedbackPage';
import SurveyPage from '@/pages/member/SurveyPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/leader/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/leader/dashboard', element: <LeaderDashboard /> },
  { path: '/leader/meetings', element: <LeaderDashboard /> },
  { path: '/leader/meeting/:meetingId', element: <MeetingDetailPage /> },
  { path: '/leader/promises', element: <PromiseLedgerPage /> },
  { path: '/leader/reports', element: <LeaderDashboard /> },
  { path: '/leader/9box', element: <LeaderDashboard /> },
  { path: '/leader/overview', element: <LeaderDashboard /> },
  { path: '/member/dashboard', element: <MemberDashboard /> },
  { path: '/member/meeting/:meetingId', element: <MeetingFeedbackPage /> },
  { path: '/member/survey/:meetingId', element: <SurveyPage /> },
  { path: '/settings', element: <LeaderDashboard /> },
  { path: '/invite', element: <LeaderDashboard /> },
]);

export default router;
