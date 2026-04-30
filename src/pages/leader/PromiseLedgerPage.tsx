import { useParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePromises } from '@/features/leader/usePromises'
import type { MeetingPromise } from '@/types/promise'

const statusLabel: Record<MeetingPromise['status'], string> = {
  pending: '대기 중',
  done: '완료',
  missed: '미이행',
}

const statusVariant: Record<
  MeetingPromise['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  done: 'default',
  missed: 'destructive',
}

export default function PromiseLedgerPage() {
  const { meetingId } = useParams<{ meetingId: string }>()
  const { promises, isLoading, updateStatus } = usePromises(meetingId ?? null)

  return (
    <PageLayout>
      <h1 className="mb-6 text-xl font-semibold">약속 장부</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : promises.length === 0 ? (
        <p className="text-sm text-muted-foreground">기록된 약속이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {promises.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge>
                  <div>
                    <p className="text-sm font-medium">{p.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.owner === 'leader' ? '리더' : '멤버'} 약속
                      {p.dueDate ? ` · ${p.dueDate}까지` : ''}
                    </p>
                  </div>
                </div>
                {p.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus(p.id, 'done')}>
                      완료
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(p.id, 'missed')}
                    >
                      미이행
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
