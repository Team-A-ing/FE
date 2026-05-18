import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageLayout from '@/components/layout/PageLayout';
import SurveyForm from '@/components/survey/SurveyForm';

export default function SurveyPage() {
  const { meetingId } = useParams<{ meetingId: string }>();

  return (
    <PageLayout>
      <Header title="1on1 사전 설문" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[#F7F8FA] px-5 py-8 text-gray-900">
        <SurveyForm
          leaderName="이준혁"
          scheduledAt={new Date().toISOString()}
          meetingId={Number(meetingId ?? '0')}
        />
      </main>
    </PageLayout>
  );
}
