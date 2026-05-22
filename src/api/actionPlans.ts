import apiClient from './client';

export async function completeActionPlan(planId: number): Promise<void> {
  await apiClient.patch(`/v1/action-plans/${planId}/complete`);
}