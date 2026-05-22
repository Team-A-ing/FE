import apiClient from './client';
import type { ApiResponse } from './types';

export async function completeActionPlan(planId: number): Promise<void> {
  await apiClient.patch<ApiResponse<null>>(`/v1/action-plans/${planId}/complete`);
}
