import { useState } from 'react';
import type { SpeechActs, SpeechActItem } from '@/types/report';

const ACT_LABELS: Record<keyof SpeechActs, string> = {
  vulnerability: '취약성 표현 (Vulnerability)',
  constructiveDissent: '건설적 반론 (Constructive Dissent)',
  initiative: '주도성 (Initiative)',
};

function ChangeRateBadge({ rate }: { rate: number }) {
  if (rate === 0)
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
        변동없음
      </span>
    );
  const positive = rate > 0;
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
      }`}
    >
      {positive ? '+' : ''}
      {rate}%
    </span>
  );
}

function SpeechActRow({
  label,
  item,
}: {
  label: string;
  item: SpeechActItem;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className="text-lg font-bold text-[#5F74FA]">{item.count}회</span>
          <ChangeRateBadge rate={item.changeRate} />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400">평균 {item.baselineAvg}회</span>
          <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          {item.instances.length === 0 ? (
            <p className="text-xs text-gray-400">발화 예시 없음</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {item.instances.map((inst, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                    {inst.timestamp}
                  </span>
                  <span className="text-xs text-gray-700 italic">"{inst.text}"</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  data: SpeechActs;
}

export default function SpeechActsSection({ data }: Props) {
  const keys = Object.keys(ACT_LABELS) as (keyof SpeechActs)[];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        발언 행동 분석
      </h3>
      <div className="flex flex-col gap-2">
        {keys.map((key) => (
          <SpeechActRow key={key} label={ACT_LABELS[key]} item={data[key]} />
        ))}
      </div>
    </div>
  );
}
