import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail, MeetingListItem } from '@/types/meeting';
import type { LeaderReport } from '@/types/report';

export async function fetchMeetingDetail(meetingId: string): Promise<MeetingDetail> {
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/v1/meetings/${meetingId}`);
  return res.data.data;
}

export async function uploadRecording(meetingId: string, blob: Blob, durationSec: number): Promise<void> {
  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');
  formData.append('durationSec', String(durationSec));
  await apiClient.post(`/v1/meetings/${meetingId}/recording`, formData);
}

export async function fetchMeetings(teamId: string): Promise<MeetingListItem[]> {
  const res = await apiClient.get<ApiResponse<MeetingListItem[]>>(`/v1/meetings`, {
    params: { teamId },
  });
  return res.data.data;
}

export async function fetchLeaderReport(meetingId: string): Promise<LeaderReport> {
  const res = await apiClient.get<ApiResponse<LeaderReport>>(
    `/v1/meetings/${meetingId}/leader-report`
  );
  return res.data.data;
}
