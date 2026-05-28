import type { CareerEventType } from '@/types/career';

interface CareerTypeMeta {
  label: string;
  badgeClassName: string;
  dotClassName: string;
  accentClassName: string;
}

export const careerTypeMeta: Record<CareerEventType, CareerTypeMeta> = {
  ACHIEVEMENT: {
    label: '성취',
    badgeClassName: 'border-emerald-200 text-emerald-700',
    dotClassName: 'bg-emerald-500',
    accentClassName: 'text-emerald-700',
  },
  PROPOSAL_ADOPTED: {
    label: '제안 채택',
    badgeClassName: 'border-blue-200 text-blue-700',
    dotClassName: 'bg-blue-600',
    accentClassName: 'text-blue-700',
  },
  LEARNING: {
    label: '배움',
    badgeClassName: 'border-orange-200 text-orange-700',
    dotClassName: 'bg-orange-500',
    accentClassName: 'text-orange-700',
  },
  BLOCKER: {
    label: '고민',
    badgeClassName: 'border-gray-200 text-gray-700',
    dotClassName: 'bg-gray-500',
    accentClassName: 'text-gray-700',
  },
};

export function getCareerTypeMeta(type: CareerEventType) {
  return careerTypeMeta[type];
}

export function formatCareerDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}
