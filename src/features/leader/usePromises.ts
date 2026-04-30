import { useEffect, useState } from 'react'
import { analysisApi } from '@/api/analysis.api'
import type { MeetingPromise } from '@/types/promise'

export function usePromises(meetingId: string | null) {
  const [promises, setPromises] = useState<MeetingPromise[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!meetingId) return
    setIsLoading(true)
    analysisApi
      .getPromiseLedger(meetingId)
      .then((res) => setPromises(res.data.data.promises))
      .finally(() => setIsLoading(false))
  }, [meetingId])

  const updateStatus = async (promiseId: string, status: 'done' | 'missed') => {
    await analysisApi.updatePromiseStatus(promiseId, status)
    setPromises((prev) =>
      prev.map((p) => (p.id === promiseId ? { ...p, status } : p))
    )
  }

  return { promises, isLoading, updateStatus }
}
