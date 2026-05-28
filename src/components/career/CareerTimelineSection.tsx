import Card from '@/components/ui/Card';
import { formatCareerDate, getCareerTypeMeta } from '@/constants/career';
import type { CareerEvent } from '@/types/career';

interface CareerTimelineSectionProps {
  events: CareerEvent[];
}

export default function CareerTimelineSection({ events }: CareerTimelineSectionProps) {
  const sortedEvents = [...events].sort((a, b) => b.eventDate.localeCompare(a.eventDate));

  return (
    <section className="rounded-lg border border-gray-100 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-950">내 커리어 메모리</h2>
        <p className="mt-1.5 text-xs font-medium text-slate-400">
          대화에서 추출된 나의 커리어를 타임라인으로 확인하세요. 
        </p>
      </div>

      {sortedEvents.length > 0 ? (
        <div className="max-h-[360px] overflow-y-auto pr-1">
          <ol className="relative mx-auto max-w-[860px] space-y-3 before:absolute before:left-2 before:top-3 before:h-[calc(100%-24px)] before:w-px before:bg-gray-200 sm:before:left-4">
            {sortedEvents.map((event) => {
              const meta = getCareerTypeMeta(event.type);

              return (
                <li key={event.careerEventId} className="relative pl-8 sm:pl-11">
                  <span
                    className={`absolute left-[4px] top-4 h-2.5 w-2.5 rounded-full ring-4 ring-white sm:left-[12px] ${meta.dotClassName}`}
                  />
                  <Card className="rounded-lg border-gray-200 p-3 shadow-none">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                      <time className="text-xs font-semibold text-slate-300">
                        {formatCareerDate(event.eventDate)}
                      </time>
                      <span className={`w-fit text-xs font-medium ${meta.accentClassName}`}>
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-5 text-gray-900">{event.title}</h3>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <Card className="rounded-lg p-6">
          <p className="text-sm font-medium text-slate-500">표시할 커리어 메모리가 아직 없습니다.</p>
        </Card>
      )}
    </section>
  );
}
