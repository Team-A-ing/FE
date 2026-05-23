import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail, MeetingListItem } from '@/types/meeting';
import type { MemberReportData } from '@/types/memberReport';

export interface SubmitSurveyPayload {
  meetingId: number;
  scores: {
    issues: string[];
    energyLevel: number;
    desiredRoles: string[];
  };
}

export interface SurveyData {
  id: number;
  meetingId: number;
  memberId: number;
  scores: {
    issues?: string[];
    energyLevel?: number;
    desiredRoles?: string[];
    [key: string]: unknown;
  };
}

export async function fetchMeetingDetail(meetingId: string): Promise<MeetingDetail> {
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/v1/meetings/${meetingId}`);
  return res.data.data;
}

export async function fetchMemberReport(meetingId: string): Promise<MemberReportData> {
  const res = await apiClient.get<ApiResponse<MemberReportData>>(
    `/v1/meetings/${meetingId}/member-report`,
  );
  return res.data.data;
}

export async function uploadRecording(meetingId: string, blob: Blob, durationSec: number): Promise<void> {
  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');
  formData.append('durationSec', String(durationSec));
  await apiClient.post(`/v1/meetings/${meetingId}/recording`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function fetchMeetings(teamId: string): Promise<MeetingListItem[]> {
  const res = await apiClient.get<ApiResponse<MeetingListItem[]>>(`/v1/meetings`, {
    params: { teamId },
  });
  return res.data.data;
}

export async function submitSurvey(payload: SubmitSurveyPayload): Promise<void> {
  await apiClient.post<ApiResponse<void>>('/v1/surveys', payload);
}

export async function fetchSurvey(meetingId: string): Promise<SurveyData> {
  const res = await apiClient.get<ApiResponse<SurveyData>>(`/v1/surveys/${meetingId}`);
  return res.data.data;
}
