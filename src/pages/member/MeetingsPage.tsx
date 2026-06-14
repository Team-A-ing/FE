import { ROUTES } from "@/constants/routes";
import LeaderMeetingsPage from "@/pages/leader/MeetingsPage";

export default function MemberMeetingsPage() {
  return (
    <LeaderMeetingsPage
      showCreateButton={false}
      getMeetingPath={ROUTES.MEMBER_MEETING}
      showTeamPanels={false}
    />
  );
}
