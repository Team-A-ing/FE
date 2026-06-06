import apiClient from './client';
import type { ApiResponse } from './types';
import type { MemberPromiseSummary, OverduePromise } from '@/types/promise';

export async function fetchOverduePromises(memberId?: number | string): Promise<OverduePromise[]> {
  const res = await apiClient.get<ApiResponse<OverduePromise[]>>('/api/v1/promises/overdue', {
    params: memberId ? { memberId } : undefined,
  });

  return res.data.data;
}

export async function fetchPromiseSummary(teamId: string): Promise<MemberPromiseSummary[]> {
  const res = await apiClient.get<ApiResponse<{ memberPromises: MemberPromiseSummary[] }>>(
    `/api/v1/teams/${teamId}/promises/summary`,
  );
  return res.data.data.memberPromises;
}

export async function completePromise(promiseId: string): Promise<void> {
  await apiClient.patch(`/api/v1/promises/${promiseId}`, { status: 'COMPLETED' });
}
