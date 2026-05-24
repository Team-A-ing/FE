import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail, MeetingListItem } from '@/types/meeting';
import type { LeaderReport } from '@/types/report';
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
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/api/v1/meetings/${meetingId}`);
  return res.data.data;
}

export async function fetchMemberReport(meetingId: string): Promise<MemberReportData> {
  const res = await apiClient.get<ApiResponse<MemberReportData>>(
    `/api/v1/meetings/${meetingId}/member-report`,
  );
  return res.data.data;
}

export async function uploadRecording(meetingId: string, blob: Blob, durationSec: number): Promise<void> {
  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');
  formData.append('durationSec', String(durationSec));
  await apiClient.post(`/api/v1/meetings/${meetingId}/recording`, formData);
}

export async function fetchMeetings(teamId: string): Promise<MeetingListItem[]> {
  const res = await apiClient.get<ApiResponse<MeetingListItem[]>>(`/api/v1/meetings`, {
    params: { teamId },
  });
  return res.data.data;
}

export async function submitSurvey(payload: SubmitSurveyPayload): Promise<void> {
  await apiClient.post<ApiResponse<void>>('/api/v1/surveys', payload);
}

export async function fetchSurvey(meetingId: string): Promise<SurveyData> {
  const res = await apiClient.get<ApiResponse<SurveyData>>(`/api/v1/surveys/${meetingId}`);
  return res.data.data;
}


export async function fetchLeaderReport(meetingId: string): Promise<LeaderReport> {
  const res = await apiClient.get<ApiResponse<LeaderReport>>(
    `/api/v1/meetings/${meetingId}/leader-report`
  );
  return res.data.data;
}
