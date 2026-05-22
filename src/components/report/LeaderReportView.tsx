import { useState } from 'react';
import { useLeaderReport } from '@/features/meeting/useLeaderReport';
import GapsSection from './GapsSection';
import SpeechActsSection from './SpeechActsSection';
import TalkRatioSection from './TalkRatioSection';
import FeedbackSection from './FeedbackSection';
import ActionPlanSection from './ActionPlanSection';
import PromisesSection from './PromisesSection';

type ReportTab = 'analysis' | 'feedback';

interface Props {
  meetingId: string;
}

export default function LeaderReportView({ meetingId }: Props) {
  const { report, loading, error, retry } = useLeaderReport(meetingId);
  const [activeTab, setActiveTab] = useState<ReportTab>('analysis');

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
        <div className="w-8 h-8 border-4 border-[#5F74FA] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">리포트를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
        <p className="text-sm text-red-500">{error ?? '리포트를 불러오지 못했습니다.'}</p>
        <button
          onClick={retry}
          className="px-5 py-2.5 rounded-lg bg-[#5F74FA] text-sm text-white font-medium hover:bg-[#4E62E6]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 px-8">
        {(['analysis', 'feedback'] as ReportTab[]).map((tab) => {
          const label = tab === 'analysis' ? '미팅 분석' : '리더 맞춤 피드백';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 pt-4 mr-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#5F74FA] text-[#5F74FA]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-8">
        {activeTab === 'analysis' && (
          <>
            <GapsSection data={report.gaps} />
            <SpeechActsSection data={report.speechActs} />
            <TalkRatioSection data={report.talkRatio} />
          </>
        )}
        {activeTab === 'feedback' && (
          <>
            <FeedbackSection items={report.feedbacks} />
            <ActionPlanSection items={report.nextActionPlans} />
            <PromisesSection data={report.promises} />
          </>
        )}
      </div>
    </div>
  );
}
