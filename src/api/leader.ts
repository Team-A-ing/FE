import apiClient from './client';
import type { ApiResponse } from './types';
import type { LeaderGrowthData } from '@/types/leaderGrowth';

export async function fetchLeaderGrowth(): Promise<LeaderGrowthData> {
  const res = await apiClient.get<ApiResponse<LeaderGrowthData>>('/api/v1/leaders/me/growth');
  return res.data.data;
}
