import { useParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import FeedbackCardList from '@/components/feedback/FeedbackCardList'
import AnalysisLoading from '@/components/loading/AnalysisLoading'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFeedbackCards } from '@/features/member/useFeedbackCards'
import { useMeetingStatus } from '@/features/meeting/useMeetingStatus'

export default function MeetingFeedbackPage() {
  const { meetingId } = useParams<{ meetingId: string }>()
  const { status, progress, isTimeout } = useMeetingStatus(meetingId ?? null)
  const { cards, isLoading, error } = useFeedbackCards(
    status === 'done' ? (meetingId ?? null) : null
  )

  const isAnalyzing = ['uploading', 'analyzing'].includes(status)

  return (
    <PageLayout>
      <h1 className="mb-6 text-xl font-semibold">코칭 피드백</h1>

      {isAnalyzing && (
        <AnalysisLoading
          role="member"
          currentStep={progress < 25 ? 1 : progress < 50 ? 2 : progress < 75 ? 3 : 4}
        />
      )}

      {isTimeout && (
        <p className="text-center text-sm text-destructive">
          분석이 3분을 초과했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {status === 'done' && (
        <>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <FeedbackCardList cards={cards} />
          )}
        </>
      )}
    </PageLayout>
  )
}
