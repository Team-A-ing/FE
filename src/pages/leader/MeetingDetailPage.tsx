import { useParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import GapScoreGauge from '@/components/charts/GapScoreGauge'
import AnalysisLoading from '@/components/loading/AnalysisLoading'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useRecorder } from '@/features/meeting/useRecorder'
import { useUploadRecording } from '@/features/meeting/useUploadRecording'
import { useMeetingStatus } from '@/features/meeting/useMeetingStatus'
import { useAnalysisResult } from '@/features/meeting/useAnalysisResult'
import { Button } from '@/components/ui/Button'

export default function MeetingDetailPage() {
  const { meetingId } = useParams<{ meetingId: string }>()
  const { state, blob, start, stop, reset } = useRecorder()
  const { upload, isUploading, error: uploadError } = useUploadRecording()
  const { status, progress, isTimeout } = useMeetingStatus(
    isUploading || blob ? meetingId ?? null : null
  )
  const { data: result, isLoading: resultLoading } = useAnalysisResult(
    status === 'done' ? (meetingId ?? null) : null
  )

  const handleUpload = async () => {
    if (!blob || !meetingId) return
    await upload(meetingId, blob)
  }

  const isAnalyzing = ['uploading', 'analyzing'].includes(status)

  return (
    <PageLayout>
      <h1 className="mb-6 text-xl font-semibold">미팅 상세</h1>

      {/* 녹음 컨트롤 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>녹음</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {state === 'idle' && (
            <Button onClick={start}>녹음 시작</Button>
          )}
          {state === 'recording' && (
            <Button variant="destructive" onClick={stop}>녹음 종료</Button>
          )}
          {state === 'stopped' && (
            <>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? '업로드 중...' : '분석 요청'}
              </Button>
              <Button variant="outline" onClick={reset}>다시 녹음</Button>
            </>
          )}
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        </CardContent>
      </Card>

      {/* 분석 중 로딩 */}
      {isAnalyzing && (
        <AnalysisLoading
          role="leader"
          currentStep={progress < 25 ? 1 : progress < 50 ? 2 : progress < 75 ? 3 : 4}
        />
      )}

      {isTimeout && (
        <p className="text-center text-sm text-destructive">
          분석이 3분을 초과했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {/* 분석 결과 */}
      {status === 'done' && (
        <Card>
          <CardHeader>
            <CardTitle>Gap Score</CardTitle>
          </CardHeader>
          <CardContent>
            {resultLoading || !result ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <GapScoreGauge gapScore={result.gapScore} />
            )}
          </CardContent>
        </Card>
      )}
    </PageLayout>
  )
}
