import { useEffect, useState } from 'react'
import { surveyApi } from '@/api/survey.api'
import type { SurveyQuestion, SurveySubmitPayload } from '@/api/types'

export function useSurvey(meetingId: string | null) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!meetingId) return
    setIsLoading(true)
    surveyApi
      .getQuestions(meetingId)
      .then((res) => setQuestions(res.data.data))
      .catch(() => setError('서베이를 불러오는데 실패했습니다.'))
      .finally(() => setIsLoading(false))
  }, [meetingId])

  const submit = async (answers: SurveySubmitPayload['answers']) => {
    if (!meetingId) return
    setIsSubmitting(true)
    setError(null)
    try {
      await surveyApi.submit({ meetingId, answers })
      setSubmitted(true)
    } catch {
      setError('서베이 제출에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { questions, isLoading, isSubmitting, submitted, error, submit }
}
