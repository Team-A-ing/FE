import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail } from '@/types/meeting';

export async function fetchMeetingDetail(meetingId: string): Promise<MeetingDetail> {
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/api/v1/meetings/${meetingId}`);
  return res.data.data;
}
