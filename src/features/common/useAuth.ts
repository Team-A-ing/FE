import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  return { user, token, setAuth, clearAuth, isAuthenticated: !!token };
}
