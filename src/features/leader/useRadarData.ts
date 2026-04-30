import { useEffect, useState } from 'react'
import { analysisApi } from '@/api/analysis.api'
import type { RadarMember } from '@/types/analysis'

export function useRadarData(teamId: string | null) {
  const [data, setData] = useState<RadarMember[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!teamId) return
    setIsLoading(true)
    analysisApi
      .getTeamRadar(teamId)
      .then((res) => setData(res.data.data.members))
      .finally(() => setIsLoading(false))
  }, [teamId])

  return { data, isLoading }
}
