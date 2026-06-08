import apiClient from './client';
import type { ApiResponse } from './types';
import type { BlockerPyramidData } from '@/types/blocker';
import type { CommunicationBalance, RadarDataPoint } from '@/types/analysis';
import type { TeamHealthScoreData } from '@/types/teamHealth';
import type { TeamCoachingData } from '@/types/coaching';

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

export async function fetchTalkRatioRanking(teamId: string): Promise<CommunicationBalance[]> {
  const res = await apiClient.get<ApiResponse<CommunicationBalance[]>>(
    `/api/v1/teams/${teamId}/talk-ratio-ranking`,
  );
  return res.data.data;
}

export async function fetchTeamCoaching(teamId: string): Promise<TeamCoachingData> {
  const res = await apiClient.get<ApiResponse<TeamCoachingData>>(
    `/api/v1/teams/${teamId}/coaching`,
  );
  return res.data.data;
}
