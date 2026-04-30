import { apiClient } from './client'
import type { ApiResponse, LoginResponse, SignupResponse } from './types'

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }),

  signup: (email: string, password: string, name: string, role: 'leader' | 'member') =>
    apiClient.post<ApiResponse<SignupResponse>>('/auth/signup', { email, password, name, role }),

  logout: () => apiClient.post('/auth/logout'),
}
