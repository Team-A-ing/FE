import PageLayout from '@/components/layout/PageLayout'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCareerMemory } from '@/features/member/useCareerMemory'
import { useAuth } from '@/features/common/useAuth'
import type { CareerMemoryItem } from '@/types/analysis'

const typeLabel: Record<CareerMemoryItem['type'], string> = {
  achievement: '성취',
  concern: '고민',
  learning: '배움',
}

const typeVariant: Record<
  CareerMemoryItem['type'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  achievement: 'default',
  concern: 'destructive',
  learning: 'secondary',
}

export default function MemberDashboard() {
  const { user } = useAuth()
  const { timeline, isLoading } = useCareerMemory(user?.id ?? null)

  return (
    <PageLayout>
      <h1 className="mb-6 text-xl font-semibold">커리어 메모리</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        1on1 미팅에서 AI가 자동 추출한 나의 성장 기록입니다.
      </p>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 기록된 커리어 메모리가 없습니다.</p>
      ) : (
        <ol className="relative border-l border-border">
          {timeline.map((item) => (
            <li key={item.id} className="mb-8 ml-6">
              <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
              <div className="flex items-center gap-2">
                <time className="text-xs text-muted-foreground">{item.date}</time>
                <Badge variant={typeVariant[item.type]}>{typeLabel[item.type]}</Badge>
                <span className="text-sm font-medium">{item.keyword}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
            </li>
          ))}
        </ol>
      )}
    </PageLayout>
  )
}
