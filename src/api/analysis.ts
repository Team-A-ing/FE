import apiClient from './client';
import type { AnalysisStatusData } from '@/types/analysis';

interface AnalysisStatusResponse {
  data: AnalysisStatusData;
}

export async function fetchAnalysisStatus(meetingId: string): Promise<AnalysisStatusData> {
  const { data } = await apiClient.get<AnalysisStatusResponse>(`/api/v1/analysis/${meetingId}/status`);
  return data.data;
}