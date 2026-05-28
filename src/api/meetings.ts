import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail, MeetingListItem } from '@/types/meeting';
import type {
  LeaderPromise,
  MemberPromiseCategory,
  MemberPromiseStatus,
  MemberReportData,
} from '@/types/memberReport';

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

const DEFAULT_PROMISE_CATEGORY: MemberPromiseCategory = 'PROCESS';
const DEFAULT_PROMISE_STATUS: MemberPromiseStatus = 'PENDING';

function isPromiseCategory(value: unknown): value is MemberPromiseCategory {
  return (
    value === 'RESOURCE' ||
    value === 'TEAM_BUILDING' ||
    value === 'RECOGNITION' ||
    value === 'PROCESS'
  );
}

function isPromiseStatus(value: unknown): value is MemberPromiseStatus {
  return value === 'PENDING' || value === 'DONE';
}

function normalizeDate(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function normalizeMemberReport(report: MemberReportData): MemberReportData {
  const fallbackDate = normalizeDate(report.meetingDate, new Date().toISOString()).slice(0, 10);

  return {
    ...report,
    leaderPromises: (report.leaderPromises ?? []).map((promise, index) => {
      const rawPromise = promise as LeaderPromise & {
        category?: unknown;
        dueDate?: unknown;
        status?: unknown;
      };

      return {
        ...promise,
        promiseId: promise.promiseId ?? -(index + 1),
        content: promise.content ?? '',
        category: isPromiseCategory(rawPromise.category)
          ? rawPromise.category
          : DEFAULT_PROMISE_CATEGORY,
        dueDate: normalizeDate(rawPromise.dueDate, fallbackDate),
        status: isPromiseStatus(rawPromise.status) ? rawPromise.status : DEFAULT_PROMISE_STATUS,
      };
    }),
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
  return normalizeMemberReport(res.data.data);
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
