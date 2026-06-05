import type { PromisesData } from '@/types/report';

const CATEGORY_LABELS: Record<string, string> = {
  RESOURCE: '리소스',
  TEAM_BUILDING: '팀 빌딩',
  RECOGNITION: '인정',
};

interface Props {
  data: PromisesData;
}

export default function PromisesSection({ data }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        약속 장부
      </h3>
      <div className="flex flex-col gap-4">
        {/* Previous promises */}
        {data.previous.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-500">이전 약속</p>
            </div>
            {data.previous.map((p, idx) => (
              <div key={p.promiseId}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-base flex-shrink-0">
                    {p.status === 'DONE'
                      ? <span className="text-green-500 font-bold">✓</span>
                      : <span className="text-red-400 font-bold">✕</span>
                    }
                  </span>
                  <span
                    className={`text-sm flex-1 ${
                      p.status === 'MISSED' ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {p.content}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      p.status === 'DONE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {p.status === 'DONE' ? '이행' : '미이행'}
                  </span>
                </div>
                {idx < data.previous.length - 1 && (
                  <div className="border-t border-gray-100" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* New promises */}
        {data.new.length > 0 && (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-500">새 약속</p>
            </div>
            {data.new.map((p, idx) => (
              <div key={p.promiseId}>
                <div className="flex items-start gap-3 px-4 py-3">
                  <span className="text-sm flex-1 text-gray-700">{p.content}</span>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                    <span className="text-xs text-gray-400">{p.dueDate}</span>
                  </div>
                </div>
                {idx < data.new.length - 1 && (
                  <div className="border-t border-gray-100" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
