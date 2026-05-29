import apiClient from './client';
import type { ApiResponse } from './types';
import type { BlockerPyramidData } from '@/types/blocker';
import type { RadarDataPoint } from '@/types/analysis';
import type { TeamHealthScoreData } from '@/types/teamHealth';

export async function fetchTeamDashboard(teamId: string): Promise<TeamHealthScoreData> {
  const res = await apiClient.get<ApiResponse<TeamHealthScoreData>>(
    `/api/v1/teams/${teamId}/dashboard`,
  );
  return res.data.data;
}

export async function fetchBlockerPyramid(teamId: string): Promise<BlockerPyramidData> {
  const res = await apiClient.get<ApiResponse<BlockerPyramidData>>(
    `/api/v1/teams/${teamId}/blocker-pyramid`,
  );
  return res.data.data;
}

export async function fetchTeamQuadrant(teamId: string): Promise<RadarDataPoint[]> {
  const res = await apiClient.get<ApiResponse<RadarDataPoint[]>>(
    `/api/v1/teams/${teamId}/quadrant`,
  );
  return res.data.data;
}
