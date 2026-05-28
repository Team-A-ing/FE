import Card from '@/components/ui/Card';
import { formatCareerDate, getCareerTypeMeta } from '@/constants/career';
import type { CareerEvent } from '@/types/career';

interface ShowcaseSectionProps {
  events: CareerEvent[];
}

function ShowcaseCard({ event }: { event: CareerEvent }) {
  const meta = getCareerTypeMeta(event.type);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <span className={`border-l-2 pl-2 text-xs font-medium ${meta.badgeClassName}`}>
          {meta.label}
        </span>
        <time className="shrink-0 text-xs font-semibold text-slate-300">{formatCareerDate(event.eventDate)}</time>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-5 text-gray-950">{event.title}</h3>
      <p className="mt-1.5 text-sm font-normal leading-5 text-slate-500">{event.description}</p>

      <div className="mt-3 flex items-end justify-between gap-4">
        {event.impactMetric ? (
          <p className="text-sm font-semibold text-slate-700">{event.impactMetric}</p>
        ) : (
          <span />
        )}
        <p className="shrink-0 text-xs font-semibold text-slate-300">{event.meetingRound}회차 1on1</p>
      </div>
    </article>
  );
}

export default function ShowcaseSection({ events }: ShowcaseSectionProps) {
  const showcaseEvents = events.slice(0, 5);

  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-950">나의 핵심 성과</h2>
      </div>

      {showcaseEvents.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {showcaseEvents.map((event) => (
            <ShowcaseCard key={event.careerEventId} event={event} />
          ))}
        </div>
      ) : (
        <Card className="rounded-lg p-6">
          <p className="text-sm font-medium text-slate-500">표시할 핵심 성과가 아직 없습니다.</p>
        </Card>
      )}
    </section>
  );
}
