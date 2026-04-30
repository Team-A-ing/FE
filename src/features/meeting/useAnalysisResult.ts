import { useEffect, useState } from 'react'
import { analysisApi } from '@/api/analysis.api'
import type { AnalysisResultResponse } from '@/api/types'

export function useAnalysisResult(meetingId: string | null) {
  const [data, setData] = useState<AnalysisResultResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!meetingId) return
    setIsLoading(true)
    analysisApi
      .getResult(meetingId)
      .then((res) => setData(res.data.data))
      .catch(() => setError('분석 결과를 불러오는데 실패했습니다.'))
      .finally(() => setIsLoading(false))
  }, [meetingId])

  return { data, isLoading, error }
}
