import { createBrowserRouter, Navigate } from 'react-router-dom';
import RequiresTeam from '@/features/auth/RequiresTeam';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import LeaderDashboard from '@/pages/leader/LeaderDashboard';
import MeetingsPage from '@/pages/leader/MeetingsPage';
import LeaderMeetingDetailPage from '@/pages/leader/MeetingDetailPage';
import PromiseLedgerPage from '@/pages/leader/PromiseLedgerPage';
import TeamSetupPage from '@/pages/leader/TeamSetupPage';
import MemberDashboard from '@/pages/member/MemberDashboard';
import MemberMeetingDetailPage from '@/pages/member/MeetingDetailPage';
import MemberReportPage from '@/pages/member/MemberReportPage';
import SurveyPage from '@/pages/member/SurveyPage';
import TeamJoinPage from '@/pages/member/TeamJoinPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/leader/team-setup', element: <TeamSetupPage /> },
  { path: '/member/team-join', element: <TeamJoinPage /> },
  { path: '/leader/dashboard', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/leader/meetings', element: <RequiresTeam><MeetingsPage /></RequiresTeam> },
  { path: '/leader/meeting/:meetingId', element: <RequiresTeam><LeaderMeetingDetailPage /></RequiresTeam> },
  { path: '/leader/promises', element: <RequiresTeam><PromiseLedgerPage /></RequiresTeam> },
  { path: '/leader/reports', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/leader/overview', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/member/dashboard', element: <RequiresTeam><MemberDashboard /></RequiresTeam> },
  { path: '/member/meeting/:meetingId', element: <RequiresTeam><MemberMeetingDetailPage /></RequiresTeam> },
  { path: '/member/meeting/:meetingId/report', element: <RequiresTeam><MemberReportPage /></RequiresTeam> },
  { path: '/member/survey/:meetingId', element: <RequiresTeam><SurveyPage /></RequiresTeam> },
  { path: '/settings', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
  { path: '/invite', element: <RequiresTeam><LeaderDashboard /></RequiresTeam> },
]);

export default router;
