import { useEffect, useState } from 'react'
import { analysisApi } from '@/api/analysis.api'
import type { FeedbackCard } from '@/types/analysis'

export function useFeedbackCards(meetingId: string | null) {
  const [cards, setCards] = useState<FeedbackCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!meetingId) return
    setIsLoading(true)
    analysisApi
      .getResult(meetingId)
      .then((res) => setCards(res.data.data.feedbackCards))
      .catch(() => setError('피드백 카드를 불러오는데 실패했습니다.'))
      .finally(() => setIsLoading(false))
  }, [meetingId])

  return { cards, isLoading, error }
}
