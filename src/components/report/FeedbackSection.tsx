import { useState } from 'react';
import type { Feedback } from '@/types/report';

const SEVERITY_ORDER: Record<Feedback['severity'], number> = {
  ERROR: 0,
  WARNING: 1,
  SUCCESS: 2,
};

const SEVERITY_CONFIG: Record<
  Feedback['severity'],
  { border: string; icon: string; bg: string; label: string }
> = {
  ERROR: {
    border: 'border-red-300',
    icon: '🔴',
    bg: 'bg-red-50',
    label: '개선 필요',
  },
  WARNING: {
    border: 'border-yellow-300',
    icon: '🟡',
    bg: 'bg-yellow-50',
    label: '주의',
  },
  SUCCESS: {
    border: 'border-green-300',
    icon: '🟢',
    bg: 'bg-green-50',
    label: '잘하고 있어요',
  },
};

function FeedbackItem({ item }: { item: Feedback }) {
  const [expanded, setExpanded] = useState(item.severity === 'ERROR');
  const config = SEVERITY_CONFIG[item.severity];

  return (
    <div className={`border rounded-xl overflow-hidden ${config.border}`}>
      <button
        className={`w-full flex items-center justify-between px-4 py-3 text-left ${config.bg} hover:brightness-95 transition-all`}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0">{config.icon}</span>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[16px] font-medium text-gray-800">{item.actionGuide}</span>
            <span className="text-[12px] font-light text-gray-400">{item.title}</span>
          </div>
        </div>
        <span className="text-gray-400 text-sm flex-shrink-0 ml-2">
          {expanded ? '▲' : '▼'}
        </span>
      </button>
      {expanded && (
        <div className="px-4 py-3 flex flex-col gap-3 border-t border-gray-100 bg-white">
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">근거 발화</p>
            <p className="text-sm text-gray-600 italic bg-gray-50 rounded px-3 py-2 leading-relaxed">
              {item.evidenceQuote}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">데이터 요약</p>
            <p className="text-sm text-gray-600 leading-relaxed">{item.dataSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  items: Feedback[];
}

export default function FeedbackSection({ items }: Props) {
  const sorted = [...items].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        상세 피드백
      </h3>
      <div className="flex flex-col gap-2">
        {sorted.map((item) => (
          <FeedbackItem key={item.feedbackId} item={item} />
        ))}
      </div>
    </div>
  );
}
