import { useMemo, useState, type MouseEvent } from 'react';
import { getBlockerRankColor } from '@/utils/blockerColors';
import type { BlockerPyramidItem } from '@/types/blocker';

export interface BlockerPyramidProps {
  items: BlockerPyramidItem[];
  className?: string;
  selectedKeyword?: string | null;
  onItemClick?: (item: BlockerPyramidItem) => void;
}

type TooltipState = {
  item: BlockerPyramidItem;
  x: number;
  y: number;
} | null;

const TAG_ROW_PATTERN = [1, 3, 6];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getWeight(count: number, min: number, max: number) {
  if (max === min) return 0.7;
  return (count - min) / (max - min);
}

function getRank(sortedItems: BlockerPyramidItem[], index: number) {
  return sortedItems.reduce((rank, item, currentIndex) => {
    if (currentIndex < index && item.count > sortedItems[index].count) {
      return rank + 1;
    }

    return rank;
  }, 1);
}

function getPillStyle(
  item: BlockerPyramidItem,
  index: number,
  min: number,
  max: number,
  sortedItems: BlockerPyramidItem[],
) {
  const weight = getWeight(item.count, min, max);
  const color = getBlockerRankColor(getRank(sortedItems, index));

  return {
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    fontSize: `${clamp(14 + weight * 6, 14, 20)}px`,
    padding: `${clamp(9 + weight * 4, 9, 13)}px ${clamp(16 + weight * 10, 16, 26)}px`,
    opacity: clamp(0.9 + weight * 0.1, 0.9, 1),
    fontWeight: weight > 0.72 ? 700 : 600,
    lineHeight: 1.2,
  };
}

function arrangeRows(items: BlockerPyramidItem[]) {
  const rows: BlockerPyramidItem[][] = [];
  let cursor = 0;

  TAG_ROW_PATTERN.forEach((size) => {
    const row = items.slice(cursor, cursor + size);
    if (row.length > 0) rows.push(row);
    cursor += size;
  });

  return rows;
}

export default function BlockerPyramid({
  items,
  className = '',
  selectedKeyword,
  onItemClick,
}: BlockerPyramidProps) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword)).slice(0, 10),
    [items],
  );

  const max = sortedItems[0]?.count ?? 1;
  const min = sortedItems[sortedItems.length - 1]?.count ?? max;
  const bubbleRows = useMemo(() => arrangeRows(sortedItems), [sortedItems]);

  const showTooltip = (event: MouseEvent<HTMLElement>, item: BlockerPyramidItem) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setTooltip({
      item,
      x: bounds.left + bounds.width / 2,
      y: bounds.top,
    });
  };

  if (sortedItems.length === 0) {
    return (
      <div className={`flex h-full min-h-[360px] items-center justify-center ${className}`}>
        <span className="text-sm font-medium text-gray-400">표시할 blocker keyword가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className={`relative flex h-full min-h-[220px] w-full flex-col ${className}`}>

      <div className="relative flex-1 overflow-visible">
        <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3.5 px-2 py-2">
          {bubbleRows.map((row) => (
            <div
              key={row.map((item) => item.keyword).join('-')}
              className="flex max-w-[920px] flex-wrap items-center justify-center gap-3.5"
            >
              {row.map((item) => {
                const index = sortedItems.findIndex((candidate) => candidate.keyword === item.keyword);
                const weight = getWeight(item.count, min, max);

                return (
                  <button
                    key={item.keyword}
                    type="button"
                    onClick={() => onItemClick?.(item)}
                    onMouseEnter={(event) => showTooltip(event, item)}
                    onMouseLeave={() => setTooltip(null)}
                    className={`inline-flex max-w-[300px] items-center justify-center gap-1.5 rounded-[999px] whitespace-normal break-words text-center transition duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                      selectedKeyword === item.keyword ? 'ring-2 ring-gray-300' : ''
                    }`}
                    style={{
                      ...getPillStyle(item, index, min, max, sortedItems),
                    }}
                    aria-label={`${item.keyword}, 언급 횟수 ${item.count}, 언급 인원 수 ${item.mentionedBy}`}
                  >
                    <span>{item.keyword}</span>
                    <span className="text-[0.84em] font-semibold opacity-60">{item.count}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 w-max -translate-x-1/2 -translate-y-full rounded-lg bg-white px-3 py-2 text-xs text-gray-700 ring-1 ring-gray-100"
          style={{ left: tooltip.x, top: tooltip.y - 10 }}
        >
          <p className="font-semibold text-gray-900">{tooltip.item.keyword}</p>
          <p className="mt-1 text-gray-500">언급 횟수: {tooltip.item.count}</p>
          <p className="text-gray-500">언급 인원 수: {tooltip.item.mentionedBy}</p>
          {tooltip.item.memberNames && tooltip.item.memberNames.length > 0 && (
            <div className="mt-2 max-w-[220px]">
              <p className="mb-1 font-medium text-gray-700">언급 팀원</p>
              <div className="flex flex-wrap gap-1">
                {tooltip.item.memberNames.map((member) => (
                  <span key={member} className="rounded-full bg-gray-50 px-2 py-0.5 text-gray-500">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
