import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail } from '@/types/meeting';

export async function fetchMeetingDetail(meetingId: string): Promise<MeetingDetail> {
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/api/v1/meetings/${meetingId}`);
  return res.data.data;
}

export async function uploadRecording(meetingId: string, blob: Blob, durationSec: number): Promise<void> {
  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');
  formData.append('durationSec', String(durationSec));
  await apiClient.post(`/api/v1/meetings/${meetingId}/recording`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}