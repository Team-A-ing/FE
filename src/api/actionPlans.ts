import apiClient from './client';
import type { ApiResponse } from './types';

export async function completeActionPlan(planId: number): Promise<void> {
  await apiClient.patch<ApiResponse<null>>(`/api/v1/action-plans/${planId}/complete`);
}

export async function uncompleteActionPlan(planId: number): Promise<void> {
  await apiClient.patch<ApiResponse<null>>(`/api/v1/action-plans/${planId}/incomplete`);
}
