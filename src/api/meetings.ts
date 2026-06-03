import apiClient from './client';
import type { ApiResponse } from './types';
import type { MeetingDetail, MeetingListItem, PreBriefingData } from '@/types/meeting';
import type {
  LeaderPromise,
  MemberPromiseCategory,
  MemberPromiseStatus,
  MemberReportData,
} from '@/types/memberReport';
import type { LeaderReport } from '@/types/report';

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

function normalizeReportDate(value: unknown, fallback: string) {
  const normalized = normalizeDate(value, fallback).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : fallback.slice(0, 10);
}

function normalizeSeverity(value: unknown): 'ERROR' | 'WARNING' | 'SUCCESS' {
  const upper = typeof value === 'string' ? value.toUpperCase() : '';
  if (upper === 'ERROR' || upper === 'WARNING' || upper === 'SUCCESS') return upper;
  return 'WARNING';
}

function normalizeDurationSec(value: unknown) {
  const duration = typeof value === 'string' ? Number(value) : value;
  return typeof duration === 'number' && Number.isFinite(duration) && duration > 0
    ? duration
    : null;
}

function normalizeMemberReport(report: MemberReportData): MemberReportData {
  const rawReport = report as MemberReportData & {
    durationSec?: unknown;
    meetingDate?: unknown;
  };
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const meetingDate = normalizeReportDate(rawReport.meetingDate, fallbackDate);

  return {
    ...report,
    meetingDate,
    durationSec: normalizeDurationSec(rawReport.durationSec),
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
        dueDate: normalizeReportDate(rawPromise.dueDate, meetingDate),
        status: isPromiseStatus(rawPromise.status) ? rawPromise.status : DEFAULT_PROMISE_STATUS,
      };
    }),
  };
}

export async function fetchMeetingDetail(meetingId: string): Promise<MeetingDetail> {
  const res = await apiClient.get<ApiResponse<MeetingDetail>>(`/api/v1/meetings/${meetingId}`);
  return res.data.data;
}

export async function fetchPreBriefing(meetingId: string): Promise<PreBriefingData> {
  const res = await apiClient.get<ApiResponse<PreBriefingData>>(
    `/api/v1/meetings/${meetingId}/pre-briefing`,
  );
  return res.data.data;
}

export async function fetchMemberReport(meetingId: string): Promise<MemberReportData> {
  const res = await apiClient.get<ApiResponse<MemberReportData>>(
    `/api/v1/meetings/${meetingId}/member-report`,
  );
  return normalizeMemberReport(res.data.data);
}

export async function uploadRecording(meetingId: string, blob: Blob, durationSec: number): Promise<void> {
  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');
  formData.append('durationSec', String(durationSec));
  await apiClient.post(`/api/v1/meetings/${meetingId}/recording`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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
  const data = res.data.data;
  return {
    ...data,
    feedbacks: (data.feedbacks ?? []).map((fb) => ({
      ...fb,
      severity: normalizeSeverity((fb as unknown as Record<string, unknown>).severity),
    })),
  };
}
