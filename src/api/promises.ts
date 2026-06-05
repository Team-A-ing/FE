import apiClient from './client';
import type { ApiResponse } from './types';
import type { OverduePromise } from '@/types/promise';

export async function fetchOverduePromises(memberId?: number | string): Promise<OverduePromise[]> {
  const res = await apiClient.get<ApiResponse<OverduePromise[]>>('/api/v1/promises/overdue', {
    params: memberId ? { memberId } : undefined,
  });

  return res.data.data;
}
