import { apiClient } from './client'
import type { ApiResponse, UploadRecordingResponse, MeetingStatusResponse } from './types'

export const meetingApi = {
  /**
   * 통짜 WebM 파일을 multipart/form-data 로 전송.
   * Whisper API 25MB 제한 주의 — BE에서 검증.
   */
  uploadRecording: (meetingId: string, blob: Blob) => {
    const form = new FormData()
    form.append('meetingId', meetingId)
    form.append('recording', blob, `${meetingId}.webm`)
    return apiClient.post<ApiResponse<UploadRecordingResponse>>('/meetings/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000, // 대용량 파일 업로드 여유
    })
  },

  getStatus: (meetingId: string) =>
    apiClient.get<ApiResponse<MeetingStatusResponse>>(`/meetings/${meetingId}/status`),

  createMeeting: (memberId: string, scheduledAt: string) =>
    apiClient.post('/meetings', { memberId, scheduledAt }),
}
