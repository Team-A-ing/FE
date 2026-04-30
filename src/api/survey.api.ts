import { apiClient } from './client'
import type { ApiResponse, SurveyQuestion, SurveySubmitPayload } from './types'

export const surveyApi = {
  getQuestions: (meetingId: string) =>
    apiClient.get<ApiResponse<SurveyQuestion[]>>(`/surveys/${meetingId}/questions`),

  submit: (payload: SurveySubmitPayload) =>
    apiClient.post<ApiResponse<void>>('/surveys/submit', payload),
}
