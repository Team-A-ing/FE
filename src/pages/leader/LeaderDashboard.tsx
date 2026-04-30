import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import ScatterRadar from '@/components/charts/ScatterRadar'
import BlockerCloud from '@/components/charts/BlockerCloud'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useRadarData } from '@/features/leader/useRadarData'
import { useBlockerData } from '@/features/leader/useBlockerData'
import { useAuth } from '@/features/common/useAuth'
import { ROUTES } from '@/constants/routes'

export default function LeaderDashboard() {
  const { user } = useAuth()
  const teamId = user?.teamId ?? null
  const { data: radarData, isLoading: radarLoading } = useRadarData(teamId)
  const { data: blockerData, isLoading: blockerLoading } = useBlockerData(teamId)
  const navigate = useNavigate()

  return (
    <PageLayout>
      <h1 className="mb-6 text-xl font-semibold">팀 대시보드</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Silent Risk Radar</CardTitle>
          </CardHeader>
          <CardContent>
            {radarLoading ? (
              <Skeleton className="h-[360px] w-full" />
            ) : (
              <ScatterRadar
                data={radarData}
                onMemberClick={(memberId) =>
                  navigate(ROUTES.LEADER_MEETING(memberId))
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocker Cloud</CardTitle>
          </CardHeader>
          <CardContent>
            {blockerLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <BlockerCloud data={blockerData} />
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
