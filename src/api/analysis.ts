import apiClient from './client';
import type { ApiResponse } from './types';
import type { AnalysisStatusData, AnalysisStepKey } from '@/types/analysis';
import { WITTY_COPIES } from '@/components/loading/loadingCopies';

interface BackendAnalysisStatus {
  meetingId: number;
  status: string;
  progressPercent: number;
}

// status → 4단계 표시용 매핑 (진행 퍼센트: CREATED=0, TRANSCRIBING=30, ANALYZING=50, COMPLETED=100, FAILED=-1)
const STEP_INFO: Record<string, { stepNumber: number; stepLabel: string; wittyIndex: number }> = {
  CREATED:      { stepNumber: 1, stepLabel: 'STT 변환',    wittyIndex: 0 },
  TRANSCRIBING: { stepNumber: 1, stepLabel: 'STT 변환',    wittyIndex: 0 },
  ANALYZING:    { stepNumber: 2, stepLabel: 'NLP 분석',    wittyIndex: 1 },
  COMPLETED:    { stepNumber: 4, stepLabel: '완료',        wittyIndex: 3 },
  FAILED:       { stepNumber: 4, stepLabel: '실패',        wittyIndex: 3 },
};

function mapToStatusData(raw: BackendAnalysisStatus): AnalysisStatusData {
  const info = STEP_INFO[raw.status] ?? { stepNumber: 1, stepLabel: '분석 중', wittyIndex: 0 };
  return {
    meetingId: raw.meetingId,
    step: raw.status as AnalysisStepKey,
    stepNumber: info.stepNumber,
    totalSteps: 4,
    progress: Math.max(0, raw.progressPercent), // FAILED(-1)는 0으로 처리
    stepLabel: info.stepLabel,
    wittyMessage: {
      leader: WITTY_COPIES.leader[info.wittyIndex],
      member: WITTY_COPIES.member[info.wittyIndex],
    },
  };
}

export async function fetchAnalysisStatus(meetingId: string): Promise<AnalysisStatusData> {
  const { data } = await apiClient.get<ApiResponse<BackendAnalysisStatus>>(
    `/api/v1/meetings/${meetingId}/status`,
  );
  return mapToStatusData(data.data);
}