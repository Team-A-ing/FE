import { useEffect, useState } from 'react'
import { analysisApi } from '@/api/analysis.api'
import type { BlockerWord } from '@/types/analysis'

export function useBlockerData(teamId: string | null) {
  const [data, setData] = useState<BlockerWord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!teamId) return
    setIsLoading(true)
    analysisApi
      .getTeamBlockers(teamId)
      .then((res) => setData(res.data.data.blockers))
      .finally(() => setIsLoading(false))
  }, [teamId])

  return { data, isLoading }
}
