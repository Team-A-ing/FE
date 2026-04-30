import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSurvey } from '@/features/member/useSurvey'

export default function SurveyPage() {
  const { meetingId } = useParams<{ meetingId: string }>()
  const { questions, isLoading, isSubmitting, submitted, error, submit } = useSurvey(
    meetingId ?? null
  )
  const [answers, setAnswers] = useState<Record<string, string | number>>({})

  const handleChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = questions.map((q) => ({
      questionId: q.id,
      value: answers[q.id] ?? '',
    }))
    submit(payload)
  }

  if (submitted) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center gap-3 py-20">
          <p className="text-lg font-semibold">서베이 제출 완료!</p>
          <p className="text-sm text-muted-foreground">
            미팅 후 AI 분석이 완료되면 피드백 카드를 확인할 수 있어요.
          </p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <h1 className="mb-6 text-xl font-semibold">사전 서베이</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        미팅 전 현재 상태를 솔직하게 답해주세요. 리더에게는 공개되지 않습니다.
      </p>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="text-sm font-medium">{q.text}</label>
              {q.type === 'scale' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">1</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={Number(answers[q.id] ?? 5)}
                    onChange={(e) => handleChange(q.id, Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground">10</span>
                  <span className="w-6 text-center text-sm font-medium">
                    {answers[q.id] ?? 5}
                  </span>
                </div>
              ) : (
                <Input
                  placeholder="자유롭게 입력해주세요"
                  value={String(answers[q.id] ?? '')}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '제출 중...' : '서베이 제출'}
          </Button>
        </form>
      )}
    </PageLayout>
  )
}
