import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authApi.login(email, password)
      const { accessToken, user } = res.data.data
      setAuth(accessToken, user)
      navigate(user.role === 'leader' ? ROUTES.LEADER_DASHBOARD : ROUTES.MEMBER_DASHBOARD)
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
