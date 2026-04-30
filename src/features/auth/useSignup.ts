import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/user'

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.signup(email, password, name, role)
      navigate(ROUTES.LOGIN)
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
