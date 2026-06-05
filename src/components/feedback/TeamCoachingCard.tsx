import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { TeamCoachingData } from '@/types/coaching';

interface Props {
  data: TeamCoachingData;
}

export default function TeamCoachingCard({ data }: Props) {
  return (
    <Card className="mb-5 p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        팀 코칭
      </p>

      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
        <p className="text-sm text-gray-700">{data.overallAssessment}</p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {data.insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2">
            <Badge
              label={insight.type === 'ATTENTION' ? '주의' : '긍정'}
              color={insight.type === 'ATTENTION' ? 'orange' : 'green'}
            />
            <p className="text-sm text-gray-800 flex-1">{insight.content}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        제안 액션
      </p>
      <div className="flex flex-col gap-2">
        {data.suggestedActions.map((action, i) => (
          <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-teal-600 flex-shrink-0">{i + 1}.</span>
            <p className="text-sm text-gray-700">{action}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
