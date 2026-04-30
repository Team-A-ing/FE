import { apiClient } from './client'
import type {
  ApiResponse,
  AnalysisResultResponse,
  TeamRadarResponse,
  TeamBlockerResponse,
  CareerMemoryResponse,
  PromiseLedgerResponse,
} from './types'

export const analysisApi = {
  getResult: (meetingId: string) =>
    apiClient.get<ApiResponse<AnalysisResultResponse>>(`/analysis/${meetingId}`),

  getTeamRadar: (teamId: string) =>
    apiClient.get<ApiResponse<TeamRadarResponse>>(`/analysis/team/${teamId}/radar`),

  getTeamBlockers: (teamId: string) =>
    apiClient.get<ApiResponse<TeamBlockerResponse>>(`/analysis/team/${teamId}/blockers`),

  getCareerMemory: (memberId: string) =>
    apiClient.get<ApiResponse<CareerMemoryResponse>>(`/analysis/member/${memberId}/career`),

  getPromiseLedger: (meetingId: string) =>
    apiClient.get<ApiResponse<PromiseLedgerResponse>>(`/meetings/${meetingId}/promises`),

  updatePromiseStatus: (promiseId: string, status: 'done' | 'missed') =>
    apiClient.patch(`/promises/${promiseId}`, { status }),
}
