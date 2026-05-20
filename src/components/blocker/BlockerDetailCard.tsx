import type { BlockerCloudItem } from '@/types/blocker';

interface BlockerDetailCardProps {
  item: BlockerCloudItem;
}

export default function BlockerDetailCard({ item }: BlockerDetailCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="mt-1 text-base font-semibold text-gray-900">{item.keyword}</h3>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
            언급 {item.count}회
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
            {item.mentionedBy}명
          </span>
        </div>
      </div>

      {item.mentionedMembers && item.mentionedMembers.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-gray-500">언급 팀원</p>
          <div className="flex flex-wrap gap-1.5">
            {item.mentionedMembers.map((member) => (
              <span key={member} className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                {member}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
