import { useEffect, useState } from 'react'
import { analysisApi } from '@/api/analysis.api'
import type { CareerMemoryItem } from '@/types/analysis'

export function useCareerMemory(memberId: string | null) {
  const [timeline, setTimeline] = useState<CareerMemoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!memberId) return
    setIsLoading(true)
    analysisApi
      .getCareerMemory(memberId)
      .then((res) => setTimeline(res.data.data.timeline))
      .finally(() => setIsLoading(false))
  }, [memberId])

  return { timeline, isLoading }
}
