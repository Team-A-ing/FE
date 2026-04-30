import { useAuthStore } from '@/stores/authStore'

/** 인증 상태와 유저 정보를 한 번에 조회하는 공용 훅 */
export function useAuth() {
  const { user, accessToken, clearAuth } = useAuthStore()
  return {
    user,
    isAuthenticated: !!accessToken,
    clearAuth,
  }
}
