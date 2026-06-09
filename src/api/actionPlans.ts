import apiClient from './client';
import type { ApiResponse } from './types';
import type { MemberActionItems } from '@/types/actionPlan';

export async function fetchTeamActionItems(teamId: string): Promise<MemberActionItems[]> {
  const res = await apiClient.get<ApiResponse<{ memberActionPlans: MemberActionItems[] }>>(
    `/api/v1/teams/${teamId}/action-plans`,
  );
  return res.data.data.memberActionPlans;
}

export async function completeActionPlan(planId: number): Promise<void> {
  await apiClient.patch<ApiResponse<null>>(`/api/v1/action-plans/${planId}/complete`);
}

export async function uncompleteActionPlan(planId: number): Promise<void> {
  await apiClient.patch<ApiResponse<null>>(`/api/v1/action-plans/${planId}/incomplete`);
}
