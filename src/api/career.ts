import apiClient from './client';
import type { ApiResponse } from './types';
import type { CareerEvent, CareerEventType, CareerStats } from '@/types/career';

export async function fetchCareerStats(memberId: string): Promise<CareerStats> {
  const res = await apiClient.get<ApiResponse<CareerStats>>(`/v1/members/${memberId}/career-stats`);
  return res.data.data;
}

export async function fetchCareerShowcase(memberId: string): Promise<CareerEvent[]> {
  const res = await apiClient.get<ApiResponse<CareerEvent[]>>(
    `/v1/members/${memberId}/career-showcase`,
  );
  return res.data.data.slice(0, 5);
}

export async function fetchCareerTimeline(
  memberId: string,
  type?: CareerEventType,
): Promise<CareerEvent[]> {
  const res = await apiClient.get<ApiResponse<CareerEvent[]>>(
    `/v1/members/${memberId}/career-timeline`,
    { params: type ? { type } : undefined },
  );
  return [...res.data.data].sort((a, b) => b.eventDate.localeCompare(a.eventDate));
}
