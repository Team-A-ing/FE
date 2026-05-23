import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageLayout from '@/components/layout/PageLayout';
import SurveyForm from '@/components/survey/SurveyForm';
import { useMeetingDetail } from '@/features/meeting/useMeetingDetail';

export default function SurveyPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { meeting, loading, error } = useMeetingDetail(meetingId);
  const parsedMeetingId = meetingId ? Number(meetingId) : 0;

  const renderContent = () => {
    if (!meetingId || Number.isNaN(parsedMeetingId)) {
      return <p className="text-center text-sm text-slate-500">유효하지 않은 미팅입니다.</p>;
    }

    if (loading) {
      return <p className="text-center text-sm text-slate-500">미팅 정보를 불러오는 중입니다.</p>;
    }

    if (error || !meeting) {
      return <p className="text-center text-sm text-slate-500">{error ?? '미팅 정보를 찾을 수 없습니다.'}</p>;
    }

    return (
      <SurveyForm
        leaderName={meeting.leaderName}
        scheduledAt={meeting.scheduledAt}
        meetingId={parsedMeetingId}
      />
    );
  };

  return (
    <PageLayout>
      <Header title="1on1 사전 설문" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[#F7F8FA] px-5 py-8 text-gray-900">
        {renderContent()}
      </main>
    </PageLayout>
  );
}
